exports.UserMgr = function() {
  var _ = require('underscore');
  var passwordHash = require('password-hash');

  var Modules = require('./Modules.js');

  var config = Modules.Config;

  var database = Modules.Database;

  var roleMgrModule = require('./RoleMgr.js');
  var roleMgr = new roleMgrModule.RoleMgr();  

  var currentRequest;
  
  var usersHash = {};

  return {

    setRequest: function (request) {
      currentRequest = request;
    },

    isSessionExist: function (sessionID) {
      if (sessionID && usersHash[sessionID]) {
        var user = usersHash[sessionID];
        user.pingLast = Date.now();
        return true;
      }
      else
        return false;
    },
    
    isActionSecure: function (action) {
      return roleMgr.isActionSecure(action);
    },
    
    hasAccess: function (action, sessionID) {
      if (sessionID && usersHash[sessionID] && usersHash[sessionID].roleObj) {
        return usersHash[sessionID].roleObj.hasAccess(action);
      }
      else
        return false;
    },

    updateMgr: function () {
      var keys = _.keys(usersHash);
      var delUsers = [];
      var dtNow = Date.now();
      _.each(keys, function (key) {
        var user = usersHash[key];
        if (user.pingLast) {
          if ((dtNow - user.pingLast) > config.SERVER.SESSION_TIME) {
            delUsers.push(user);
          }
        } else {
          delUsers.push(user);
        }        
      });

      _.each(delUsers, function (user) {
        delete usersHash[user.sessionID];
      });
    },

    pingSession: function (data, objResponse, callback) {
      if (currentRequest && currentRequest.sessionID && usersHash[currentRequest.sessionID]) {
        objResponse.data = {
          user: usersHash[currentRequest.sessionID],
        };
      } else {
        objResponse.error = "User doesn't have the session!";
      }
      if (callback)
        callback();
    },

    logout: function (data, objResponse, callback) {
      if (currentRequest && currentRequest.sessionID && usersHash[currentRequest.sessionID]) {
        objResponse.data = {
          user: usersHash[currentRequest.sessionID],
        };
        delete usersHash[currentRequest.sessionID];
      }
      if (callback)
        callback();
    },

    login: function (data, objResponse, callback) {
      if (!data || !data.user || !data.user.name || !data.user.password) {
        objResponse.error = "Error: data";
        if (callback)
          callback();
        return;
      }

      var self = this;

      var getUsersResponse = {};
      data.isPasswordGet = true;
      self.getUsers(data, getUsersResponse, function () {
        var userFound;
        if (!(getUsersResponse.error && getUsersResponse.error != "")) {
          var users = getUsersResponse.data;
          userFound = _.findWhere(users, { name: data.user.name });
          if (userFound) {
            var isPasswordVerified = passwordHash.verify(data.user.password, userFound.password);
            if (!isPasswordVerified)
              objResponse.error = "Password isn't correct!";
            else {
              data.user = userFound;
            }
          } else {
            objResponse.error = "User isn't found!";
          }
        } else {
          objResponse.error = getUsersResponse.error;
        }
        // checking on "root" user
        if (objResponse.error && config.DATABASE) {
          if (data.user.name === config.DATABASE.user) {
            if (data.user.password !== config.DATABASE.pass)
              objResponse.error = "Password isn't correct!";
            else {
              objResponse.error = "";
              data.user.role = config.USERS.ROLE_ADMINISTRATOR;
              //userFound = data.user;
            }
          }
        }

        if (!objResponse.error && data.user) {
          data.user.roleObj = roleMgr.getRoleObj(data.user.role);
          var hasAccesss = data.user.roleObj.hasAccess("login");
          if(!hasAccesss)
            objResponse.error = "User doesn't have the access for this operation!";
          else {
            
          }
        }

        // setting of the "session" for the user
        if (objResponse.isOK && currentRequest && currentRequest.sessionID) {
          data.user.sessionID = currentRequest.sessionID;
          data.user.pingLast = Date.now();          
          objResponse.data = data;          

          // save the user on the server
          if (!usersHash[data.user.sessionID]) {
            usersHash[data.user.sessionID] = data.user;
          }
        }
        
        if (callback)
          callback();
      });
    },
    
    newUser: function (data, objResponse, callback) {
      if (!data || !data.user) {
        objResponse.error = "Error: data";
        if (callback)
          callback();
        return;
      }

      var addUserCallback = function (dataResponse) {
        if (!(objResponse.error && objResponse.error != "") && dataResponse.id) {
          objResponse.data = data;
        }
        if (callback)
          callback();
      };
      this.insertIntoUsers(data.user, objResponse, addUserCallback);
    },
    
    removeUser: function (data, objResponse, callback) {
      if (!data || !data.user) {
        objResponse.error = "Error: data";
        if (callback)
          callback();
        return;
      }

      var removeUserCallback = function (dataResponse) {
        if (!(objResponse.error && objResponse.error != "")) {
          objResponse.data = data;
        }
        if (callback)
          callback();
      };
      this.deleteFromUsers(data.user, objResponse, removeUserCallback);
    },

    getUsers: function (data, objResponse, callback) {
      var query = "SELECT u.id as id, u.name as name, fullName, user_roles.id as role, user_roles.name as roleName, email, comment, language ";
      if (data.isPasswordGet)
        query += ", password ";

      query += "FROM users u\
                left join user_roles on u.role = user_roles.id";
      var getUsersCallback = function (err, rows) {
        if (!err) {
          objResponse.data = rows;
        } else {
          objResponse.error = "Error: " + err;
        }
        if (callback)
          callback(data);
      };
      if (database) {
        database.query(query, getUsersCallback);
      }
    },

    getUserRoles: function (data, objResponse, callback) {
      var query = "SELECT id, name FROM user_roles";
      var getUserRolesCallback = function (err, rows) {
        if (!err) {
          if (rows && rows.length > 0)
            objResponse.data = rows;
        } else {
          objResponse.error = "Error: " + err;
        }
        if (callback)
          callback(data);
      };
      if (database) {
        database.query(query, getUserRolesCallback);
      }
    },
    
    insertIntoUsers: function (data, objResponse, callback) {
      if (!data || !data.name || !data.fullName || !data.email || !data.password || (data.password != data.confirmPassword)) {
        objResponse.error = "Error: data";
        if (callback)
          callback();
        return;
      }
      if (!data.role || data.role <= 0)
        data.role = config.USERS.ROLE_ID_DEFAULT;

      var hashedPassword = passwordHash.generate(data.password);;

      var query = "INSERT INTO users(name, fullname, role, email, password, comment, language) VALUES('" + data.name + "', '" + data.fullName + "', '" + data.role + "', '" + data.email + "', '" + hashedPassword + "', '" + data.comment + "', '" + data.language + "')";
      var insertIntoUsersCallback = function (err, rows) {
        if (!err && rows && rows.insertId) {
          data.id = rows.insertId;
        } else {
          objResponse.error = "Error: " + err;
        }
        if (callback)
          callback(data);
      };
      if (database) {
        database.query(query, insertIntoUsersCallback);
      }
    },

    updateUser: function (data, objResponse, callback) {
      if (!data || !data.user || !data.user.id || !data.user.name || !data.user.fullName || !data.user.email || (data.user.password != data.user.confirmPassword)) {
        objResponse.error = "Error: data";
        if (callback)
          callback();
        return;
      }
      if (!data.role || data.role <= 0)
        data.role = config.USERS.ROLE_ID_DEFAULT;

      var hashedPassword = "";
      if (data.user.password && data.user.password != "")
        hashedPassword = passwordHash.generate(data.user.password);

      var query = "update users set name = '" + data.user.name + "', fullname='" + data.user.fullName + "', role=" + data.user.role + ", email='" + data.user.email + "'";
      if (hashedPassword !== "")
        query += ", password='" + hashedPassword + "'";
      query += " where id = " + data.user.id;
      var updateUsersCallback = function (err, rows) {
        if (!err && rows) {
          objResponse.data = data;
        } else {
          objResponse.error = "Error: " + err;
        }
        if (callback)
          callback(data);
      };
      if (database) {
        database.query(query, updateUsersCallback);
      }
    },

    deleteFromUsers: function (data, objResponse, callback) {
      if (!data || !data.id) {
        objResponse.error = "Error: data";
        if (callback)
          callback();
        return;
      }
      
      var query = "delete from users where id = " + data.id;
      var deleteFromUsersCallback = function (err, rows) {
        if (!err && rows) {
          
        } else {
          objResponse.error = "Error: " + err;
        }
        if (callback)
          callback(data);
      };
      if (database) {
        database.query(query, deleteFromUsersCallback);
      }
    },        

  };
  
};
