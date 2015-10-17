
define(["CommonTypes", "Utils"], function (CommonTypes, Utils) {

  return function () {

    var self;

    var questionFormCtrl = new CommonTypes.BaseElement();
    _.extend(questionFormCtrl, {
      constructor: function() {
        self = this;
        self.setBaseData({
          formId: "questionForm",
          formPath: "/SiteEngine/Client/Views/forms/questionForm/questionForm.html",
          formSelector: "#questionForm",
        });
      },

      show: function (data) {
        if (!data || Utils.isValueNull(data.message))
          return;

        var $dvMessageElem = self.get$Elem().find(".dvMessage");
        $dvMessageElem.html(data.message);
      },

    });
    questionFormCtrl.constructor();
    return questionFormCtrl;
  };

});