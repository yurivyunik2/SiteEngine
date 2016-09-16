exports.ServerMgr = function () {
  var _ = require('underscore');
  var url = require('url');
  var fs = require('fs');

  var Modules = require('./Modules.js');

  var CONST = Modules.CONST;

  var utils = Modules.Utils;

  var ServerApplication = Modules.ServerApplication;
  
  var itemMgrModule = require('./ItemMgr.js');
  var itemMgr = new itemMgrModule.ItemMgr();

  ServerApplication.setItemMgr(itemMgr);

  var templateMgrModule = require('./TemplateMgr.js');
  var templateMgr = new templateMgrModule.TemplateMgr();

  var userMgrModule = require('./UserMgr.js');
  var userMgr = new userMgrModule.UserMgr();
  
  var contentMgrModule = require('./ContentMgr.js');
  var contentMgr = new contentMgrModule.ContentMgr(itemMgr);

  var publishMgrModule = require('./Publish/PublishMgr.js');
  var publishMgr = new publishMgrModule.PublishMgr(itemMgr);


  var roleMgrModule = require('./RoleMgr.js');
  var roleMgr = new roleMgrModule.RoleMgr();

  var DatabaseMgr = Modules.DatabaseMgr;


  var self;

  var lastUpdate = Date.now();

  var serverMgrObj = {
    constructor: function () {
      self = this;

      setInterval(self.updateInterval, 300);
    },
    
    updateInterval: function () {
      if (userMgr)
        userMgr.updateMgr();

      if (ServerApplication) {
        ServerApplication.update();
      }
    },

    requestHandle: function (objResponse, request, response) {
      itemMgr.setRequest(request);
      userMgr.setRequest(request);

      //if (!request.sessionID) {
      //  objResponse.error = "SessionID isn't available!";
      //  response.end(JSON.stringify(objResponse));
      //  return;
      //}

      if (request.method === "POST") {
        this.processPOST(request, response);
      } else if (request.method === "GET") {
        this.processGET(request, response);
      } else {
        objResponse.error = "ERROR: UNKNOWN REQUEST";
        response.end(JSON.stringify(objResponse));
      }
    },

    responseCallbackPOST: function (response, dataRequest, objResponse) {
      self.responseCallbackPOSTExtend(response, dataRequest, objResponse);
    },
    responseCallbackPOSTExtend: function (response, dataRequest, objResponse, contentType) {
      DatabaseMgr.historyLog(dataRequest, objResponse);
      //var headersObj = {
      //  'Access-Control-Allow-Origin': '*'
      //};
      //if (contentType) {
      //  headersObj["Content-Type"] = contentType;
      //}      
      //response.writeHead(200, "OK", headersObj);

      if (contentType) {
        response.setHeader('Content-Type', contentType);
      }      

      response.statusCode = 200;
      response.end(JSON.stringify(objResponse));
    },

    processPOST: function (request, response) {
      var objResponse = { };

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
            if (!userMgr.isSessionExist(dataRequest.sessionID)) {
              objResponse.error = "User's session doesn't exist!";
              response.end(JSON.stringify(objResponse));
              return;
            } else if (!userMgr.hasAccess(dataRequest.action, dataRequest.sessionID)) {
              objResponse.error = "User doesn't have the access to this operation!";
              response.end(JSON.stringify(objResponse));
              return;
            }
          }

          switch (dataRequest.action) {
            case "getItems":
              {
                ServerApplication.updateItems(dataRequest, objResponse, function () {
                  //response.end(JSON.stringify(objResponse));
                  self.responseCallbackPOST(response, dataRequest, objResponse);
                });
                //itemMgr.getItems(dataRequest, objResponse, function () {
                //  response.end(JSON.stringify(objResponse));
                //});
                break;
              }
            case "getItemFields":
              {
                itemMgr.getItemFields(dataRequest, objResponse, function () {
                  //response.end(JSON.stringify(objResponse));
                  self.responseCallbackPOST(response, dataRequest, objResponse);
                });
                break;
              }
            case "getItemGroupFields":
              {
                itemMgr.getItemGroupFields(dataRequest, objResponse, function () {
                  //response.end(JSON.stringify(objResponse));
                  self.responseCallbackPOST(response, dataRequest, objResponse);
                });
                break;
              }
            case "getTemplates":
              {
                templateMgr.getTemplates(objResponse, function () {
                  //response.end(JSON.stringify(objResponse));
                  self.responseCallbackPOST(response, dataRequest, objResponse);
                });
                break;
              }
            case "addTemplate":
              {
                templateMgr.addTemplate(dataRequest, objResponse, function () {
                  //response.end(JSON.stringify(objResponse));
                  self.responseCallbackPOST(response, dataRequest, objResponse);
                });
                break;
              }
            case "updateTemplate":
              {
                templateMgr.updateTemplate(dataRequest, objResponse, function () {
                  //response.end(JSON.stringify(objResponse));
                  self.responseCallbackPOST(response, dataRequest, objResponse);
                });
                break;
              }
            case "createItem":
              {
                itemMgr.createItem(dataRequest, objResponse, function () {
                  //response.end(JSON.stringify(objResponse));
                  self.responseCallbackPOST(response, dataRequest, objResponse);
                });
                break;
              }
            case "copyItem":
              {
                itemMgr.copyItem(dataRequest, objResponse, function () {
                  //response.end(JSON.stringify(objResponse));
                  self.responseCallbackPOST(response, dataRequest, objResponse);
                });
                break;
              }
            case "moveItem":
              {
                itemMgr.moveItem(dataRequest, objResponse, function () {
                  //response.end(JSON.stringify(objResponse));
                  self.responseCallbackPOST(response, dataRequest, objResponse);
                });
                break;
              }
            case "addItem":
              {
                itemMgr.addItem(dataRequest, objResponse, function () {
                  //response.end(JSON.stringify(objResponse));
                  self.responseCallbackPOST(response, dataRequest, objResponse);
                });
                break;
              }
            case "newVersionCreate":
              {
                itemMgr.newVersionCreate(dataRequest, objResponse, function () {
                  //response.end(JSON.stringify(objResponse));
                  self.responseCallbackPOST(response, dataRequest, objResponse);
                });
                break;
              }
            case "deleteVersion":
              {
                itemMgr.deleteVersion(dataRequest, objResponse, function () {
                  //response.end(JSON.stringify(objResponse));
                  self.responseCallbackPOST(response, dataRequest, objResponse);
                });
                break;
              }              
            case "saveItem":
              {
                itemMgr.saveItem(dataRequest, objResponse, function () {
                  //response.end(JSON.stringify(objResponse));
                  self.responseCallbackPOST(response, dataRequest, objResponse);
                });
                break;
              }
            case "deleteItem":
              {
                itemMgr.deleteItem(dataRequest, objResponse, function () {
                  if (!(objResponse.error && objResponse.error !== "")) {

                  }
                  //response.end(JSON.stringify(objResponse));
                  self.responseCallbackPOST(response, dataRequest, objResponse);
                });
                break;
              }
            case "publishItem":
              {
                publishMgr.publishItem(dataRequest, objResponse, function () {
                  if (dataRequest) {
                    objResponse.data = {
                      item: dataRequest.item,
                    };
                  }

                  //response.end(JSON.stringify(objResponse));
                  self.responseCallbackPOST(response, dataRequest, objResponse);
                });
                break;
              }
            case "publishTree":
              {
                publishMgr.publishTree(dataRequest, objResponse, function () {
                  if (dataRequest) {
                    objResponse.data = {
                      item: dataRequest.item,
                    };
                  }
                  //response.end(JSON.stringify(objResponse));
                  self.responseCallbackPOST(response, dataRequest, objResponse);
                });
                break;
              }
            case "getContentSite":
              {
                request.dataRequest = dataRequest;
                contentMgr.getContent(request, objResponse, function () {
                    //response.end(JSON.stringify(objResponse));
                    self.responseCallbackPOSTExtend(response, dataRequest, objResponse, 'text/html');
                  });
                break;
              }
            case "getUsers":
              {
                userMgr.getUsers(dataRequest, objResponse, function () {
                  //response.end(JSON.stringify(objResponse));
                  self.responseCallbackPOST(response, dataRequest, objResponse);
                });
                break;
              }
            case "getUserRoles":
              {
                userMgr.getUserRoles(dataRequest, objResponse, function () {
                  //response.end(JSON.stringify(objResponse));
                  self.responseCallbackPOST(response, dataRequest, objResponse);
                });
                break;
              }
            case "newUser":
              {
                userMgr.newUser(dataRequest, objResponse, function () {
                  //response.end(JSON.stringify(objResponse));
                  self.responseCallbackPOST(response, dataRequest, objResponse);
                });
                break;
              }
            case "removeUser":
              {
                userMgr.removeUser(dataRequest, objResponse, function () {
                  //response.end(JSON.stringify(objResponse));
                  self.responseCallbackPOST(response, dataRequest, objResponse);
                });
                break;
              }
            case "editUser":
              {
                userMgr.updateUser(dataRequest, objResponse, function () {
                  //response.end(JSON.stringify(objResponse));
                  self.responseCallbackPOST(response, dataRequest, objResponse);
                });
                break;
              }
            case "login":
              {
                userMgr.login(dataRequest, objResponse, function () {
                  //response.end(JSON.stringify(objResponse));
                  self.responseCallbackPOST(response, dataRequest, objResponse);
                });
                break;
              }
            case "logout":
              {
                userMgr.logout(dataRequest, objResponse, function () {
                  //response.end(JSON.stringify(objResponse));
                  self.responseCallbackPOST(response, dataRequest, objResponse);
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
      try {
        var urlParts = url.parse(request.url, true);
        var arUrlPart = request.url.split("/");
        if (arUrlPart.length > 0) {
          var requestPage = arUrlPart[arUrlPart.length - 1];
          var fileName = "." + urlParts.pathname;
          if (requestPage.indexOf(".") >= 0 && fs.existsSync(fileName)) {
            response.sendfile(fileName);
          } else {
            response.sendfile("." + CONST.SERVER.SITE_RENDERING_LAYOUT_PATH);
          }          
        }
      } catch (ex) {
        
      }      
    },
    
  };
  serverMgrObj.constructor();
  return serverMgrObj;

};