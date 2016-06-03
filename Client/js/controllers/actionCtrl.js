require.config({
  paths: {
    panelFormCtrl: "/SiteEngine/Client/Views/panels/panelForm/panelFormCtrl",
    panelTypes: "/SiteEngine/Client/Views/panels/panelTypes",
  },
});

define(["application",
        "Utils",
        "CONST",
        "notification",
        "panelFormCtrl",
        "panelTypes",
       ],
function (application, Utils, CONST, Notification, PanelFormCtrl, PanelTypes) {
  //function (application, PanelFormCtrl, PanelTypes) {

  var NOTIFICATION_MESSAGES = {
    "deleteItem": "Do you really want to remove the item?",
    "editItem": "Do you really want to edit the item?",
  };

  var ActionCtrl = function ($scope, $http) {

    var self;

    var actionCtrl = {
      constructor: function () {
        self = this;
      },

      process: function (data) {
        if (!data || !data.actionType)
          return;

        if (data.isNotification && NOTIFICATION_MESSAGES[data.actionType]) {
          var modalFormCtrl = application.getModalFormCtrl();
          modalFormCtrl.setType(modalFormCtrl.FORM_TYPE().NOTIFICATION_MODAL, {
            message: NOTIFICATION_MESSAGES[data.actionType],
            callback: self.processCallback,
            callbackData: data
          });
        } else {
          self.processCallback(data);
        }
      },

      processCallback: function (data) {
        if (!data || !data.actionType)
          return;
        
        var treeGrid;
        var engineTree = application.getEngineTree();
        if (engineTree && engineTree.getTreeGrid()) {
          treeGrid = engineTree.getTreeGrid();
        }
        if (!treeGrid)
          return;

        var selectedItem = treeGrid.selectedItem;

        var modalFormCtrl = application.getModalFormCtrl();
        var dataRequest;
        var dataForm;
        var isItemUnderTemplates;
        var isTemplateDataItem;

        switch (data.actionType) {
          case "addNewItem": {
            if (data.item) {
              if (selectedItem) {
                treeGrid.selectedTemplate = data.item;
                isItemUnderTemplates = application.isItemUnderTemplates(selectedItem);
                isTemplateDataItem = application.isTemplateItem(data.item);

                dataRequest = {
                  selectedItem: treeGrid.selectedItem,
                  selectedTemplate: treeGrid.selectedTemplate
                };

                if (isItemUnderTemplates && isTemplateDataItem) {
                  modalFormCtrl.setType(modalFormCtrl.FORM_TYPE().CREATE_TEMPLATE, dataRequest);
                } else {
                  modalFormCtrl.setType(modalFormCtrl.FORM_TYPE().CREATE_ITEM, dataRequest);
                }
              }
            }
            break;
          }
          case "addNewFromTemplate": {
            if (selectedItem) {
              dataRequest = {
                selectedItem: selectedItem,
              };
              modalFormCtrl.setType(modalFormCtrl.FORM_TYPE().SELECT_TEMPLATE, dataRequest);
            }
            break;
          }
          case "copyItem": {
            if (selectedItem) {
              dataRequest = {
                item: {
                  id: selectedItem.id,
                  parentId: selectedItem.parentId,
                },
              };

              self.copyItem(dataRequest);
            }
            break;
          }
          case "copyItemTo": {
            if (selectedItem) {
              dataForm = {
                availableItems: application.getContentItems(),
                title: "Select the parent item:",
                callback : function(dataResponse) {
                  dataRequest = {
                    item: {
                      id: selectedItem.id,
                    },
                    parentItem: dataResponse.selectedItem,                    
                  };
                  self.copyItem(dataRequest);
                }
              };
              modalFormCtrl.setType(modalFormCtrl.FORM_TYPE().SELECT_TREE_ITEM, dataForm);
            }
            break;
          }
          case "moveItemTo": {
            if (selectedItem) {
              dataForm = {
                availableItems: application.getContentItems(),
                title: "Select the parent item:",
                callback: function (dataResponse) {
                  dataRequest = {
                    item: {
                      id: selectedItem.id,
                    },
                    parentItem: dataResponse.selectedItem,
                  };
                  self.moveItem(dataRequest);
                }
              };
              modalFormCtrl.setType(modalFormCtrl.FORM_TYPE().SELECT_TREE_ITEM, dataForm);
            }
            break;
          }
          case "editItem": {
            if (selectedItem) {
              treeGrid.selectedTemplate = data.item;
              isItemUnderTemplates = application.isItemUnderTemplates(selectedItem);

              dataRequest = {
                isChange: true,
                selectedItem: treeGrid.selectedItem,
                selectedTemplate: treeGrid.selectedTemplate
              };

              if (isItemUnderTemplates) {
                modalFormCtrl.setType(modalFormCtrl.FORM_TYPE().CREATE_TEMPLATE, dataRequest);
              }
            }
            break;
          }
          case "saveItem": {
            if (!data.item) {
              engineTree.infoPanel.getValuesForItemFields(selectedItem);
              data.item = selectedItem;
            }
            if (data.item) {
              self.saveItem(data, data.callback);
            }
            break;
          }
          case "deleteItem": {
            if (selectedItem) {
              dataRequest = {
                actionType: "deleteItem",
                item: {
                  id: selectedItem.id
                },
                callback: function () {

                },
              };
              self.deleteItem(dataRequest);              
            }
            break;
          }
          case "renameItem": {
            if (selectedItem) {
              treeGrid.renameItem(selectedItem);
            }
            break;
          }
          case "previewItem":
            {
              self.previewItem(false);                           
              break;
            }
          case "previewEditItem":
            {
              self.previewItem(true);
              break;
            }
          case "assignItem": {

            if (selectedItem) {
              modalFormCtrl.setType(modalFormCtrl.FORM_TYPE().ASSIGN_TEMPLATE, { item: selectedItem });
            } else {
              Notification.show(Notification.INFO(), "You need to select item!");
            }

            break;
          }
          case "detailsItem":
            {
              if (selectedItem) {
                modalFormCtrl.setType(modalFormCtrl.FORM_TYPE().LAYOUT, { item: selectedItem });
              } else {
                Notification.show(Notification.INFO(), "You need to select item!");
              }
              break;
            }
          case "listUsers":
            {
              var panelFormCtrl = new PanelFormCtrl($scope, (new PanelTypes($scope)).USER_MANAGER);
              panelFormCtrl.show();
              break;
            }
          case "publishItem":
          case "unpublishItem": {
            if (selectedItem) {
              //engineTree.infoPanel.setValuesForItemFields(selectedItem);
              data.item = selectedItem;
              self.publishItem(data);
            }
            break;
          }
          case "publishTree":
          case "unpublishTree": {
            if (selectedItem) {
              //engineTree.infoPanel.setValuesForItemFields(selectedItem);
              data.item = selectedItem;
              self.publishTree(data);
            }
            break;
          }
        }
      },

      saveItem: function (data, callback) {
        if (!data || !data.item)
          return;

        var action = "saveItem";
        var item = data.item;
        var requestData = {
          action: action,
          item: {
            id: item.id,
            name: item.name,
            templateId: item.templateId,
            fields: item.fields,
            parent: item.parentId,
          },
          isNotified: true,
          actionName: (data.actionName ? data.actionName : "Saving"),
        };

        application.httpRequest(requestData, function (response) {
          if (!response.error) {
            if (response.data && response.data.item) {
              //selItem.fields = response.data.item.fields;
              var responseItem = response.data.item;
              var itemsHash = application.getItemsHash();
              var itemSource = itemsHash[responseItem.id];
              if (itemSource) {
                itemSource.name = responseItem.name;
                itemSource.templateId = responseItem.templateId;
                responseItem.fields = responseItem.fields;
                var treeGrid = application.getEngineTree().getTreeGrid();
                treeGrid.refreshItem(itemSource);
              }
            }
          }
          if (callback)
            callback(response.data);
        }, function (response) {
          if (callback)
            callback(response.data);
        });          
        
      },

      copyItem: function (data) {
        if (!data || !data.item)
          return;

        var requestData = {
          action: "copyItem",
          item: {
            id: data.item.id,
          },
          parentItem: {
            id: (data.parentItem ? data.parentItem.id : data.item.parentId)
          },
          isNotified: true,
          actionName: "Copying",
        };

        application.httpRequest(requestData, function (response) {
          if (!(response.errors && response.errors.length > 0)) {
            if (response.items) {
              _.each(response.items, function (item) {
                application.addItem(item);
              });
            }
          }
        }, function (response, status, headers, config) {

        });
      },

      moveItem: function (data) {
        if (!data || !data.item || !data.parentItem)
          return;

        var requestData = {
          action: "moveItem",
          item: {
            id: data.item.id,
          },
          parentItem: {
            id: data.parentItem.id
          },
          isSameName: true,
          isNotified: true,
          actionName: "Moving",
        };

        application.httpRequest(requestData, function (response) {
          if (!(response.errors && response.errors.length > 0)) {
            if (response.addItems) {
              _.each(response.addItems, function (item) {
                application.addItem(item);
              });
            }
            if (response.removeItems) {
              _.each(response.removeItems, function (item) {
                application.removeItem(item);
              });
            }
          }
        }, function (response, status, headers, config) {

        });
      },

      deleteItem: function (data) {
        if (!data || !data.item)
          return;

        var action = "deleteItem";
        var item = data.item;
        var requestData = {
          action: action,
          item: {
            id: item.id,
            fields: item.fields,
          },
          isNotified: true,
          actionName: "Deleting",
        };

        application.httpRequest(requestData, function (response) {
          var responseItem = null;
          if (!response.error) {
            if (response.data && response.data.item) {
              //selItem.fields = response.data.item.fields;
              responseItem = response.data.item;
              application.removeItem(responseItem);
            }
          }
          if (data.callback)
            data.callback(responseItem);
        }, function (response) {
          if (data.callback)
            data.callback();
        });
      },

      publishItem: function (data) {
        if (!data || !data.item)
          return;

        var curLangguage = Utils.getLanguageCurrent();
        var curVersion = Utils.getVersionCurrent();
        if (curLangguage && curVersion) {
          var isPublish = true;
          var actionName = "Publishing";
          if (data.actionType === "unpublishItem") {
            isPublish = false;
            actionName = "Unpublishing";
          }
          var action = "publishItem";
          var item = data.item;
          var requestData = {
            action: action,
            item: {
              id: item.id,
              name: item.name,
              templateId: item.templateId,
              isPublish: isPublish,
              fields: item.fields,
            },
            lang: curLangguage.code,
            version: curVersion,
            isNotified: true,
            actionName: actionName,
          };

          application.httpRequest(requestData, function (response) {
            if (!response.error) {
              if (response.data && response.data.item) {
                var treeGrid = application.getEngineTree().getTreeGrid();
                treeGrid.refreshItem(treeGrid.selectedItem);
              }
            }
            if (data.callback)
              data.callback();
          }, function (response) {
            if (data.callback)
              data.callback();
          });
        }

      },

      publishTree: function (data) {
        if (!data || !data.item)
          return;

        var curLangguage = Utils.getLanguageCurrent();
        var curVersion = Utils.getVersionCurrent();
        if (curLangguage && curVersion) {
          var isPublish = true;
          var actionName = "Publishing";
          if (data.actionType === "unpublishTree") {
            isPublish = false;
            actionName = "Unpublishing";
          }
          var action = "publishTree";
          var item = data.item;
          var requestData = {
            action: action,
            item: {
              id: item.id,
              name: item.name,
              templateId: item.templateId,
              isPublish: isPublish,
              fields: item.fields,
            },
            lang: curLangguage.code,
            version: curVersion,
            isNotified: true,
            actionName: actionName,
          };

          application.httpRequest(requestData, function (response) {
            if (!response.error) {
              if (response.data && response.data.item) {
                var treeGrid = application.getEngineTree().getTreeGrid();
                treeGrid.refreshItem(treeGrid.selectedItem);
              }
            }
            if (data.callback)
              data.callback();
          }, function (response) {
            if (data.callback)
              data.callback();
          });
        }

      },

      previewItem: function (isEdit) {
        var selectedItem = application.getSelectedItemTree();
        if (selectedItem && selectedItem.fields) {
          var fieldRendering = _.find(selectedItem.fields, { fieldId: CONST.RENDERINGS_FIELD_ID() });
          if (fieldRendering && !Utils.isValueNull(fieldRendering.value)) {
            try {
              var rendering = JSON.parse(fieldRendering.value);
              if (!Utils.isValueNull(rendering.id)) {

                // finding of the Content Parent item and forming relatieve path
                var maxCountParent = 15;
                var index = 0;
                var isContentParentFound = false;
                var curItem = selectedItem;
                var relativePath = "";
                while (!isContentParentFound && curItem.parentObj && index < maxCountParent) {
                  if (curItem.parentObj.id === CONST.CONTENT_ROOT_ID()) {
                    isContentParentFound = true;
                  }
                  relativePath = "/" + curItem.name + relativePath;
                  curItem = curItem.parentObj;
                  index++;
                }
                if (isContentParentFound) {
                  window.open(relativePath + "?isEdit=true");
                }
              }
            } catch (ex) { }
          }
        }
      },
    };
    actionCtrl.constructor();
    return actionCtrl;
  };

  return ActionCtrl;
});