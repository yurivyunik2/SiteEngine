require.config({
  paths: {
    selectItemTreeCtrl: "js/components/SelectItemTreeCtrl/SelectItemTreeCtrl",
  },
});


define(["application", "CONST", "selectItemTreeCtrl", "CommonTypes"], function (application, CONST, SelectItemTreeCtrl, CommonTypes) {

  var selectItemTreeCtrl;

  return function () {

    var self;
    
    var selectItemTreeForm = new CommonTypes.BaseFormElement();
    _.extend(selectItemTreeForm, {
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

        var insertOptions = "";
        _.each(selectedItems, function (item) {
          insertOptions += item.id + "|";
        });

        if (itemChange && itemChange.fields) {
          _.each(itemChange.fields, function (field) {
            if (field.id === CONST.INSERT_OPTIONS_FIELD_ID()) {
              field.value = insertOptions;
            }
          });
        }

        var actionCtrl = application.getActionCtrl();
        if (actionCtrl) {
          var data = {
            actionType: "saveItem",
            item: itemChange,
            callback: callback,
          };
          actionCtrl.process(data);
        }
      },
    });
    selectItemTreeForm.constructor();
    return selectItemTreeForm;

  };
});