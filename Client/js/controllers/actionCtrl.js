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

        var selectedItem;
        var treeGrid;
        var engineTree = application.getEngineTree();
        if (engineTree && engineTree.getTreeGrid()) {
          treeGrid = engineTree.getTreeGrid();
          selectedItem = treeGrid.selectedItem;
        }
        if (!treeGrid)
          return;

        var modalFormCtrl = application.getModalFormCtrl();
        var dataRequest;
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
                selectedItem: treeGrid.selectedItem,
              };
              modalFormCtrl.setType(modalFormCtrl.FORM_TYPE().SELECT_TEMPLATE, dataRequest);
            }
            break;
          }
          case "copyItem": {
            if (selectedItem) {
              var action = "copyItem";
              var data = {
                action: action,
                item: {
                  id: selectedItem.id,
                  //templateId: dataCtrl.selectedTemplate.id
                },
                isNotified: true,
                actionName: "Copying",
              };

              application.httpRequest(data, function (response) {
                if (!response.error) {
                  //if (response.data && response.data.item) {
                  //  application.addItem(response.data.item);
                  //}
                }
                if (callback)
                  callback();
              }, function (response, status, headers, config) {
                if (callback)
                  callback();
              });
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
            if (selectedItem) {
              engineTree.infoPanel.getValuesForItemFields(selectedItem);
              data.item = selectedItem;
              self.saveItem(data);
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
            templateId: item.templateId,
            fields: item.fields,
            parent: item.parentId,
          },
          isNotified: true,
          actionName: "Saving",
        };

        application.httpRequest(requestData, function (response) {
          if (!response.error) {
            if (response.data && response.data.item) {
              //selItem.fields = response.data.item.fields;
            }
          }
          if (callback)
            callback(data);
        }, function (response) {
          if (callback)
            callback(data);
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
          if (!response.error) {
            if (response.data && response.data.item) {
              //selItem.fields = response.data.item.fields;
              application.removeItem(response.data.item);
            }
          }
          if (data.callback)
            data.callback();
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
                application.getEngineTree().selectCurrentItem();
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
                application.getEngineTree().selectCurrentItem();
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