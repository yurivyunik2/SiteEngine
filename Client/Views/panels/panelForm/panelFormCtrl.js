require.config({
  paths: {
    userManagerFormCtrl: "/SiteEngine/Client/Views/forms/userManagerForm/userManagerFormCtrl",
    editContentFormCtrl: "/SiteEngine/Client/Views/panels/editContentForm/editContentFormCtrl",
  },
});

define(["application", "CONST", "userManagerFormCtrl", "editContentFormCtrl"], function (application, CONST, UserManagerFormCtrl, EditContentFormCtrl) {

  var panelCommonIndex = 0;

  var PanelType = {
    USER_MANAGER: {
      path: "/SiteEngine/Client/Views/forms/userManagerForm/userManagerForm.html",
      getControl: function (parentForm, $scope) { return new UserManagerFormCtrl(parentForm, $scope); },
    },
    EDIT_CONTENT: {
      path: "/SiteEngine/Client/Views/panels/editContentForm/editContentForm.html",
      getControl: function (parentForm, $scope) { return new EditContentFormCtrl(parentForm, $scope); }
    }
  };

  var PanelFormCtrl = function ($scope, panelType) {

    var self;
    var $el;
    var idPanel;
    var panelIndex;
    var currentCtrl;
    var dataCtrl;

    var isCorrectPosition = false;
    var initWidth;

    var panelFormCtrl = {
      panelType: null,

      constructor: function () {
        self = this;

        self.panelType = panelType;
        currentCtrl = self.panelType.getControl(self, $scope);
        
        panelCommonIndex++;
        panelIndex = panelCommonIndex;

        idPanel = "panelForm" + panelIndex;

        application.addUIComponent(idPanel, self);
      },

      dispose: function () {
        application.removeUIComponent(idPanel, self);

        var $panelElem = self.get$el();
        if ($panelElem.length > 0) {
          $panelElem[0].parentNode.removeChild($panelElem[0]);
          //$panelElem.hide();
        }
      },

      intervalUI: function () {
        if (currentCtrl.isCenterForm()) {
          var $panelElem = $("#" + idPanel);
          if (isCorrectPosition && $panelElem.length > 0 && (initWidth < $panelElem.width() || panelIndex > 1)) {
            isCorrectPosition = false;
            var top = window.innerHeight / 2 - $panelElem.height() / 2;
            var left = window.innerWidth / 2 - $panelElem.width() / 2;
            $panelElem.css({ top: top, left: left });
          }
        }
      },

      get$el: function () {
        return $("#" + idPanel);
      },

      PANEL_TYPE: function () { return PanelType; },

      addPanelToPage: function (data) {
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
                //$panelElem.draggable();

                $panelElem.find(".imgClose").click(self.hide);
                $panelElem.find(".btnOK").click(self.clickOk);

                self.afterShow(data);
              });
            }
          }
        }
      },

      show: function (data) {
        dataCtrl = data;
        var $panelElem = self.get$el();
        if ($panelElem.length === 0) {
          self.addPanelToPage(data);
        } else {
          self.afterShow(data);
        }
      },

      afterShow: function (data) {
        var $panelElem = self.get$el();

        if (data) {
          if (data.top) {
            $panelElem.css("top", data.top + "px");
          }
          if (data.left) {
            $panelElem.css("left", data.left + "px");
          }
        }

        self.showPanel(data);

        if (!currentCtrl.isHeaderFormVisible()) {
          $panelElem.find(".dvHeaderForm").hide();
        }
        if (!currentCtrl.isButtonsFormVisible()) {
          $panelElem.find(".dvButtonsForm").hide();
        }
        if (!currentCtrl.isCancelButtonVisible()) {
          $panelElem.find(".btnCancel").hide();
        }
        if (currentCtrl.isPaddingNone()) {
          $panelElem.find(".dvIncludePart").css("padding", "0");
        }
        
      },

      showPanel: function (data) {
        var $panelElem = self.get$el();
        if ($panelElem.length > 0) {
          var formTitle = currentCtrl.getFormTitle();
          var spTitle = self.get$el().find(".dvTitle span");
          spTitle.html(formTitle ? formTitle : "");

          if (self.panelType && currentCtrl.show)
            currentCtrl.show(data);

          $panelElem.show();

          initWidth = $panelElem.width();
          isCorrectPosition = true;          
        }
      },

      // NEXT-click, sending request to the server
      clickOk: function ($event) {
        if (currentCtrl) {
          if (currentCtrl.isValidate) {
            var error = { message: "" };
            var isValidate = currentCtrl.isValidate(error);
            if (!isValidate) {
              //if (error.message && error.message !== "")
              //  $scope.errorMessage = error.message;
              //else
              //  $scope.errorMessage = "Unknown error";
              //$scope.isError = true;
              //try {
              //  $scope.$apply();
              //} catch (ex) { }
              return;
            }
          }

          currentCtrl.clickOK(self.clickOkCallback);
        } else {
          self.curType = null;
          self.show();
        }
      },

      clickOkCallback: function (dataResponse) {
        if (dataCtrl && dataCtrl.callback)
          dataCtrl.callback(dataResponse);
        self.hide();
      },

      hide: function () {
        self.dispose();
      },
      
    };

    panelFormCtrl.constructor();
    return panelFormCtrl;
  };

  PanelFormCtrl.PANEL_TYPE = function () { return PanelType; };

  return PanelFormCtrl;

});