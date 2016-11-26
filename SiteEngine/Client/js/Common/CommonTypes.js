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
        var formTitle;
        var $elem;
        var dataCtrl;

        return {
          setBaseData: function (data) {
            if (!data)
              return;
            formId = data.formId;
            formPath = data.formPath;
            formTitle = data.formTitle;
          },

          getFormId: function () { return formId; },
          getFormPath: function () { return formPath; },
          getFormTitle: function () { return formTitle; },

          get$el: function () {
            //if (!$elem || $elem.length === 0)
            $elem = $("#" + formId);
            return ($elem && $elem.length > 0 ? $elem : null);
          },

          setDataCtrl: function (_dataCtrl) { dataCtrl = _dataCtrl; },
          getDataCtrl: function () { return dataCtrl; },

          isHeaderFormVisible: function () { return true; },
          isButtonsFormVisible: function () { return true; },
          isCancelButtonVisible: function () { return true; },

          isPaddingNone: function () { return false; },
          isCenterForm: function () { return true; },
          isDraggableForm: function () { return false; },
        
          clickOk: function() {},

        };
      },

      BaseCtrl: function (field, parentElem, $templateElem) {
        var $el;
        var isEnabled = true;

        return {

          createElement: function (callback) {
            if (!$el && parentElem && $templateElem && $templateElem.length > 0) {
              var $newElem = $templateElem.clone();
              $newElem.css("display", "block");
              if (field) {
                $newElem[0].id = field.id;
              }              

              var html = $newElem[0].outerHTML;
              if (parentElem) {
                parentElem.append(html);
                $el = parentElem.children().last();

                if (callback)
                  callback();
              }
            }
          },

          get$el: function () {
            return $el;
          },

          dispose: function () { },

          isEnabled: function (_isEnabled) {
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

          //render: function () {
          //  if (field) {
          //    this.populate(field.value);
          //  }            
          //},

          getValue: function () { },

          populate: function () { },
        };

      },

    };
  };
  return (new CommonTypes());
});