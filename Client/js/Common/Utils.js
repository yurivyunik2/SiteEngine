define(["CONST", "notification"], function (CONST, Notification) {
  function Utils() {
    var self;

    var isCorrectHeightOnce = false;
    var isWindowResized = false;

    var utilsObj = {

      keyDownEventLast: null,

      constructor: function () {
        self = this;

        $(window).resize(self.windowResize);

        $(window).keydown(self.windowKeyDown);
      },

      intervalUI: function() {
        if (!isCorrectHeightOnce || isWindowResized) {
          isWindowResized = false;
          self.correctHeightWindow();
        }
      },

      escapeSpecialChars: function (str) {
        return str
          .replace(/[\\]/g, '\\\\')
          .replace(/[\"]/g, '\\\"')
          .replace(/[\/]/g, '\\/')
          .replace(/[\b]/g, '\\b')
          .replace(/[\f]/g, '\\f')
          .replace(/[\n]/g, '\\n')
          .replace(/[\r]/g, '\\r')
          .replace(/[\t]/g, '\\t');
      },

      windowResize: function (event) {
        isWindowResized = true;
      },

      windowKeyDown: function (event) {
        self.keyDownEventLast = event;
        if (self.isFunctionalKey(event)) {
          event.preventDefault();
          return false;
        }
        return true;
      },
      isFunctionalKey: function (event) {
        return CONST.IS_CTRL_S_KEY(event);
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

      showProcessBar: function (isShow) {
        var $progressBarElem = $("#progressBar");
        //var $viewAppElem = $("#viewApp");
        if (isShow) {
          $progressBarElem.css("display", "inline-block");
          //$viewAppElem.css("display", "none");
        } else {
          $progressBarElem.css("display", "none");
          //$viewAppElem.css("display", "block");
        }
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
          if (response && !response.error)
            Notification.show(Notification.INFO(), actionName + " was successfully!");
          else {
            if (response)
              Notification.show(Notification.ERROR(), actionName + " was finished with error: " + response);
            else
              Notification.show(Notification.ERROR(), actionName + " was finished with error!");
          }
        }
      },

      findChildItems: function (allItems, parentItem, isClone) {
        if (!allItems || !parentItem)
          return;

        if (parentItem && parentItem.children) {
          _.each(parentItem.children, function (item) {
            if(isClone)
              allItems.push(_.clone(item));
            else
              allItems.push(item);

            self.findChildItems(allItems, item, isClone);
          });
        }
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

      getLanguageCurrent: function () {
        var curLanguage;
        var $selLanguageElem = $(CONST.LANGUAGE_SELECTOR());
        if ($selLanguageElem.length > 0) {
          var langCode = $selLanguageElem.val();
          curLanguage = _.findWhere(CONST.LANGUAGE_LIST(), { code: langCode });
        }
        if (!curLanguage)
          curLanguage = CONST.LANGUAGE_DEFAULT();
        return curLanguage;
      },

      getVersionCurrent: function () {
        var curVersion = 0;
        var $selVersionElem = $(CONST.VERSION_SELECTOR());
        if ($selVersionElem.length > 0) {
          curVersion = $selVersionElem.val();
        }
        return curVersion;
      },

      isValueNull: function (value) {
        if (!value || value === "" || value === "null")
          return true;
        else
          return false;
      },

      LoadTemplate: function (pathTemplate, callback) {
        var $template = $("<div></div>");
        $template.load(pathTemplate, function() {
          $(document.body).append($template.html());
          if (callback) {
            callback($template);
          }
          $dvLayoutFormElem = $template.find(".dvLayoutForm");
        });
      },

      clone: function (obj) {
        var newObj;
        if (!$.isFunction(obj))
          newObj = _.clone(obj);
        else
          newObj = obj;
        var arKeys = _.keys(newObj);
        _.each(arKeys, function (key) {
          newObj[key] = self.clone(newObj[key]);
        });
        return newObj;
      },



    };
    utilsObj.constructor();
    return utilsObj;
  };
  return (new Utils());
});