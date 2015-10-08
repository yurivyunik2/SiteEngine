define([], function() {
  function CommonTypes() {
    return {
      
      Language: function (name, code, regionCode) {
        return {
          name: name,
          code: code,
          regionCode: regionCode,
        };
      },
      
      BaseElement: function () {
        var formId;
        var formPath;
        var formSelector;
        var $elem;
        var dataCtrl;
        var isButtonsFormHide;

        return {
          setBaseData: function (data) {
            if (!data)
              return;
            formId = data.formId;
            formPath = data.formPath;
            formSelector = data.formSelector;
            isButtonsFormHide = data.isButtonsFormHide;
          },

          getFormId: function () { return formId; },
          getFormPath: function () { return formPath; },

          get$Elem: function () {
            if (!$elem || $elem.length === 0)
              $elem = $(formSelector);
            return $elem;
          },

          setDataCtrl: function (_dataCtrl) { dataCtrl = _dataCtrl; },
          getDataCtrl: function () { return dataCtrl; },

          isButtonsFormHide: function () { return isButtonsFormHide; },

        };
      },

  };
  };
  return (new CommonTypes());
});