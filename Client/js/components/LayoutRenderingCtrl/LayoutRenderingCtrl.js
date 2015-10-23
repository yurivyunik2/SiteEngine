
define(["application", "CONST", "Utils", "CommonTypes", "TreeGrid"], function (application, CONST, Utils, CommonTypes, TreeGrid) {
  //
  // LayoutRenderingCtrl
  //
  var $dvLayoutFormElem;
  var pathTemplate = "/SiteEngine/Client/js/components/LayoutRenderingCtrl/LayoutRenderingCtrl.html";

  
  Utils.LoadTemplate(pathTemplate, function($template) {
    $dvLayoutFormElem = $template.find(".dvLayoutForm");
  });

  var LayoutRenderingCtr = function (parentElem, field) {
    var self;
    var $el;

    var treeGridLayout;
    var btnLayoutSelector = ".btnLayout";
    var dvTreeLayoutSelector = ".dvTreeLayout";
    var spLayoutSelector = ".spLayout";

    var layoutRenderingCtr = CommonTypes.BaseCtrl(field, parentElem, $dvLayoutFormElem);
    _.extend(layoutRenderingCtr, {
      constructor: function () {
        self = this;

        self.createElement(self.createElementCallback);
        $el = self.get$el();
      },

      dispose: function () {
        if (treeGridLayout) {
          treeGridLayout.dispose();
          treeGridLayout = null;
        }
      },

      createElementCallback: function () {
        $el = self.get$el();

        // TreeGridLayout
        if ($el) {
          treeGridLayout = new TreeGrid($el.find(dvTreeLayoutSelector));
          treeGridLayout.setIsCheckBoxElem(false);

          // events
          $el.find(btnLayoutSelector).click(self.btnChooseClick);
          $el.find(dvTreeLayoutSelector).click(self.treeGridClick);
        }
      },

      getValue: function () {
        if (!$el)
          return "";

        var $btnLayoutElem = $el.find(btnLayoutSelector);
        var layout = {
          name: $btnLayoutElem.find(spLayoutSelector).html(),
          id: $btnLayoutElem.find(spLayoutSelector).attr("_id")
        };
        return JSON.stringify(layout);
      },


      populate: function (layout) {
        if (!$el)
          return;

        treeGridLayout.populate(application.getLayoutItems());

        var $btnLayoutElem = $el.find(btnLayoutSelector);
        $btnLayoutElem.find(spLayoutSelector).html("");

        if (layout) {
          try {
            var layoutObj;
            if (typeof layout === "string")
              layoutObj = JSON.parse(layout);
            else
              layoutObj = layout;
            if (layoutObj) {
              $btnLayoutElem.find(spLayoutSelector).html(layoutObj.name);
              $btnLayoutElem.find(spLayoutSelector).attr("_id", layoutObj.id);
            }
          } catch (ex) {
          }
        }
      },

      btnChooseClick: function (event) {
        var $parent = $(event.target).parents(".dropdown");
        var $dvTreeGrid = $parent.find(dvTreeLayoutSelector);
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
          self.populate(layout);

          treeGridLayout.hide();
        }
      },

    });

    layoutRenderingCtr.constructor();
    return layoutRenderingCtr;
  };

  LayoutRenderingCtr.isLoadTemplate = false;
  return LayoutRenderingCtr;
});

