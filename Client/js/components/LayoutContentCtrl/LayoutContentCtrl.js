
define(["application", "CONST", "Utils", "CommonTypes"], function (application, CONST, Utils, CommonTypes) {
  //
  // LayoutContentCtrl
  //
  var $dvLayoutContentElem;
  var $layoutContentTemplateElem;
  var $layoutContentTemplateObj;
  var pathTemplate = "/SiteEngine/Client/js/components/LayoutContentCtrl/LayoutContentCtrl.html";

  var dvRemoveButtonSelector = ".dvRemoveButton";

  var arUserAgents = [];

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
          $el.find(".dvAddButton").click(function () {
            var $dvEnterFieldsElem = $el.find(".dvEnterFields");
            var userAgent = {
              userAgent: $dvEnterFieldsElem.find(".inUserAgent").val(),
              path: $dvEnterFieldsElem.find(".inPath").val(),
            };
            self.addUserAgent(userAgent);
            $dvEnterFieldsElem.find(".inUserAgent").val("");
            $dvEnterFieldsElem.find(".inPath").val("");
          });
        }
      },

      getValue: function () {
        if (!$el && !arUserAgents)
          return "";

        return JSON.stringify(arUserAgents);
      },

      populate: function (layout) {
        if (!$el)
          return;
        
        arUserAgents = [];

        if (field.value) {
          try {
            var userAgents;
            if (typeof field.value === "string")
              userAgents = JSON.parse(field.value);
            else
              userAgents = layout;
            if (userAgents && $layoutContentTemplateObj) {

              _.each(userAgents, function (userAgent) {
                self.addUserAgent(userAgent);
              });

              $el.find(dvRemoveButtonSelector).click(self.removeClick);
            }
          } catch (ex) {
          }

        }
      },

      addUserAgent: function (userAgent) {
        if (!userAgent)
          return;

        arUserAgents.push(userAgent);

        var htmlUserAgent = $layoutContentTemplateObj({ item: userAgent });

        var $dvCurrentFieldsElem = $el.find(".dvCurrentFields");
        $dvCurrentFieldsElem.prepend(htmlUserAgent);
      },

      removeClick: function (event) {
        var $dvUserAgentPathElem = $(event.currentTarget).parents(".dvUserAgentPath");        

        var $spUserAgentValueElem = $dvUserAgentPathElem.find(".spUserAgentValue");
        var userAgentFound = _.find(arUserAgents, { userAgent: $spUserAgentValueElem.html() })
        if (userAgentFound) {
          arUserAgents = _.without(arUserAgents, userAgentFound);
          $dvUserAgentPathElem.remove();
        }        
      },

    });

    layoutContentCtrl.constructor();
    return layoutContentCtrl;
  };

  LayoutContentCtrl.isLoadTemplate = false;
  return LayoutContentCtrl;
});
