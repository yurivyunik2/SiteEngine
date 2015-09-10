
define(["CONST", "notification"], function (CONST, Notification) {
//define(["CONST"], function (CONST, Notification) {

  var Application = function() {
    var self;
    var $scope;
    var $http;
    var $window;

    var modalFormCtrl;
    var engineTree;
    var actionCtrl;
    var tabPanel;
    var richTextEditorCtrl;
    var menuItemEngineTree;

    var keyDownEventLast;
    var uiComponents = {};
    var userManagers = [];

    //var items = [];
    var templateItems = [];

    var userList = [];
    var userRoleList = [];

    var session = {
      id: "",
      login: "",
      pass: "",
      isLogged: false,
    };

    // EVENTS - subscribers
    var itemChangeSubscribers = {};

    var application = {
      initItems: null,

      //
      hashParentItems: {},
      hashItems: {},
      hashChangedItems: {},

      hashInsertOptions: {},


      treeItems: [],
      treeItemsHash: {},

      isRequestProcess: false,

      constructor: function() {
        self = this;

        $(window).resize(self.windowResized);

        // UI interval
        setInterval(self.intervalUI, 50);

        $(window).keydown(self.keyDownEventFunc);
      },

      initialize: function(_$scope, _$http, _$window) {
        $scope = _$scope;
        $http = _$http;
        $window = _$window;
      },

      getSession: function() {
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

      isValueNull: function(value) {
        if (!value || value === "" || value === "null")
          return true;
        else
          return false;
      },

      keyDownEventFunc: function(event) {
        keyDownEventLast = event;
        if (self.isFunctionalKey(event)) {
          event.preventDefault();
          return false;
        }
        return true;
      },

      isFunctionalKey: function(event) {
        return CONST.IS_CTRL_S_KEY(event);
      },

      isWindowResized: false,
      windowResized: function(event) {
        self.isWindowResized = true;
      },

      addUIComponent: function(key, component) {
        if (key && component)
          uiComponents[key] = component;
      },
      removeUIComponent: function(key) {
        delete uiComponents[key];
      },

      intervalUI: function() {
        if (!self.isCorrectHeightOnce || self.isWindowResized) {
          self.isWindowResized = false;
          self.correctHeightWindow();
        }

        var uiData = {};
        if (keyDownEventLast) {
          uiData.keyDownEventLast = keyDownEventLast;
          keyDownEventLast = null;
        }

        var keysComponent = _.keys(uiComponents);
        _.each(keysComponent, function(key) {
          var component = uiComponents[key];
          if (component.intervalUI)
            component.intervalUI(uiData);
        });
      },

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

      addUserManager: function(userManager) {
        if (userManager) {
          userManagers.push(userManager);
        }
      },

      getUserRoles: function() {
        if (!userRoleList)
          return [];

        return _.clone(userRoleList);
      },
      loadUserRoles: function(callback) {
        var data = { action: "getUserRoles" };
        self.isRequestProcess = true;

        self.httpRequest(data, function success(response) {
          if (response.isOK && response.data) {
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

      getUsers: function() {
        if (!userList)
          return [];

        return _.clone(userList);
      },
      loadUsers: function(callback) {
        var data = { action: "getUsers" };
        self.isRequestProcess = true;

        self.httpRequest(data, function success(response) {
          if (response.isOK && response.data) {
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
              if (response.isOK) {
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

      getItemFields: function(item, callback) {
        if (!item || !item.id || !item.templateId)
          return;
        var data = { action: "getItemFields", id: item.id, templateId: item.templateId };

        self.httpRequest(data, function(responseData) {
          var isCallbackCall = true;
          if (responseData.isOK) {
            self.isRequestProcess = false;
            var fields = responseData.data;
            item.fields = fields;
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
          if (response.isOK) {
            self.isRequestProcess = false;

            self.initializeItems(response.data);
            if (callback)
              callback(self.initItems);
          } else {
            //response.error
          }
        }, function error(response, status, headers) {

        });
      },
      getItems: function() {
        return self.initItems;
      },
      getTreeItems: function() { return self.treeItems; },

      initializeItems: function(items) {
        this.initItems = _.clone(items);
        this.initItems[0] = _.clone(items[0]);

        this.treeItems = [];
        this.treeItemsHash = {};

        this.hashParentItems = {};
        this.hashItems = {};
        this.hashChangedItems = {};

        this.populateItems(items);
      },

      populateItems: function(items) {

        try {
          // find parent for each item
          for (var i = 0; i < items.length; i++) {
            var curItem = items[i];

            //----fix----//
            if (typeof this.hashParentItems[curItem.id] != 'undefined') {
              this.hashParentItems[curItem.id].children = curItem.children;
              curItem = this.hashParentItems[curItem.id];
            }
            //----fix end----//

            //
            //this.hashItemsPopulate[curItem.id] = curItem;

            var parentItem;

            if (typeof curItem.parent !== 'undefined' && curItem.parent != '') {
              parentItem = this.hashParentItems[curItem.parent];

              if (typeof parentItem === 'undefined') {
                for (var j = 0; j < items.length; j++) {
                  if (curItem.parent == items[j].id) {
                    parentItem = items[j];
                    break;
                  }
                }
              }
            }

            if (typeof parentItem !== 'undefined' && curItem.parent && curItem.parent != "") {
              if (typeof parentItem.children === 'undefined') {
                parentItem.children = [];
                parentItem.childrenHash = {};
              }

              if (typeof parentItem.childrenHash[curItem.id] == 'undefined') {
                parentItem.children.push(curItem);
              } else {
                curItem = parentItem.childrenHash[curItem.id];
              }
              parentItem.childrenHash[curItem.id] = curItem;

              curItem.parentObj = parentItem;
              this.hashParentItems[parentItem.id] = parentItem;
            } else {
              if (typeof this.treeItemsHash[curItem.id] == 'undefined') {
                this.treeItems.push(curItem);
              }
              this.treeItemsHash[curItem.id] = curItem;
            }
          }
        } catch (ex) {
          //var i = 0;
        }
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

        var parentItem = _.findWhere(self.initItems, { id: parentObj.id });
        if (!parentItem || !parentItem.trElem)
          return;

        var newItemFound = _.findWhere(self.initItems, { id: newItem.id });
        if (newItemFound) // item exists
          return;

        newItem.parentObj = parentItem;
        self.initItems.push(newItem);

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

      getTemplateItems: function (isRefresh) {
        var templateItems = [];
        if (isRefresh && items) {
          templateItems = _.where(items, { id: CONST.TEMPLATES_ROOT_ID() });
        }

        var allTemplates = [];
        _.each(templateItems, function (item) {
          allTemplates.push(item);
          self.findChildItems(allTemplates, item);
        });

        return allTemplates;
      },

      getLayoutItems: function (isRefresh) {
        var layoutItems = [];
        if (isRefresh && items) {
          layoutItems = _.where(items, { id: CONST.LAYOUTS_ROOT_ID() });
        }

        var allLayouts = [];
        _.each(layoutItems, function (item) {
          allLayouts.push(item);
          self.findChildItems(allLayouts, item);
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
          self.findChildItems(allMediaItems, item);
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


      findChildItems: function (allItems, parentItem) {
        if (!allItems || !parentItem)
          return;

        if (parentItem && parentItem.children) {
          _.each(parentItem.children, function (item) {
            allItems.push(item);

            self.findChildItems(allItems, item);
          });
        }
      },

      httpRequest: function (data, success, error) {
        if (!data || !success)
          return;

        var req = {
          method: 'POST',
          url: CONST.SERVER(),
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
          },
          data: JSON.stringify(data)
        };

        $http(req).
          success(function (response, status, headers, config) {
            if (success) {
              success(response);
              self.showNotification(data, response);
            }            
          }).
          error(function (response, status, headers, config) {
            if(error)
              error(response, status, header, config);
            self.showNotification(data, response);
          });
      },
      
      showNotification: function (data, response) {
        if (!data || !data.isNotified)
          return;
        var actionName;
        if (data.actionName)
          actionName = data.actionName;
        else if (data.action)
          actionName = data.action;
        if (actionName) {
          if (response && response.isOK)
            Notification.show(Notification.INFO(), actionName + " was successfully!");
          else {
            if (response)
              Notification.show(Notification.ERROR(), actionName + " was finished with error: " + response);
            else
              Notification.show(Notification.ERROR(), actionName + " was finished with error!");
          }
        }
      },

      isCorrectHeightOnce: false,
      correctHeightWindow: function () {
        var $dvTabContent = $("#dvTabContent");
        var $ulTabs = $("#ulTabs");
        //var $dvActionButtons = $("#dvActionButtons");
        var $dvMainContent = $("#dvMainContent");

        var isAvailableElements = $dvTabContent.length > 0 && $ulTabs.length > 0 && $dvMainContent.length > 0;
        if (isAvailableElements) {
          self.isCorrectHeightOnce = true;

          clearInterval(self.idIntervalCorrectHeight);

          var heightCommon = 0;
          heightCommon += $dvTabContent[0].offsetHeight;
          heightCommon += $ulTabs[0].offsetHeight;
          //heightCommon += $dvActionButtons[0].offsetHeight;

          //var heightRest = $(window).height() - heightCommon;
          var heightRest = window.innerHeight - heightCommon;          
          $dvMainContent.height(heightRest);
        }
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
      
      getLanguageCurrent: function () {
        var curLanguage;
        var $selLanguageElem = $(CONST.LANGUAGE_SELECTOR());
        if ($selLanguageElem.length > 0) {
          var langCode = $selLanguageElem.val();
          curLanguage = _.findWhere(CONST.LANGUAGE_LIST(), { code: langCode });
        }
        if (!curLanguage)
          curLanguage = CONST.LANGUAGE_DEFAULT();
        return curLanguage;
      },

      getVersionCurrent: function () {
        var curVersion = 0;
        var $selVersionElem = $(CONST.VERSION_SELECTOR());
        if ($selVersionElem.length > 0) {
          curVersion = $selVersionElem.val();
        }
        return curVersion;
      },

      
    };
    application.constructor();
    return application;
  };
  return Application();
});