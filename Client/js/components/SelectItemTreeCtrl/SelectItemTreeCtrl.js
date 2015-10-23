
define(["application", "CONST", "Utils", "CommonTypes", "TreeGrid"], function (application, CONST, Utils, CommonTypes, TreeGrid) {
  //
  // SelectItemTreeCtrl
  //
  var $dvSelectItemTreeElem;
  var pathTemplate = "/SiteEngine/Client/js/components/SelectItemTreeCtrl/SelectItemTreeCtrl.html";

  Utils.LoadTemplate(pathTemplate, function ($template) {
    $dvSelectItemTreeElem = $template.find(".dvSelectItemTree");
  });

  var SelectItemTreeCtrl = function (parentElem, field) {
    var self;
    var $el;

    var treeGrid;
    var selectedItems = [];

    var selectItemTreeCtrl = CommonTypes.BaseCtrl(field, parentElem, $dvSelectItemTreeElem);
    _.extend(selectItemTreeCtrl, {
      constructor: function() {
        self = this;

        self.createElement(self.createElementCallback);
      },

      dispose: function() {
        if (treeGrid) {
          treeGrid.dispose();
          treeGrid = null;
        }
      },

      createElementCallback: function () {
        $el = self.get$el();
        $el.find(".imgSelectItemTreeArrow").click(self.clickArrow);
      },

      getValue: function() {
        var assignedTemplates = "";
        _.each(selectedItems, function(item) {
          assignedTemplates += item.id + "|";
        });
        return assignedTemplates;
      },


      populate: function () {
        if (!$el) {
          return;
        }
        var $dvLeftArea = $el.find(".dvLeftArea");
        if ($dvLeftArea.length > 0) {
          //
          treeGrid = new TreeGrid($dvLeftArea);
          treeGrid.populate(application.getTemplateItems());
        }

        if (field.value) {
          var arSelectItems = field.value.split("|");
          var items = application.getItems();
          for (var i = 0; i < arSelectItems.length; i++) {
            var id = parseInt(arSelectItems[i]);
            var itemsFound = _.where(items, { id: id });
            if (itemsFound.length > 0)
              selectedItems.push(itemsFound[0]);
          }
        }

        self.renderSelectedItems();

        //
        self.isEnabled(self.getIsEnabled());
      },

      clickArrow: function(event) {
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

      addItem: function() {
        if (treeGrid) {
          var selectedTreeItem = treeGrid.selectedItem;
          if (selectedTreeItem) {
            var itemsFound = _.where(selectedItems, { id: parseInt(selectedTreeItem.id) });
            if (itemsFound.length === 0) {
              selectedItems.push(selectedTreeItem);
              self.renderSelectedItems();
            }

          }
        }
      },

      removeItem: function() {
        if ($el && selectedItems) {
          var $selItemsElem = $el.find("#selItems");
          var selIds = [];
          _.each($selItemsElem[0].selectedOptions, function(option) {
            selIds.push(option.id);
          });
          _.each(selIds, function(id) {
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

      renderSelectedItems: function() {
        if ($el && selectedItems) {
          var html = "";
          _.each(selectedItems, function(item) {
            html += "<option id='" + item.id + "'>" + item.name + "</option>";
          });
          var $selItemsElem = $el.find("#selItems");
          $selItemsElem.html(html);
        }
      },

    });

    selectItemTreeCtrl.constructor();
    return selectItemTreeCtrl;
  };

  SelectItemTreeCtrl.isLoadTemplate = false;
  return SelectItemTreeCtrl;
});

