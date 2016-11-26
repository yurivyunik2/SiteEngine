
define(["application", "CONST", "Utils", "CommonTypes", "TreeGrid"], function (application, CONST, Utils, CommonTypes, TreeGrid) {
  //
  // LayoutRenderingCtrl
  //
  var $dvLayoutFormElem;
  var pathTemplate = "/SiteEngine/Client/js/components/LayoutRenderingCtrl/LayoutRenderingCtrl.html";

  
  Utils.LoadTemplate(pathTemplate, function($template) {
    $dvLayoutFormElem = $template.find(".dvLayoutForm");
  });

  var LayoutRenderingCtrl = function (parentElem, field) {
    var self;
    var $el;

    var $btnLayoutElem;
    var $dvTreeGrid;
    var $spLayoutElem;

    var treeGridLayout;

    var layoutRenderingCtr = CommonTypes.BaseCtrl(field, parentElem, $dvLayoutFormElem);
    _.extend(layoutRenderingCtr, {
      constructor: function () {
        self = this;

        self.createElement(self.createElementCallback);
        $el = self.get$el();

        if ($el && $el.length > 0 && $el[0].id) {
          application.addUIComponent("layoutRenderingCtr_" + $el[0].id, self);
        }
      },

      dispose: function () {
        if ($el && $el.length > 0 && $el[0].id) {
          application.removeUIComponent("layoutRenderingCtr_" + $el[0].id);
        }

        if (treeGridLayout) {
          treeGridLayout.dispose();
          treeGridLayout = null;
        }
      },

      intervalUI: function (uiData) {
        if (!uiData || !$el)
          return;

        try {
          if (uiData.mouseDownEventLast) {
            //self.keyDownEventFunc(uiData.keyDownEventLast);
            var eventX = uiData.mouseDownEventLast.clientX;
            var eventY = uiData.mouseDownEventLast.clientY;

            var rectBound = $btnLayoutElem[0].getBoundingClientRect();
            var isTreeGridShow = false;
            if (eventX >= rectBound.left && eventX <= (rectBound.left + rectBound.width) &&
              eventY >= rectBound.top && eventY <= (rectBound.top + rectBound.height)) {
              isTreeGridShow = true;
            }
            rectBound = $dvTreeGrid[0].getBoundingClientRect();
            if (eventX >= rectBound.left && eventX <= (rectBound.left + rectBound.width) &&
              eventY >= rectBound.top && eventY <= (rectBound.top + rectBound.height)) {
              isTreeGridShow = true;
            }
            if (!isTreeGridShow) {
              $dvTreeGrid.css("display", "none");
            }
          }
        } catch (ex) { }

      },

      createElementCallback: function () {
        $el = self.get$el();

        // TreeGridLayout
        if ($el) {
          $dvTreeGrid = $el.find(".dvTreeLayout");
          treeGridLayout = new TreeGrid($dvTreeGrid);
          treeGridLayout.setIsCheckBoxElem(false);

          $btnLayoutElem = $el.find(".btnLayout");
          $spLayoutElem = $el.find(".spLayout");

          // events
          $btnLayoutElem.click(self.btnChooseClick);
          $dvTreeGrid.click(self.treeGridClick);
        }
      },

      getValue: function () {
        if (!$el)
          return "";
        
        var layout = {
          name: $spLayoutElem.html(),
          id: $spLayoutElem.attr("_id")
        };
        return JSON.stringify(layout);
      },


      populate: function (value) {
        if (!$el)
          return;

        treeGridLayout.populate(application.getLayoutItems());

        self.render(value);
      },

      render: function (value) {
        $spLayoutElem.html("");
        if (value) {
          var layout = value;
          try {
            var layoutObj;
            if (typeof layout === "string")
              layoutObj = JSON.parse(layout);
            else
              layoutObj = layout;
            if (layoutObj) {
              $spLayoutElem.html(layoutObj.name);
              $spLayoutElem.attr("_id", layoutObj.id);
            }
          } catch (ex) { }
        }
      },

      btnChooseClick: function (event) {
        var $parent = $(event.target).parents(".dropdown");
        var display;
        if ($dvTreeGrid.css("display") === "block")
          display = "none";
        else {
          display = "block";
        }
        $dvTreeGrid.css("display", display);
      },

      treeGridClick: function (event) {
        if (treeGridLayout && treeGridLayout.selectedItem &&
            (!treeGridLayout.selectedItem.children || treeGridLayout.selectedItem.children.length === 0)) {
          var selItem = treeGridLayout.selectedItem;          
          var layout = { name: selItem.name, id: selItem.id };
          self.render(layout);

          treeGridLayout.hide();
        }
      },

    });

    layoutRenderingCtr.constructor();
    return layoutRenderingCtr;
  };

  LayoutRenderingCtrl.isLoadTemplate = false;
  return LayoutRenderingCtrl;
});
