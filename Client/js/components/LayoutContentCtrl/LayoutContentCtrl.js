
define(["application", "CONST", "Utils", "CommonTypes"], function (application, CONST, Utils, CommonTypes) {
  //
  // LayoutContentCtrl
  //
  var $dvLayoutContentElem;
  var $layoutContentTemplateElem;
  var $layoutContentTemplateObj;
  var pathTemplate = "/SiteEngine/Client/js/components/LayoutContentCtrl/LayoutContentCtrl.html";

  var dvRemoveButtonSelector = ".dvRemoveButton";
  var dvEditButtonSelector = ".dvEditButton";
  var dvOkButtonSelector = ".dvOkButton";

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
            var isAdded = self.addUserAgent(userAgent);
            if (isAdded) {
              $dvEnterFieldsElem.find(".inUserAgent").val("");
              $dvEnterFieldsElem.find(".inPath").val("");
            }
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
            }
          } catch (ex) {
          }

        }
      },

      addUserAgent: function (userAgent) {
        if (!userAgent || !userAgent.path)
          return;

        var userAgentFound = _.find(arUserAgents, { userAgent: userAgent.userAgent });
        if (userAgentFound)
          return;

        arUserAgents.push(userAgent);

        var $dvCurrentFieldsElem = $el.find(".dvCurrentFields");
        var htmlUserAgent = $layoutContentTemplateObj({ item: userAgent });        
        $dvCurrentFieldsElem.prepend(htmlUserAgent);
        var elemAdded = $dvCurrentFieldsElem.children().first();
        elemAdded.find(dvRemoveButtonSelector).click(self.removeClick);
        elemAdded.find(dvEditButtonSelector).click(self.editClick);
        elemAdded.find("input").keydown(function (event) {
          event = event || window.event;
          if (event.which === CONST.ENTER_KEY()) {
            self.okClick(event);
          }
        });
        elemAdded.find(dvOkButtonSelector).click(self.okClick);
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

      editClick: function (event) {
        self.setEditMode(true);
      },

      setEditMode: function (isEdit) {
        var $dvUserAgentPathElem = $(event.currentTarget).parents(".dvUserAgentPath");

        var spanDisplay = isEdit ? "none" : "inline-block";
        var inputDisplay = isEdit ? "block" : "none";

        var $spUserAgentValueElem = $dvUserAgentPathElem.find(".spUserAgentValue");
        var $inUserAgentElem = $dvUserAgentPathElem.find(".inUserAgent");
        $inUserAgentElem.val($spUserAgentValueElem.html());
        //$spUserAgentValueElem.css("display", spanDisplay);
        //$inUserAgentElem.css("display", inputDisplay);

        var $spPathValueElem = $dvUserAgentPathElem.find(".spPathValue");
        var $inPathElem = $dvUserAgentPathElem.find(".inPath");
        $inPathElem.val($spPathValueElem.html());
        $spPathValueElem.css("display", spanDisplay);
        $inPathElem.css("display", inputDisplay);

        $dvUserAgentPathElem.find(".dvIcon").css("display", spanDisplay);
        $dvUserAgentPathElem.find(".dvOkButton").css("display", inputDisplay);
      },

      okClick: function (event) {        
        var $dvUserAgentPathElem = $(event.currentTarget).parents(".dvUserAgentPath");
        var $spUserAgentValueElem = $dvUserAgentPathElem.find(".spUserAgentValue");

        var $spPathValueElem = $dvUserAgentPathElem.find(".spPathValue");
        var $inPathElem = $dvUserAgentPathElem.find(".inPath");

        var userAgentFound = _.find(arUserAgents, { userAgent: $spUserAgentValueElem.html() })
        if (userAgentFound) {
          userAgentFound.path = $inPathElem.val();
          $spPathValueElem.html($inPathElem.val());
        }

        self.setEditMode(false);
      },

    });

    layoutContentCtrl.constructor();
    return layoutContentCtrl;
  };

  LayoutContentCtrl.isLoadTemplate = false;
  return LayoutContentCtrl;
});
