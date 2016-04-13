
define(["CONST", "Utils"], function (CONST, Utils) {

  var Application = function() {
    var self;
    var $scope;
    var $http;
    var $window;

    // Data
    var items = [];
    var itemsHash = {};
    var userList = [];
    var userRoleList = [];

    // controls(elements)
    var modalFormCtrl;
    var engineTree;
    var treeGridFocused;
    var actionCtrl;
    var tabPanel;
    var componentMgr;
    //var richTextEditorCtrl;
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
      get$scope: function () {
        return $scope;
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
      loadApplicationCallback: function () {
        if (!items || !engineTree)
          return;

        // loading - turn off
        Utils.setLoadingApplication(false);

        var treeGrid = engineTree.getTreeGrid();
        if (treeGrid) {
          treeGrid.populate(items);
          var treeItems = treeGrid.getTreeItems();
          if (treeItems && treeItems.length > 0) {
            treeGrid.selectItem(treeItems[0]);
          }
        }

        if (modalFormCtrl)
          modalFormCtrl.loadFormControls();
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

      setTreeGridFocused: function (treeGrid) { treeGridFocused = treeGrid; },
      getTreeGridFocused: function () { return treeGridFocused; },

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

      //setRichTextEditorCtrl: function(_richTextEditorCtrl) {
      //  if (_richTextEditorCtrl)
      //    richTextEditorCtrl = _richTextEditorCtrl;
      //},
      //getRichTextEditorCtrl: function() { return richTextEditorCtrl; },

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

      getItemGroupFields: function (items, callback) {
        if (!items)
          return;

        var _items = [];
        _.each(items, function (item) {
          _items.push({id: item.id, name: item.name, templateId: item.templateId});
        });
        var data = { action: "getItemGroupFields", items: _items };

        self.httpRequest(data, function (responseData) {
          if (!responseData.error) {
            self.isRequestProcess = false;
            var itemsGroup;
            if (responseData.data) {
              itemsGroup = responseData.data;
              _.each(itemsGroup, function (item) {
                if (item.id) {
                  var itemHash = itemsHash[item.id];
                  if (itemHash) {
                    itemHash.fields = item.fields;
                    _.each(itemHash.fields, function (field) {
                      if (field.name)
                        itemHash[field.name] = field.value;
                    });
                  }
                }
              });
              if (callback)
                callback(itemsGroup);
            }
          } else {
            if (callback)
              callback();
          }
        }, function () {
          if (callback)
            callback();
        });
      },

      loadItems: function (callback) {
        var data = { action: "getItems" };
        self.isRequestProcess = true;

        self.httpRequest(data, function success(response) {
          if (!response.error) {
            self.isRequestProcess = false;

            if (response.data) {
              self.initializeItems(response.data);
              //items = _.clone(response.data);              
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
      getItemsHash: function () {
        return itemsHash;
      },

      ///
      /// --------- Initialize items ---------
      ///
      hashParentItems: {},

      treeItems: [],
      treeItemsHash: {},

      initializeItems: function (_items) {
        items = _items;
        itemsHash = {};
        _.each(items, function (item) {
          if (item.id)
            itemsHash[item.id] = item;
        });

        self.treeItems = [];
        self.treeItemsHash = {};

        self.hashParentItems = {};

        self.populateItems(items);
      },

      // populate
      populateItems: function (items) {

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

            if (curItem.parentId && curItem.parentId !== '') {
              parentItem = this.hashParentItems[curItem.parentId];

              if (typeof parentItem === 'undefined') {
                for (var j = 0; j < items.length; j++) {
                  if (curItem.parentId === items[j].id) {
                    parentItem = items[j];
                    break;
                  }
                }
              }
            }

            if (parentItem && curItem.parentId && curItem.parentId !== "") {
              if (!parentItem.children) {
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

        }
      },
      ///
      /// --------- END Initialize items ---------
      ///

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
        //if (!parentItem || !parentItem.trElem)
        //  return;
        if (!parentItem)
          return;

        var newItemFound = _.findWhere(items, { id: newItem.id });
        if (newItemFound) // item exists
          return;

        newItem.parentObj = parentItem;
        if (!parentItem.children)
          parentItem.children = [];
        parentItem.children.push(newItem);
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

      removeItem: function (item) {
        //var parentObj = { id: item.parentId };
        //var newItem = { id: item.id, name: item.name, templateId: item.templateId };

        //var parentItem = _.findWhere(items, { id: parentObj.id });
        ////if (!parentItem || !parentItem.trElem)
        ////  return;
        //if (!parentItem)
        //  return;

        var removeItemFound = _.findWhere(items, { id: item.id });
        if (!removeItemFound) // item exists
          return;

        //newItem.parentObj = parentItem;
        items = _.without(items, _.findWhere(items, { id: removeItemFound.id }));
        if (removeItemFound.parentObj && removeItemFound.parentObj.children) {
          var children = removeItemFound.parentObj.children;
          removeItemFound.parentObj.children = _.without(children, _.findWhere(children, { id: removeItemFound.id }));
        }

        //var index = items.indexOf(removeItemFound);
        //if (index > -1) {
        //  items.splice(index, 1);
        //}

        // to call of the Events' subscribers
        var event = {
          action: "removeItem",
          item: removeItemFound
        };
        var keys = _.keys(itemChangeSubscribers);
        _.each(keys, function (subscriber) {
          if (subscriber && itemChangeSubscribers[subscriber])
            itemChangeSubscribers[subscriber](event);
        });
      },

      getSelectedItemTree: function () {
        var treeGrid;
        if (engineTree && engineTree.getTreeGrid()) {
          treeGrid = engineTree.getTreeGrid();
          if (!treeGrid)
            return null;
          return treeGrid.selectedItem;
        }
        return null;
      },

      ///
      /// End Items
      ///

      getTemplateItems: function () {
        var templateItems = [];
        if (items) {
          templateItems = _.where(items, { id: CONST.TEMPLATES_ROOT_ID() });
        }

        var allChildItems = [];
        _.each(templateItems, function (item) {
          var newItem = _.clone(item);
          allChildItems.push(_.clone(newItem));
          item.parentObj = null;
          Utils.findChildItems(allChildItems, newItem, true);
        });

        var allTemplates = [];
        _.each(allChildItems, function (item) {
          var templateId = parseInt(item.templateId);
          if (templateId > 0 && templateId !== CONST.TEMPLATE_FIELD_ID())
            allTemplates.push(item);
          else {
            var i = 0;
          }
        });
        return allTemplates;
      },

      getContentItems: function () {
        var contentItems = [];
        if (items) {
          contentItems = _.where(items, { id: CONST.CONTENT_ROOT_ID() });
        }

        var allContentItems = [];
        _.each(contentItems, function (item) {
          allContentItems.push(item);
          Utils.findChildItems(allContentItems, item);
        });

        return allContentItems;
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
        var mediaItem;
        var items = self.getItems();
        if (items) {
          mediaItem = _.findWhere(items, { id: CONST.MEDIA_ROOT_ID() });
        }

        var allMediaItems = [];
        if (mediaItem) {
          //allMediaItems.push(item);
          Utils.findChildItems(allMediaItems, mediaItem);
        }
        
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

        if(data.isNotified)
          Utils.showProcessBar(true);

        $http(req).
          success(function (response, status, headers, config) {
            if (success)
              success(response);
            self.httpRequestCallback(data, response);
          }).
          error(function (response, status, headers, config) {
            if (error)
              error(response, status, header, config);
            self.httpRequestCallback(data, response);
          });
      },

      httpRequestCallback: function(data, response) {
        if (data.isNotified) {
          Utils.showProcessBar(false);
          Utils.showNotification(data, response);
        }
      },

    };
    application.constructor();
    return application;
  };
  return Application();
});