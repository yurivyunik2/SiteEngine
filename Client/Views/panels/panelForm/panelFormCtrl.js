
define(["application", "CONST"], function (application, CONST) {

  var panelCommonIndex = 0;

  return function ($scope, panelType) {

    var self;
    var idPanel;
    var panelIndex;

    var isCorrectPosition = false;
    var initWidth;

    var panelFormContainerSelector = ".dvPanelFormContainer";

    var panelFormCtrl = {

      panelType: null,

      constructor: function () {
        self = this;
        self.panelType = panelType;
        if (self.panelType.ctrl)
          self.panelType.ctrl.panelForm = self;
        
        panelCommonIndex++;
        panelIndex = panelCommonIndex;

        idPanel = "panelForm" + panelIndex;

        application.addUIComponent("panelFormCtrl" + Date.now(), self);
      },

      get$el: function () {
        return $("#" + idPanel);
      },

      addPanelToPage: function () {
        var $panelFormTemplate = $("#panelFormTemplate");
        if ($panelFormTemplate) {
          var $panelElem = self.get$el();
          if ($panelElem.length === 0) {
            var $html = $($panelFormTemplate.html());
            $html[0].id = idPanel;

            var $dvIncludePartElem = $html.find(".dvIncludePart");
            if (self.panelType && self.panelType.path) {
              $dvIncludePartElem.load(self.panelType.path, function () {
                //$("body").append($html[0].outerHTML);
                var $parentElem = $(CONST.VIEW_GLOBAL_SELECTOR());
                $parentElem.append($html[0].outerHTML);

                $panelElem = self.get$el();
                $panelElem.draggable();
                $panelElem.mousedown(self.mousedown);

                $panelElem.find(".imgClose").click(self.hide);

                self.showPanel();
              });
            }
          }
        }
      },

      intervalUI: function () {
        var $panelElem = $("#" + idPanel);
        if (isCorrectPosition && $panelElem.length > 0 && (initWidth < $panelElem.width() || panelIndex > 1)) {
          isCorrectPosition = false;            
          var top = window.innerHeight / 2 - $panelElem.height() / 2;
          var left = window.innerWidth / 2 - $panelElem.width() / 2;
          $panelElem.css({ top: top, left: left });
        }
      },

      show: function () {
        var $panelElem = self.get$el();
        if ($panelElem.length === 0) {
          self.addPanelToPage();
        } else {
          self.showPanel();
        }
      },
      
      showPanel: function () {
        var $panelElem = self.get$el();
        if ($panelElem.length > 0) {
          var formTitle = self.panelType.ctrl.getFormTitle();
          var spTitle = self.get$el().find(".dvTitle span");
          spTitle.html(formTitle ? formTitle : "");

          if (self.panelType && self.panelType.ctrl && self.panelType.ctrl.show)
            self.panelType.ctrl.show();

          $panelElem.show();

          initWidth = $panelElem.width();
          isCorrectPosition = true;          
        }
      },

      hide: function () {
        var $panelElem = self.get$el();
        if ($panelElem.length > 0) {
          $panelElem[0].parentNode.removeChild($panelElem[0]);
          //$panelElem.hide();
        }        
      },
      
      mousedown: function () {
        $(panelFormContainerSelector).css("z-index", "0");
        self.get$el().css("z-index", "1");
      },

    };

    panelFormCtrl.constructor();
    return panelFormCtrl;
  };

});