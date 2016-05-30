require.config({
  paths: {
    selectItemTreeCtrl: "js/components/SelectItemTreeCtrl/SelectItemTreeCtrl",
  },
});


define(["application", "CONST", "selectItemTreeCtrl", "CommonTypes"], function (application, CONST, SelectItemTreeCtrl, CommonTypes) {

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
        if (data.item.fields) {
          _.each(data.item.fields, function (field) {
            if (field.fieldId === CONST.INSERT_OPTIONS_FIELD_ID()) {
              insertOptionsField = field;
            }
          });
        }

        if (!selectItemTreeCtrl) {
          var html = "<div style='width: " + width + "px; height: " + height + "px;'></div>";
          $parentElem.append(html);
          var $contentElem = $parentElem.children().last();
          selectItemTreeCtrl = new SelectItemTreeCtrl($contentElem, insertOptionsField);
          var $el = selectItemTreeCtrl.get$el();
          $el.height("100%");
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
    insertOptionsForm.constructor();
    return insertOptionsForm;

  };
});