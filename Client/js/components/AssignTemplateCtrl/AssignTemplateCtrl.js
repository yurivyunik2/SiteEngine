
define(["application", "CONST", "TreeGrid"], function (application, CONST, TreeGrid) {
  //
  // AssignTemplateCtrl
  //
  var $dvInsertOptionsElem;
  var pathTemplate = "js/components/AssignTemplateCtrl/AssignTemplateCtrl.html";
  //var srcEmptyImage = "/SiteEngine/Client/images/media/emptyImage.png";

  (function LoadTemplate() {
    var $template = $("<div></div>");
    $template.load(pathTemplate, function () {
      $(document.body).append($template.html());
      $dvInsertOptionsElem = $template.find(".dvInsertOptions");
    });
  })();

  var AssignTemplateCtrl = function (parentElem, field) {
    var self;

    var $el;
    var treeGrid;
    var selectedItems = [];

    var assignTemplateCtrl = {

      constructor: function () {
        self = this;
      },

      dispose: function() {
        if (treeGrid)
          treeGrid.dispose();
      },

      createElement: function () {
        if (parentElem && field && $dvInsertOptionsElem) {
          var $newElem = $dvInsertOptionsElem.clone();
          $newElem.css("display", "block");
          $newElem[0].id = field.id;

          var html = "<td>" + $newElem[0].outerHTML + "</br></br></td>";
          if (parentElem) {
            parentElem.append(html);
            $el = parentElem.children().last();
            $el.find(".imgInsertOptionsArrow").click(self.clickArrow);
          }
        }
      },

      render: function () {
        if (!$el) {
          self.createElement();
        }
        self.populate();
      },

      getValue: function () {
        var insertOptions = "";
        _.each(selectedItems, function (item) {
          insertOptions += item.id + "|";
        });
        return insertOptions;
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
          var arInsertOptions = field.value.split("|");
          var items = application.getItems();
          for (var i = 0; i < arInsertOptions.length; i++) {
            var id = parseInt(arInsertOptions[i]);
            var itemsFound = _.where(items, { id: id });
            if (itemsFound.length > 0)
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
            if (itemsFound.length === 0) {
              selectedItems.push(selectedTreeItem);
              self.renderSelectedItems();
            }

          }
        }
      },

      removeItem: function () {
        if ($el && selectedItems) {
          var $selItemsElem = $el.find("#selItems");
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
        if ($el && selectedItems) {
          var html = "";
          _.each(selectedItems, function (item) {
            html += "<option id='" + item.id + "'>" + item.name + "</option>";
          });
          var $selItemsElem = $el.find("#selItems");
          $selItemsElem.html(html);
        }
      },

    };

    assignTemplateCtrl.constructor();
    return assignTemplateCtrl;
  };

  AssignTemplateCtrl.isLoadTemplate = false;
  return AssignTemplateCtrl;
});

