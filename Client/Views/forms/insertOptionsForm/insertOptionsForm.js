define(["application", "TreeGrid", "CONST"], function (application, TreeGrid, CONST) {

  return function ($scope) {

    var self;
    
    var treeGrid;
    var formSelector = "#dvInsertOptions";

    var selectedItems = [];

    var itemChange;

    var insertOptionsForm = {

      constructor: function () {
        self = this;
      },
      
      show: function (data) {
        if (!data || !data.item)
          return;

        selectedItems = [];
        itemChange = data.item;

        setTimeout(function () {
          var $formElem = $(formSelector);
          if ($formElem.length > 0) {
            $formElem.find(".imgInsertOptionsArrow").click(self.clickArrow);

            self.populate(data);
          }
        }, 200);
        
      },
      
      populate: function () {
        var $formElem = $(formSelector);
        var $dvLeftArea = $formElem.find(".dvLeftArea");
        if ($dvLeftArea.length > 0) {
          //
          treeGrid = new TreeGrid($dvLeftArea);
          treeGrid.populate(application.getTemplateItems(true));
        }

        var insertOptions;
        if (itemChange.fields) {
          _.each(itemChange.fields, function (field) {
            if (field.id == CONST.INSERT_OPTIONS_FIELD_ID()) {
              insertOptions = field.value;
            }
          });
        }

        if (insertOptions) {
          var arInsertOptions = insertOptions.split("|");
          var items = application.getItems();
          for (var i = 0; i < arInsertOptions.length; i++) {
            var id = parseInt(arInsertOptions[i]);
            var itemsFound = _.where(items, { id: id });
            if(itemsFound.length > 0)
              selectedItems.push(itemsFound[0]);
          }
        }

        self.renderSelectedItems();
      },

      clickArrow: function (event) {
        if (event && event.target) {
          var id = event.target.id;
          switch (id) {
            case "imgLeft":
              {
                self.removeItem();
                break;
              }
            case "imgRight":
              {
                self.addItem();
                break;
              }
          }
        }
      },

      addItem: function () {
        if (treeGrid) {
          var selectedTreeItem = treeGrid.selectedItem;
          if (selectedTreeItem) {
            var itemsFound = _.where(selectedItems, { id: parseInt(selectedTreeItem.id) });
            if (itemsFound.length == 0) {
              selectedItems.push(selectedTreeItem);
              self.renderSelectedItems();
            }

          }
        }
      },
      
      removeItem: function () {
        if (selectedItems) {
          var $formElem = $(formSelector);
          var $selItemsElem = $formElem.find("#selItems");

          var selIds = [];
          _.each($selItemsElem[0].selectedOptions, function (option) {
            selIds.push(option.id);
          });

          _.each(selIds, function (id) {
            var itemsFound = _.where(selectedItems, { id: parseInt(id) });
            if (itemsFound.length > 0) {
              var index = selectedItems.indexOf(itemsFound[0]);
              if (index >= 0) {
                selectedItems.splice(index, 1);
              }
            }
          });

          self.renderSelectedItems();
        }
      },

      renderSelectedItems: function () {
        if (selectedItems) {
          var html = "";
          _.each(selectedItems, function (item) {
            html += "<option id='" + item.id + "'>" + item.name + "</option>";
          });
          var $formElem = $(formSelector);
          var $selItemsElem = $formElem.find("#selItems");
          $selItemsElem.html(html);
        }
      },

      clickOK: function () {

        var insertOptions = "";
        _.each(selectedItems, function (item) {
          insertOptions += item.id + "|";
        });

        if (itemChange && itemChange.fields) {
          _.each(itemChange.fields, function (field) {
            if (field.id == CONST.INSERT_OPTIONS_FIELD_ID()) {
              field.value = insertOptions;
            }
          });
        }

        var actionCtrl = application.getActionCtrl();
        if (actionCtrl) {
          var data = {
            actionType: "saveItem",
            item: itemChange,
            callback: function () {
              $scope.isShowModalForm = false;
            },
          };
          actionCtrl.process(data);
        }
      },

    };
    insertOptionsForm.constructor();
    return insertOptionsForm;

  };
});