
define(["application", "CONST", "Utils", "CommonTypes"], function (application, CONST, Utils, CommonTypes) {
  //
  // LayoutContentCtrl
  //
  var $dvLayoutContentElem;
  var $layoutContentTemplateElem;
  var $layoutContentTemplateObj;
  var pathTemplate = "/SiteEngine/Client/js/components/LayoutContentCtrl/LayoutContentCtrl.html";


  Utils.LoadTemplate(pathTemplate, function ($template) {
    $dvLayoutContentElem = $template.find(".dvLayoutContent");
    $layoutContentTemplateElem = $("#layoutContentTemplate");
    if ($layoutContentTemplateElem.length > 0) {
      $layoutContentTemplateObj = _.template($layoutContentTemplateElem.html());
    }
  });

  var LayoutContentCtrl = function (parentElem, field) {
    var self;
    var $el;

    var layoutContentCtrl = CommonTypes.BaseCtrl(field, parentElem, $dvLayoutContentElem);
    _.extend(layoutContentCtrl, {
      constructor: function () {
        self = this;

        self.createElement(self.createElementCallback);
        $el = self.get$el();
      },

      dispose: function () {
      },

      createElementCallback: function () {
        $el = self.get$el();
        //
        if ($el) {

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

        $el.html("");
        if (field.value) {
          try {
            var arUserAgents;
            if (typeof field.value === "string")
              arUserAgents = JSON.parse(field.value);
            else
              arUserAgents = layout;
            if (arUserAgents && $layoutContentTemplateObj) {

              _.each(arUserAgents, function (userAgent) {
                var htmlUserAgent = $layoutContentTemplateObj({ item: userAgent });

                $el.append(htmlUserAgent);
              });

            }
          } catch (ex) {
          }

        }
      },

    });

    layoutContentCtrl.constructor();
    return layoutContentCtrl;
  };

  LayoutContentCtrl.isLoadTemplate = false;
  return LayoutContentCtrl;
});
