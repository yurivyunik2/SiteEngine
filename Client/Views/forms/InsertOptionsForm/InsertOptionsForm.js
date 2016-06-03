require.config({
  paths: {
    selectItemTreeCtrl: "js/components/SelectItemTreeCtrl/SelectItemTreeCtrl",
  },
});


define(["application", "Utils", "CONST", "selectItemTreeCtrl", "CommonTypes"], function (application, Utils, CONST, SelectItemTreeCtrl, CommonTypes) {

  return function($parentElem, $scope) {
    var self;
    var selectItemTreeCtrl;

    var width = 550;
    var height = 250;
    
    var insertOptionsForm = new CommonTypes.BaseFormElement();
    _.extend(insertOptionsForm, {
      constructor: function () {
        self = this;

        self.setBaseData({
          formTitle: "Assign templates form"
        });
      },

      show: function (data) {
        if (!data || !data.item)
          return;

        var insertOptionsField;
        var fieldsLang = Utils.getFieldsLangVersion(data.item);
        if (fieldsLang) {
          _.each(fieldsLang, function (field) {
            if (field.fieldId === CONST.INSERT_OPTIONS_FIELD_ID()) {
              insertOptionsField = field;
            }
          });
        }
        
        var html = "<div style='width: " + width + "px; height: " + height + "px;'></div>";
        $parentElem.append(html);
        var $contentElem = $parentElem.children().last();
        selectItemTreeCtrl = new SelectItemTreeCtrl($contentElem, insertOptionsField);
        selectItemTreeCtrl.populate();
        var $el = selectItemTreeCtrl.get$el();
        $el.height("100%");
      },

      clickOK: function (callback) {
        if (!selectItemTreeCtrl)
          return;

        var insertOptions = selectItemTreeCtrl.getValue();
        var dataCtrl = self.getDataCtrl();
        if (dataCtrl && dataCtrl.item) {
          var fieldsLang = Utils.getFieldsLangVersion(dataCtrl.item);
          _.each(fieldsLang, function (field) {
            if (field.fieldId === CONST.INSERT_OPTIONS_FIELD_ID()) {
              field.value = insertOptions;
            }
          });

          var actionCtrl = application.getActionCtrl();
          if (actionCtrl) {
            var data = {
              actionType: "saveItem",
              item: dataCtrl.item,
              callback: callback,
            };
            actionCtrl.process(data);
          }
        }
      },

    });
    insertOptionsForm.constructor();
    return insertOptionsForm;

  };
});