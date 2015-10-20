
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
      $dvInsertOptionsElem = $template.find("#dvInsertOptions");
    });
  })();

  var AssignTemplateCtrl = function (parentElem, field) {
    var self;

    var $el;

    var treeGrid;

    var selectedItems = [];

    var itemChange;


    var assignTemplateCtrl = {

      constructor: function () {
        self = this;

        //if (field)
        //  imgValue = field.value;
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
            //$el.find("img, a").click(self.chooseImage);
            //$el.find("input").change(self.changeSrc);
          }
        }
      },

      render: function () {
        if (!$el) {
          self.createElement();
        }

        //if (Utils.isValueNull(imgValue) && $el.find("img").length > 0) {
        //  $el.find("img")[0].src = srcEmptyImage;
        //  $el.find("input").val("");
        //} else {
        //  $el.find("img")[0].src = imgValue;
        //  $el.find("input").val(imgValue);
        //}

        self.populate();
      },

      getValue: function () {
        return imgValue;
      },



      populate: function () {
        //var $formElem = self.get$Elem();
        if (!$el) {
          return;
        }

        var $dvLeftArea = $el.find(".dvLeftArea");
        if ($dvLeftArea.length > 0) {
          //
          treeGrid = new TreeGrid($dvLeftArea);
          treeGrid.populate(application.getTemplateItems());
        }

        var insertOptions = field.value;
        //if (itemChange.fields) {
        //  _.each(itemChange.fields, function (field) {
        //    if (field.fieldId === CONST.INSERT_OPTIONS_FIELD_ID()) {
        //      insertOptions = field.value;
        //    }
        //  });
        //}

        if (insertOptions) {
          var arInsertOptions = insertOptions.split("|");
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
          //var $formElem = self.get$Elem();
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

      clickOK: function (callback) {

        var insertOptions = "";
        _.each(selectedItems, function (item) {
          insertOptions += item.id + "|";
        });

        if (itemChange && itemChange.fields) {
          _.each(itemChange.fields, function (field) {
            if (field.id === CONST.INSERT_OPTIONS_FIELD_ID()) {
              field.value = insertOptions;
            }
          });
        }

        var actionCtrl = application.getActionCtrl();
        if (actionCtrl) {
          var data = {
            actionType: "saveItem",
            item: itemChange,
            callback: callback,
          };
          actionCtrl.process(data);
        }
      },

    };

    assignTemplateCtrl.constructor();
    return assignTemplateCtrl;
  };

  AssignTemplateCtrl.isLoadTemplate = false;
  return AssignTemplateCtrl;
});

