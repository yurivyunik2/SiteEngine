
var Utils = function (CONST, Notification) {
  var self;

  var _;
  var querystring;
  var isCorrectHeightOnce = false;
  var isWindowResized = false;

  var utilsObj = {

    keyDownEventLast: null,

    constructor: function () {
      self = this;

      if (typeof window != "undefined") {
        $(window).resize(self.windowResize);
        $(window).keydown(self.windowKeyDown);
        _ = window._;
      }

      if (typeof exports != "undefined") {
        _ = require('underscore');
        querystring = require('querystring');
      }

    },

    intervalUI: function () {
      if (!isCorrectHeightOnce || isWindowResized) {
        isWindowResized = false;
        self.correctHeightWindow();
      }
    },

    // hadling of the POST request
    processPost: function (request, response, callback) {
      var queryData = "";
      if (typeof callback !== 'function') return null;

      if (request.method == 'POST') {
        request.on('data', function (data) {
          queryData += data;
          //if (queryData.length > 1e6) {
          //  queryData = "";
          //  response.writeHead(413, { 'Content-Type': 'text/plain' }).end();
          //  request.connection.destroy();
          //}
        });
        request.on('end', function () {
          //var test = "{\"action\":\"createItem\"}";          
          request.post = querystring.parse(queryData);
          var postKey = _.keys(request.post);
          var dataRequest = 0;
          try {
            dataRequest = JSON.parse(postKey[0]);
          } catch (ex) {
          }
          callback();
        });

      } else {
        response.writeHead(405, { 'Content-Type': 'text/plain' });
        response.end();
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
      var $wrapperContent = $("#wrapperContent");
      if (isLoad) {
        $loadingAppElem.css("display", "block");
        $viewAppElem.css("display", "none");
        $wrapperContent.css("opacity", 0);
      } else {
        $loadingAppElem.css("display", "none");
        $viewAppElem.css("display", "block");
        $wrapperContent.css("opacity", 1);
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
          if (isClone)
            allItems.push(_.clone(item));
          else
            allItems.push(item);

          self.findChildItems(allItems, item, isClone);
        });
      }
    },

    setChildItems: function (allItems, data) {
      if (!allItems || !data || !data.parentItem)
        return;

      var parentItem = data.parentItem;
      var self = this;
      for (var i = 0; i < allItems.length; i++) {
        var item = allItems[i];
        if (item.parent === parentItem.id) {
          if (!parentItem.childs)
            parentItem.childs = [];

          if (data.countChilds || data.countChilds === 0)
            data.countChilds++;
          parentItem.childs.push(item);

          data.parentItem = item;
          self.setChildItems(allItems, data);
        }
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
      $template.load(pathTemplate, function () {
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

    cancelEvent: function (event) {
      event = event || window.event;
      event.preventDefault();
      event.stopPropagation();
    },

  };
  utilsObj.constructor();
  return utilsObj;
};

if (typeof exports != "undefined") {
  exports.Utils = Utils;
}

if (typeof define != "undefined") {
  define(["CONST", "notification"], function (CONST, Notification) {
    return Utils(CONST, Notification);
  });
}
