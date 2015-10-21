require.config({
  paths: {
    assignTemplateCtrl: "js/components/AssignTemplateCtrl/AssignTemplateCtrl",
  },
});


define(["application", "CONST", "assignTemplateCtrl", "CommonTypes"], function (application, CONST, AssignTemplateCtrl, CommonTypes) {

  var assignTemplateCtrl;

  return function () {

    var self;
    
    var insertOptionsForm = new CommonTypes.BaseElement();
    _.extend(insertOptionsForm, {
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
        if (!assignTemplateCtrl) {
          assignTemplateCtrl = new AssignTemplateCtrl(parentElem, insertOptionsField);
        }        
        //actualComponents[field.id] = assignTemplateCtrl;
        assignTemplateCtrl.render();
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
    insertOptionsForm.constructor();
    return insertOptionsForm;

  };
});