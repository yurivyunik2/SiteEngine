﻿define(["application", "CONST", "Utils", "CommonTypes"], function (application, CONST, Utils, CommonTypes) {

  return function (parentForm, $scope) {
    var self;
    var dataCtrl;

    var editContentFormObj = new CommonTypes.BaseFormElement();
    _.extend(editContentFormObj, {
      constructor: function () {
        try {
          self = this;

          self.setBaseData({
            formTitle: "Edit content",
            formPath: "/SiteEngine/Client/Views/panels/editContentForm/editContentForm.html",
          });

        } catch (ex) { }
      },

      isHeaderFormVisible: function () { return false; },
      isCancelButtonVisible: function () { return false; },
      isPaddingNone: function () { return true; },
      isCenterForm: function () { return false; },

      show: function (data) {
        if (!data || !data.editItem || !data.editItem.htmlElemTarget)
          return;
        dataCtrl = data;

        var htmlElemTarget = data.editItem.htmlElemTarget;
        var $editCtrl = parentForm.get$el();
        var $textArea = $editCtrl.find("textarea");
        var content = $(htmlElemTarget).html().trim();
        $textArea.val(content);

        var paddingWidth = 30;
        var paddingHeight = 20;

        $editCtrl.css("width", (htmlElemTarget.offsetWidth + paddingWidth) + 'px');
        $textArea.css("height", (htmlElemTarget.offsetHeight + paddingHeight) + 'px');

        var style = self.getStyle(htmlElemTarget);
        $textArea.css("font-size", style.getPropertyValue("font-size"));
        $textArea.css("font-weight", style.getPropertyValue("font-weight"));
        if (style.getPropertyValue("color") === 'rgb(255, 255, 255)') {
          $textArea.css("color", "black");
        } else
          $textArea.css("color", style.getPropertyValue("color"));
      },

      getStyle: function (elem) {
        return window.getComputedStyle ? getComputedStyle(elem, "") : elem.currentStyle;
      },

      editItem: function () {
        if (!parentForm || !dataCtrl)
          return;

        var editItem = dataCtrl.editItem;
        if (editItem && editItem.bindObj && editItem.bindField) {
          if ($scope[editItem.bindObj]) {
            var item = $scope[editItem.bindObj];
            if (item[editItem.bindField] && item.fields && editItem.bindField) {
              var lang = Utils.getLanguageCurrent();
              var field = _.findWhere(item.fields, { name: editItem.bindField, lang: lang.code, isPublish: 1 });
              if (field) {
                field.value = parentForm.get$el().find("textarea").val();
                $scope[editItem.bindObj][editItem.bindField] = field.value;
                if (dataCtrl.editItem.htmlElemTarget) {
                  $(dataCtrl.editItem.htmlElemTarget).html(field.value);
                }
              }
            }
          }
        }
      },

      clickOK: function (callback) {
        self.editItem();

        if (callback) {
          callback(dataCtrl);
        }
      },
    });
    editContentFormObj.constructor();
    return editContentFormObj;
  };


});