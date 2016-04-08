require.config({
  paths: {
    selectItemTreeCtrl: "js/components/selectTemplateForm/selectTemplateForm",
  },
});


define(["application", "CONST", "selectItemTreeCtrl", "CommonTypes"], function (application, CONST, SelectItemTreeCtrl, CommonTypes) {

  var selectItemTreeCtrl;

  return function () {

    var self;

    var selectTemplateForm = new CommonTypes.BaseFormElement();
    _.extend(selectTemplateForm, {
      constructor: function () {
        self = this;
      },

      show: function (data) {
        if (!data || !data.item)
          return;

        var insertOptionsField;
        if (data.item.fields) {
          _.each(data.item.fields, function (field) {
            if (field.fieldId === CONST.INSERT_OPTIONS_FIELD_ID()) {
              insertOptionsField = field;
            }
          });
        }

        var parentElem = $(".dvIncludePart");
        if (!selectItemTreeCtrl) {
          selectItemTreeCtrl = new SelectItemTreeCtrl(parentElem, insertOptionsField);
        }
        //actualComponents[field.id] = selectItemTreeCtrl;
        selectItemTreeCtrl.render();
      },

      clickOK: function (callback) {
        if (!selectItemTreeCtrl)
          return;

        var selectedItems = selectItemTreeCtrl.getValue();
        var insertOptions = "";
        _.each(selectedItems, function (item) {
          insertOptions += item.id + "|";
        });

        var dataCtrl = self.getDataCtrl();
        if (dataCtrl) {
          if (dataCtrl.item && dataCtrl.item.fields) {
            _.each(dataCtrl.item.fields, function (field) {
              if (field.id === CONST.INSERT_OPTIONS_FIELD_ID()) {
                field.value = insertOptions;
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
    selectTemplateForm.constructor();
    return selectTemplateForm;

  };
});