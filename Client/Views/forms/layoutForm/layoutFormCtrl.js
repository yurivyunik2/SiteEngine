require.config({
  paths: {
    layoutRenderingCtrl: "js/components/LayoutRenderingCtrl/LayoutRenderingCtrl",
  },
});


define(["application", "Utils", "CONST", "layoutRenderingCtrl", "CommonTypes"], function (application, Utils, CONST, LayoutRenderingCtrl, CommonTypes) {

  return function ($parentElem, $scope) {
    var self;
    var layoutRenderingCtrl;

    var layoutForm = new CommonTypes.BaseFormElement();
    _.extend(layoutForm, {
      constructor: function () {
        self = this;

        self.setBaseData({
          formTitle: "Assign layout form"
        });
      },

      show: function (data) {
        if (!data || !data.item)
          return;

        var layoutField;
        var fieldsLang = Utils.getFieldsLangVersion(data.item);
        if (fieldsLang) {
          _.each(fieldsLang, function (field) {
            if (field.fieldId === CONST.RENDERINGS_FIELD_ID()) {
              layoutField = field;
            }
          });
        }
        
        layoutRenderingCtrl = new LayoutRenderingCtrl($parentElem, layoutField);
        layoutRenderingCtrl.populate(layoutField ? layoutField.value : "");
      },

      clickOK: function (callback) {
        if (!layoutRenderingCtrl)
          return;

        var newLayout = layoutRenderingCtrl.getValue();
        var dataCtrl = self.getDataCtrl();
        if (dataCtrl) {
          var fieldsLang = Utils.getFieldsLangVersion(dataCtrl.item);
          if (dataCtrl.item && fieldsLang) {
            _.each(fieldsLang, function (field) {
              if (field.fieldId === CONST.RENDERINGS_FIELD_ID()) {
                field.value = newLayout;
              }
            });
          }

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
    layoutForm.constructor();
    return layoutForm;

  };
});