define(["notification"], function (Notification) {
  function Utils() {
    var self;

    var isCorrectHeightOnce = false;
    var isWindowResized = false;

    var utilsObj = {
      constructor: function () {
        self = this;

        $(window).resize(self.windowResized);
      },

      intervalUI: function() {
        if (!isCorrectHeightOnce || isWindowResized) {
          isWindowResized = false;
          self.correctHeightWindow();
        }
      },

      setLoadingApplication: function (isLoad) {
        var $loadingAppElem = $("#loadingApp");
        var $viewAppElem = $("#viewApp");
        if (isLoad) {
          $loadingAppElem.css("display", "block");
          $viewAppElem.css("display", "none");
        } else {
          $loadingAppElem.css("display", "none");
          $viewAppElem.css("display", "block");
        }
      },

      isValueNull: function (value) {
        if (!value || value === "" || value === "null")
          return true;
        else
          return false;
      },

      showNotification: function (data, response) {
        if (!data || !data.isNotified)
          return;
        var actionName;
        if (data.actionName)
          actionName = data.actionName;
        else if (data.action)
          actionName = data.action;
        if (actionName) {
          if (response && response.isOK)
            Notification.show(Notification.INFO(), actionName + " was successfully!");
          else {
            if (response)
              Notification.show(Notification.ERROR(), actionName + " was finished with error: " + response);
            else
              Notification.show(Notification.ERROR(), actionName + " was finished with error!");
          }
        }
      },

      windowResized: function (event) {
        isWindowResized = true;
      },

      $tabPanelAreaElem: null,
      $dvMainContent: null,
      correctHeightWindow: function () {
        if (!isCorrectHeightOnce || !self.$tabPanelAreaElem || self.$tabPanelAreaElem.length === 0)
          self.$tabPanelAreaElem = $("#tabPanelArea");
        var isAvailable = self.$tabPanelAreaElem.length > 0 && self.$tabPanelAreaElem[0].clientHeight > 0;
        if (isAvailable) {
          isCorrectHeightOnce = true;
          if (!self.$dvMainContent)
            self.$dvMainContent = $("#dvMainContent");

          var heightCommon = self.$tabPanelAreaElem[0].offsetHeight;
          var heightRest = window.innerHeight - heightCommon - 2;
          self.$dvMainContent.find(".dvTable").height(heightRest);
          self.$dvMainContent.find(".dvInfoPanel").height(heightRest);
        }
      },

    };
    utilsObj.constructor();
    return utilsObj;
  };
  return (new Utils());
});