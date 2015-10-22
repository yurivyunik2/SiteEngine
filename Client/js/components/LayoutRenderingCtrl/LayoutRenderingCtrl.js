
define(["application", "CONST", "CommonTypes", "TreeGrid"], function (application, CONST, CommonTypes, TreeGrid) {
  //
  // LayoutRenderingCtrl
  //
  var $dvLayoutFormElem;
  var pathTemplate = "/SiteEngine/Client/js/components/LayoutRenderingCtrl/LayoutRenderingCtrl.html";

  (function LoadTemplate() {
    var $template = $("<div></div>");
    $template.load(pathTemplate, function () {
      $(document.body).append($template.html());
      $dvLayoutFormElem = $template.find(".dvLayoutForm");
    });
  })();

  var LayoutRenderingCtr = function (parentElem, field) {
    var self;

    var $el;    
    var treeGridLayout;
    var btnLayoutSelector = ".btnLayout";
    var dvTreeLayoutSelector = ".dvTreeLayout";
    var spLayoutSelector = ".spLayout";

    var layoutRenderingCtr = CommonTypes.BaseCtrl(field);
    _.extend(layoutRenderingCtr, {
      constructor: function () {
        self = this;
      },

      dispose: function () {

      },

      get$el: function () { return $el; },

      createElement: function () {
        if (parentElem && field && $dvLayoutFormElem) {
          var $newElem = $dvLayoutFormElem.clone();
          $newElem.css("display", "block");
          $newElem[0].id = field.id;

          var html = $newElem[0].outerHTML;
          if (parentElem) {
            parentElem.append(html);
            $el = parentElem.children().last();

            // TreeGridLayout
            treeGridLayout = new TreeGrid($el.find(dvTreeLayoutSelector));

            // events
            $el.find(btnLayoutSelector).click(self.btnChooseClick);
            $el.find(dvTreeLayoutSelector).click(self.treeGridClick);
          }
        }
      },

      getValue: function () {
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
        if (!$el)
          return;        

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

