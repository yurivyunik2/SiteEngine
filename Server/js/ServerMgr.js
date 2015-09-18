exports.ServerMgr = function () {
  var _ = require('underscore');
  var fs = require('fs');

  var ServerApplication = require('./ServerApplication.js');

  //var configModule = require('./Config.js');
  //var config = new configModule.Config;
  var config = ServerApplication.Config;

  //var utilsModule = require('./Utils.js');
  //var utils = new utilsModule.Utils;
  var utils = ServerApplication.Utils;
  
  var itemMgrModule = require('./ItemMgr.js');
  var itemMgr = new itemMgrModule.ItemMgr();

  var templateMgrModule = require('./TemplateMgr.js');
  var templateMgr = new templateMgrModule.TemplateMgr();

  var userMgrModule = require('./UserMgr.js');
  var userMgr = new userMgrModule.UserMgr();
  
  var contentMgrModule = require('./ContentMgr.js');
  var contentMgr = new contentMgrModule.ContentMgr(itemMgr);

  var roleMgrModule = require('./RoleMgr.js');
  var roleMgr = new roleMgrModule.RoleMgr();


  var self;

  var serverMgrObj = {
    constructor: function () {
      self = this;

      setInterval(self.timerService, 300);
    },
    
    timerService: function () {
      if (userMgr)
        userMgr.updateMgr();
    },

    requestHandle: function (objResponse, request, response) {
      itemMgr.setRequest(request);
      userMgr.setRequest(request);

      if (!request.sessionID) {
        objResponse.error = "SessionID isn't available!";
        response.end(JSON.stringify(objResponse));
        return;
      }

      if (request.method === "POST") {
        this.processPOST(request, response);
      } else if (request.method === "GET") {
        this.processGET(request, response);
      } else {
        objResponse.error = "ERROR: UNKNOWN REQUEST";
        response.end(JSON.stringify(objResponse));
      }
    },

    processPOST: function (request, response) {
      var objResponse = { isOK: false};

      utils.processPost(request, response, function () {
        var dataRequest;
        var postKey = _.keys(request.post);
        if (postKey.length > 0) {
          try {
            dataRequest = JSON.parse(postKey[0]);
          } catch (ex) {
            dataRequest = request.post;
          }
        }

        if (dataRequest) {
          
          if (!userMgr.isActionSecure(dataRequest.action)) {
            if (!userMgr.isSessionExist(request.sessionID)) {
              objResponse.error = "User's session doesn't exist!";
              response.end(JSON.stringify(objResponse));
              return;
            } else if (!userMgr.hasAccess(dataRequest.action, request.sessionID)) {
              objResponse.error = "User doesn't have the access to this operation!";
              response.end(JSON.stringify(objResponse));
              return;
            }
          }

          switch (dataRequest.action) {
            case "getItems":
              {
                itemMgr.getItems(dataRequest, objResponse, function () {
                  response.end(JSON.stringify(objResponse));
                });
                break;
              }
            case "getItemFields":
              {
                itemMgr.getItemFields(dataRequest, objResponse, function () {
                  response.end(JSON.stringify(objResponse));
                });
                break;
              }
            case "getTemplates":
              {
                templateMgr.getTemplates(objResponse, function () {
                  response.end(JSON.stringify(objResponse));
                });
                break;
              }
            case "addTemplate":
              {
                templateMgr.addTemplate(dataRequest, objResponse, function () {
                  response.end(JSON.stringify(objResponse));
                });
                break;
              }
            case "updateTemplate":
              {
                templateMgr.updateTemplate(dataRequest, objResponse, function () {
                  response.end(JSON.stringify(objResponse));
                });
                break;
              }
            case "createItem":
              {
                itemMgr.createItem(dataRequest, objResponse, function () {
                  response.end(JSON.stringify(objResponse));
                });
                break;
              }
            case "addItem":
              {
                itemMgr.addItem(dataRequest, objResponse, function () {
                  response.end(JSON.stringify(objResponse));
                });
                break;
              }
            case "newVersionCreate":
              {
                itemMgr.newVersionCreate(dataRequest, objResponse, function () {
                  response.end(JSON.stringify(objResponse));
                });
                break;
              }
            case "deleteVersion":
              {
                itemMgr.deleteVersion(dataRequest, objResponse, function () {
                  response.end(JSON.stringify(objResponse));
                });
                break;
              }              
            case "saveItem":
              {
                itemMgr.saveItem(dataRequest, objResponse, function () {
                  response.end(JSON.stringify(objResponse));
                });
                break;
              }
            case "deleteItem":
              {
                itemMgr.deleteItem(dataRequest, objResponse, function () {
                  if (!(objResponse.error && objResponse.error != "")) {
                    objResponse.isOK = true;
                  }
                  response.end(JSON.stringify(objResponse));
                });
                break;
              }
            case "getContentSite": {
              contentMgr.getContent(request, response, objResponse);
              break;
            }
            case "getUsers":
              {
                userMgr.getUsers(dataRequest, objResponse, function () {
                  response.end(JSON.stringify(objResponse));
                });
                break;
              }
            case "getUserRoles":
              {
                userMgr.getUserRoles(dataRequest, objResponse, function () {
                  response.end(JSON.stringify(objResponse));
                });
                break;
              }
            case "newUser":
              {
                userMgr.newUser(dataRequest, objResponse, function () {
                  response.end(JSON.stringify(objResponse));
                });
                break;
              }
            case "removeUser":
              {
                userMgr.removeUser(dataRequest, objResponse, function () {
                  response.end(JSON.stringify(objResponse));
                });
                break;
              }
            case "editUser":
              {
                userMgr.updateUser(dataRequest, objResponse, function () {
                  response.end(JSON.stringify(objResponse));
                });
                break;
              }
            case "login":
              {
                userMgr.login(dataRequest, objResponse, function () {
                  response.end(JSON.stringify(objResponse));
                });
                break;
              }
            case "logout":
              {
                userMgr.logout(dataRequest, objResponse, function () {
                  response.end(JSON.stringify(objResponse));
                });
                break;
              }
            case "pingSession":
              {
                userMgr.pingSession(dataRequest, objResponse, function () {
                  response.end(JSON.stringify(objResponse));
                });
                break;
              }
                
          }
        }
        
      });
    },
     
    processGET: function (request, response) {
      
      var url = require('url');
      var urlParts = url.parse(request.url, true);
      //var query = urlParts.query;
      
      var arUrlPart = request.url.split("/");
      if (arUrlPart.length > 0) {
        var requestPage = arUrlPart[arUrlPart.length - 1];
        if (requestPage && requestPage != "") {
          var fileName = "." + urlParts.pathname;
          if (requestPage.indexOf(".") >= 0 && fs.existsSync(fileName)) {
            response.sendfile(fileName);
          } else {            
            response.sendfile("." + config.SERVER.LAYOUT_WRAPPER_PATH);
          }
        }
      }
      
    },
    
  };
  serverMgrObj.constructor();
  return serverMgrObj;

};