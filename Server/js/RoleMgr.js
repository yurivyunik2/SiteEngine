exports.RoleMgr = function () {

  var _ = require('underscore');
  
  var Modules = require('./Modules.js');

  var CONST = Modules.CONST;

  var Role = function (_roleId, _ownOperations) {
    var self;

    var secureOperations = [
      "pingSession", "login", "getContentSite"
    ];
    var ownOperations = [];

    var roleId = CONST.USERS.ROLE_UNKNOWN;

    var roleObj = {
      
      constructor: function () {
        self = this;
        roleId = _roleId;
        ownOperations = _ownOperations;
      },
      
      deleteProperties: function () {
        delete self.setRoleId;
      },

      getSecureOperations: function () {
        return secureOperations;
      },
      addOwnOperations: function (_ownOperations) {
        if (_ownOperations) {
          _.each(_ownOperations, function (operation) {
            ownOperations.push(operation);
          });
        }
      },
      setRoleId: function (_roleId) {
        roleId = _roleId;
      },

      getRoleId: function() {
        return roleId;
      },
      isAdmin: function () {
        return (roleId === CONST.USERS.ROLE_ADMINISTRATOR);
      },
      hasAccess: function (action) {
        return self.isAdmin() || (secureOperations.indexOf(action) >= 0 || ownOperations.indexOf(action) >= 0);
      },
    };
    roleObj.constructor();
    return roleObj;
  };

  var UserRole = function () {
    var ownOperations = [];
    var role = new Role(CONST.USERS.ROLE_USER, ownOperations);

    return role;
  };

  var EditorRole = function (isInheritance) {
    var self;
    var ownOperations = [
      "login", "logout", "getItems", "getItemFields", "createItem", "saveItem", "deleteItem", "newVersionCreate", "deleteVersion", 
    ];
    
    var role = new UserRole();

    var editorRoleObj = {
      constructor: function () {
        role.addOwnOperations(ownOperations);
        role.setRoleId(CONST.USERS.ROLE_EDITOR);
        if (!isInheritance)
          role.deleteProperties();
      },
    };
    editorRoleObj.constructor();

    role = _.extend(role, editorRoleObj);

    return role;
  };

  var AdministratorRole = function (isInheritance) {
    var ownOperations = [
      "getUsers", "newUser"
    ];
    
    var role = new EditorRole(true);

    var administratorRoleObj = {
      constructor: function () {
        role.addOwnOperations(ownOperations);
        role.setRoleId(CONST.USERS.ROLE_ADMINISTRATOR);
        if (!isInheritance)
          role.deleteProperties();
      },
    };
    administratorRoleObj.constructor();

    role = _.extend(role, administratorRoleObj);
    return role;

  };

  var userRole = new UserRole();
  var allRoles = [userRole, new EditorRole(), new AdministratorRole()];

  var roleMgrObj = {

    isActionSecure: function (action) {
      return (userRole.getSecureOperations().indexOf(action) >= 0);
    },

    getRoleObj: function (roleId) {
      var roleFound;
      _.each(allRoles, function (role) {
        if (role.getRoleId() == roleId) {
          roleFound = role;
        }
      });
      if (!roleFound)
        roleFound = userRole;
      return roleFound;
    },
  };  
  return roleMgrObj;
};


