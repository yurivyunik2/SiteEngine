
define(["CONST", "Utils"], function (CONST, Utils) {

  var Application = function() {
    var self;
    var $scope;
    var $http;
    var $window;

    // Data
    var items = [];
    var userList = [];
    var userRoleList = [];

    // controls(elements)
    var modalFormCtrl;
    var engineTree;
    var actionCtrl;
    var tabPanel;
    var componentMgr;
    var richTextEditorCtrl;
    var menuItemEngineTree;

    var uiComponents = {};
    var userManagers = [];

    var session = {
      id: "",
      login: "",
      pass: "",
      isLogged: false,
    };

    // loading application
    var isLoadingFinish = false;
    var isLoadUsers = false;
    var isLoadRoles = false;
    var isLoadItems = false;

    // EVENTS - subscribers
    var itemChangeSubscribers = {};

    var application = {
      isRequestProcess: false,

      constructor: function() {
        self = this;        

        // UI interval
        setInterval(self.intervalUI, 50);
      },

      initialize: function(_$scope, _$http, _$window) {
        $scope = _$scope;
        $http = _$http;
        $window = _$window;
      },

      intervalUI: function () {

        // 
        Utils.intervalUI();

        // callback of application loading
        if (!isLoadingFinish) {
          isLoadingFinish = isLoadUsers && isLoadRoles && isLoadItems;
          if(isLoadingFinish)
            self.loadApplicationCallback();
        }

        var uiData = {};
        uiData.keyDownEventLast = Utils.keyDownEventLast;
        Utils.keyDownEventLast = null;

        var keysComponent = _.keys(uiComponents);
        _.each(keysComponent, function (key) {
          var component = uiComponents[key];
          if (component.intervalUI)
            component.intervalUI(uiData);
        });
      },

      loadApplication: function() {
        // process loading
        Utils.setLoadingApplication(true);
        
        application.loadUsers(function (user) {
          isLoadUsers = true;
        });
        application.loadUserRoles(function (roles) {
          isLoadRoles = true;
        });
        application.loadItems(function (items) {
          isLoadItems = true;
        });
      },
      loadApplicationCallback: function() {
        if (!items || !engineTree)
          return;
        var treeGrid = engineTree.getTreeGrid();
        if (treeGrid) {
          treeGrid.populate(items);
          if (treeGrid.treeItems && treeGrid.treeItems.length > 0) {
            treeGrid.selectItem(treeGrid.treeItems[0]);
          }
        }

        if (modalFormCtrl)
          modalFormCtrl.loadFormControls();

        // loading - turn off
        Utils.setLoadingApplication(false);
      },

      getSession: function () {
        return _.clone(session);
      },
      setSession: function(sessionID, login, pass) {
        if (sessionID && login && pass) {
          if (!session)
            session = {};
          session.id = sessionID;
          session.login = login;
          session.pass = pass;
          session.isLogged = true;
        }
      },      

      addUIComponent: function(key, component) {
        if (key && component)
          uiComponents[key] = component;
      },
      removeUIComponent: function(key) {
        delete uiComponents[key];
      },

      ///
      /// Setting of the Controls
      ///
      setEngineTree: function(_engineTree) {
        if (_engineTree) {
          engineTree = _engineTree;
        }
      },
      getEngineTree: function() {
        return engineTree;
      },

      treeGridItemSelected: function() {
        if (tabPanel) {
          tabPanel.treeGridItemSelected();
        }
      },

      setModalFormCtrl: function(_modalFormCtrl) {
        if (_modalFormCtrl)
          modalFormCtrl = _modalFormCtrl;
      },
      getModalFormCtrl: function() { return modalFormCtrl; },

      setComponentMgr: function (_componentMgr) {
        if (_componentMgr)
          componentMgr = _componentMgr;
      },
      getComponentMgr: function () { return componentMgr; },

      setRichTextEditorCtrl: function(_richTextEditorCtrl) {
        if (_richTextEditorCtrl)
          richTextEditorCtrl = _richTextEditorCtrl;
      },
      getRichTextEditorCtrl: function() { return richTextEditorCtrl; },

      setActionCtrl: function(_actionCtrl) {
        if (_actionCtrl)
          actionCtrl = _actionCtrl;
      },
      getActionCtrl: function() { return actionCtrl; },

      setTabPanel: function(_tabPanel) {
        if (_tabPanel)
          tabPanel = _tabPanel;
      },
      getTabPanel: function() { return tabPanel; },

      setMenuItemEngineTree: function (menuItem) { menuItemEngineTree = menuItem; },
      getMenuItemEngineTree: function () { return menuItemEngineTree; },

      ///
      /// End Setting of the Controls
      ///

      addUserManager: function (userManager) {
        if (userManager) {
          userManagers.push(userManager);
        }
      },

      getUserRoles: function () {
        if (!userRoleList)
          return [];

        return _.clone(userRoleList);
      },
      loadUserRoles: function (callback) {
        var data = { action: "getUserRoles" };
        self.isRequestProcess = true;

        self.httpRequest(data, function success(response) {
          if (!response.error && response.data) {
            self.isRequestProcess = false;
            userRoleList = response.data;
            if (callback)
              callback(self.getUserRoles());
          } else {
            //response.error
          }
        }, function error(response, status, headers) {
          if (callback)
            callback();
        });
      },


      ///
      /// Users
      /// 
      getUsers: function() {
        if (!userList)
          return [];

        return _.clone(userList);
      },
      loadUsers: function(callback) {
        var data = { action: "getUsers" };
        self.isRequestProcess = true;

        self.httpRequest(data, function success(response) {
          if (!response.error && response.data) {
            self.isRequestProcess = false;
            userList = response.data;
            if (callback)
              callback(self.getUsers());
          } else {
            //response.error
          }
        }, function error(response, status, headers) {
          if (callback)
            callback();
        });
      },
      newUser: function(newUser) {
        if (userList && newUser) {
          userList.push(newUser);
          _.each(userManagers, function(manager) {
            if (manager.update)
              manager.update();
          });
        }
      },
      updateUser: function(user) {
        if (userList && user) {
          var userEdited = _.findWhere(userList, { id: user.id });
          if (userEdited) {
            var keys = _.keys(userEdited);
            _.each(keys, function(key) {
              userEdited[key] = user[key];
            });

            _.each(userManagers, function(manager) {
              if (manager.update)
                manager.update();
            });
          }
        }
      },
      removeUser: function(user) {
        if (userList && user) {
          var userRemove = _.findWhere(userList, { id: parseInt(user.id) });
          if (userRemove) {
            var action = "removeUser";
            var data = {
              action: action,
              user: userRemove,
            };

            application.httpRequest(data, function(response) {
              if (!response.error) {
                if (response.data && response.data.user) {
                  userRemove = _.findWhere(userList, { id: parseInt(response.data.user.id) });
                  userList = _.without(userList, userRemove);
                  _.each(userManagers, function(manager) {
                    if (manager.update)
                      manager.update();
                  });
                }
              }
            }, function(response, status, headers, config) {
            });

          }
        }
      },

      ///
      /// End Users
      /// 


      ///
      /// Items
      ///
      getItemFields: function(item, callback) {
        if (!item || !item.id || !item.templateId)
          return;
        var data = { action: "getItemFields", id: item.id, templateId: item.templateId };

        self.httpRequest(data, function(responseData) {
          if (!responseData.error) {
            self.isRequestProcess = false;
            if (responseData.data) {
              var fields = responseData.data;
              item.fields = fields;
            }
            if (callback)
              callback();
          } else {
            if (callback)
              callback();
          }
        }, function() {
          if (callback)
            callback();
        });
      },

      loadItems: function(callback) {
        var data = { action: "getItems" };
        self.isRequestProcess = true;

        self.httpRequest(data, function success(response) {
          if (!response.error) {
            self.isRequestProcess = false;

            if (response.data) {
              //self.initializeItems(response.data);
              items = _.clone(response.data);
              //items[0] = _.clone(items[0]);
              if (callback)
                callback(items);
            }
          } else {
            //response.error
          }
        }, function error(response, status, headers) {

        });
      },
      getItems: function() {
        return items;
      },

      addItemChangeSubscribers: function (subscriber, handler) {
        if (!subscriber || !handler)
          return;

        itemChangeSubscribers[subscriber] = handler;
      },
      removeItemChangeSubscribers: function (subscriber) {
        if (!subscriber)
          return;

        delete itemChangeSubscribers[subscriber];
      },

      addItem: function (item) {
        var parentObj = { id: item.parentId };
        var newItem = { id: item.id, name: item.name, templateId: item.templateId };

        var parentItem = _.findWhere(items, { id: parentObj.id });
        if (!parentItem || !parentItem.trElem)
          return;

        var newItemFound = _.findWhere(items, { id: newItem.id });
        if (newItemFound) // item exists
          return;

        newItem.parentObj = parentItem;
        items.push(newItem);

        // to call of the Events' subscribers
        var event = {
          action: "addItem",
          item: newItem
        };
        var keys = _.keys(itemChangeSubscribers);
        _.each(keys, function (subscriber) {
          if (subscriber && itemChangeSubscribers[subscriber])
            itemChangeSubscribers[subscriber](event);
        });
      },

      ///
      /// End Items
      ///

      getTemplateItems: function () {
        var templateItems = [];
        if (items) {
          templateItems = _.where(items, { id: CONST.TEMPLATES_ROOT_ID() });
        }

        var allTemplates = [];
        _.each(templateItems, function (item) {
          allTemplates.push(item);
          Utils.findChildItems(allTemplates, item);
        });

        return allTemplates;
      },

      getLayoutItems: function () {
        var layoutItems = [];
        if (items) {
          layoutItems = _.where(items, { id: CONST.LAYOUTS_ROOT_ID() });
        }

        var allLayouts = [];
        _.each(layoutItems, function (item) {
          allLayouts.push(item);
          Utils.findChildItems(allLayouts, item);
        });

        return allLayouts;
      },

      getMediaItems: function () {
        var mediaItems = [];
        var items = self.getItems();
        if (items) {
          mediaItems = _.where(items, { id: CONST.MEDIA_ROOT_ID() });
        }

        var allMediaItems = [];
        _.each(mediaItems, function (item) {
          //allMediaItems.push(item);
          Utils.findChildItems(allMediaItems, item);
        });

        return allMediaItems;
      },

      getDataTypesItems: function () {
        var typeItems = [];
        var items = self.getItems();
        if (items) {
          typeItems = _.where(items, { parent: CONST.DATA_TYPES_ROOT_ID() });
        }
        return typeItems;
      },

      isTemplateItem: function (item) {
        if (!item)
          return false;

        // "Folder"
        if (item.templateId === CONST.FOLDER_TEMPLATE_ID())
          return false;

        var isTemplateItem = self.isItemUnderTemplates(item);
        return isTemplateItem;
      },

      isItemUnderTemplates: function (item) {
        if (!item)
          return false;

        var parent = item.parentObj;
        var maxIndexFind = 50;
        var index = 0;
        var isItemUnderTemplates = false;
        while (parent && !isItemUnderTemplates && index < maxIndexFind) {
          isItemUnderTemplates = (parent.id === CONST.TEMPLATES_ROOT_ID());
          parent = parent.parentObj;
          index++;
        }
        return isItemUnderTemplates;
      },

      httpRequest: function (data, success, error) {
        if (!data || !success)
          return;

        var req = {
          method: 'POST',
          url: CONST.SERVER.PATH(),
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
          },
          data: JSON.stringify(data)
        };

        $http(req).
          success(function (response, status, headers, config) {
            if (success) {
              success(response);
              Utils.showNotification(data, response);
            }            
          }).
          error(function (response, status, headers, config) {
            if(error)
              error(response, status, header, config);
            Utils.showNotification(data, response);
          });
      },
      
    };
    application.constructor();
    return application;
  };
  return Application();
});