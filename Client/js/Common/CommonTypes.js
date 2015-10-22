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
      
      BaseFormElement: function () {
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

      BaseCtrl: function (field) {
        var isEnabled = true;

        return {

          get$el: function () {
            if (this.get$el)
              return this.get$el();
            else
              return null;
          },

          dispose: function () { },

          isEnabled: function (_isEnabled) {
            var $el = this.get$el();
            if (!$el)
              return;

            isEnabled = _isEnabled;

            var arElems = $el.find("*");
            if (!isEnabled) {
              arElems.attr("disabled", "disabled");
              arElems.off("click").off("mousedown").off("dblclick");
              $el.addClass("dvDisabled");
            } else {
              arElems.removeAttr("disabled");
              arElems.on("click").on("mousedown").on("dblclick");
              $el.removeClass("dvDisabled");
            }
          },
          getIsEnabled: function () { return isEnabled; },

          createElement: function () { },

          render: function () {
            var $el = this.get$el();
            if (!$el) {
              this.createElement();
            }
            if(field)
              this.populate(field.value);
          },

          getValue: function () { },

          populate: function () { },
        };

      },

    };
  };
  return (new CommonTypes());
});