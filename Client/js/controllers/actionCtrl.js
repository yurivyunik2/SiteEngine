require.config({
  paths: {
    panelFormCtrl: "Views/panels/panelForm/panelFormCtrl",
    panelTypes: "/SiteEngine/Client/Views/panels/panelTypes",
  },
});

define(["application",
        "notification",
        "panelFormCtrl",
        "panelTypes",
       ],
function (application, Notification, PanelFormCtrl, PanelTypes) {
  //function (application, PanelFormCtrl, PanelTypes) {

  var ActionCtrl = function ($scope, $http) {

    var self;

    var actionCtrl = {
      constructor: function () {
        self = this;
      },

      process: function (data) {
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
          case "insertItem": {
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
                  modalFormCtrl.showType(modalFormCtrl.FORM_TYPE().CREATE_TEMPLATE, dataRequest);
                } else {
                  modalFormCtrl.showType(modalFormCtrl.FORM_TYPE().CREATE_ITEM, dataRequest);
                }
              }
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
                modalFormCtrl.showType(modalFormCtrl.FORM_TYPE().CREATE_TEMPLATE, dataRequest);
              }
            }
            break;
          }
          case "saveItem": {
            if (selectedItem) {
              engineTree.infoPanel.setValuesForItemFields(selectedItem);
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
              modalFormCtrl.showType(modalFormCtrl.FORM_TYPE().UNKNOWN_FORM);
              break;
            }
          case "assignItem": {
            
            if (selectedItem) {              
              modalFormCtrl.showType(modalFormCtrl.FORM_TYPE().INSERT_OPTIONS, { item: selectedItem });
            } else {
              Notification.show(Notification.INFO(), "You need to select item!");
            }

            break;
          }
            
          case "detailsItem":
            {
              if (selectedItem) {
                modalFormCtrl.showType(modalFormCtrl.FORM_TYPE().LAYOUT, { item: selectedItem });
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
        }
      },

      saveItem: function (data) {
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
            parent: item.parent,
          },
          isNotified: true
        };

        application.httpRequest(requestData, function (response) {
          if (response.isOK) {
            if (response.data && response.data.item) {
              //selItem.fields = response.data.item.fields;
            }
          }
          if (data.callback)
            data.callback();
        }, function (response) {
          if (data.callback)
            data.callback();
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
          isNotified: true
        };

        application.httpRequest(requestData, function (response) {
          if (response.isOK) {
            if (response.data && response.data.item) {
              //selItem.fields = response.data.item.fields;
              var engineTree = application.getEngineTree();
              var treeGrid = engineTree.getTreeGrid();
              treeGrid.removeChildNode(response.data.item);
            }
          }
          if (data.callback)
            data.callback();
        }, function (response) {
          if (data.callback)
            data.callback();
        });
      },

    };
    actionCtrl.constructor();
    return actionCtrl;
  };

  return ActionCtrl;
});