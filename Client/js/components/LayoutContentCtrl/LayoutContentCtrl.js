
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
  var $editElemUserAgent;

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
        elemAdded.mouseover(function(event) {
          //elemAdded.addClass("selected");
          self.selectUserAgent(event.currentTarget, true);
        });
        elemAdded.mouseout(function() {
          //elemAdded.removeClass("selected");
          self.selectUserAgent(event.currentTarget, false);
        });
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
        self.setEditMode($(event.currentTarget).parents(".dvUserAgentPath"), true);
      },

      selectUserAgent: function (elemUserAgent, isSelect) {
        if (!elemUserAgent)
          return;

        var $elemUserAgent = $(elemUserAgent);
        if (isSelect) {
          $elemUserAgent.addClass("selected");
        } else if (!$editElemUserAgent || $elemUserAgent[0] !== $editElemUserAgent[0]) {
          $elemUserAgent.removeClass("selected");
        }
      },
      setEditMode: function (elemUserAgent, isEdit) {
        if (!elemUserAgent)
          return;
        
        //var $dvUserAgentPathElem = $(elemUserAgent).parents(".dvUserAgentPath");
        var $elemUserAgent = $(elemUserAgent);
        //var userAgent = $dvUserAgentPathElem.attr("data-userAgent");
        //if (!userAgent)
        //  return;

        if ($editElemUserAgent && isEdit) {
          var $el = $editElemUserAgent;
          $editElemUserAgent = null;
          self.setEditMode($el, false);
        }

        $editElemUserAgent = $elemUserAgent;
        
        var spanDisplay;
        var inputDisplay;
        if (isEdit) {
          spanDisplay = "none";
          inputDisplay = "block";
          $elemUserAgent.addClass("selected");
        } else {
          spanDisplay = "inline-block";
          inputDisplay = "none";
          $elemUserAgent.removeClass("selected");
        }

        var $spUserAgentValueElem = $elemUserAgent.find(".spUserAgentValue");
        var $inUserAgentElem = $elemUserAgent.find(".inUserAgent");
        $inUserAgentElem.val($spUserAgentValueElem.html());
        //$spUserAgentValueElem.css("display", spanDisplay);
        //$inUserAgentElem.css("display", inputDisplay);

        var $spPathValueElem = $elemUserAgent.find(".spPathValue");
        var $inPathElem = $elemUserAgent.find(".inPath");
        $inPathElem.val($spPathValueElem.html());
        $spPathValueElem.css("display", spanDisplay);
        $inPathElem.css("display", inputDisplay);

        $elemUserAgent.find(".dvIcon").css("display", spanDisplay);
        $elemUserAgent.find(".dvOkButton").css("display", inputDisplay);
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

        self.setEditMode($dvUserAgentPathElem, false);
      },

    });

    layoutContentCtrl.constructor();
    return layoutContentCtrl;
  };

  LayoutContentCtrl.isLoadTemplate = false;
  return LayoutContentCtrl;
});
