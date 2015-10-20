
define(["CommonTypes", "Utils"], function (CommonTypes, Utils) {

  return function () {

    var self;

    var notificationModalFormCtrl = new CommonTypes.BaseElement();
    _.extend(notificationModalFormCtrl, {
      constructor: function() {
        self = this;
        self.setBaseData({
          formId: "notificationModalForm",
          formPath: "/SiteEngine/Client/Views/forms/notificationModalForm/notificationModalForm.html",
          formSelector: "#notificationModalForm",
        });
      },

      show: function (data) {
        if (!data || Utils.isValueNull(data.message))
          return;

        var $dvMessageElem = self.get$Elem().find(".dvMessage");
        $dvMessageElem.html(data.message);
      },

      clickOK: function(callback) {

        var dataCtrl = self.getDataCtrl();
        if (dataCtrl && dataCtrl.callback) {
          dataCtrl.callback(dataCtrl.callbackData);
        }
        if (callback)
          callback();
      },

    });
    notificationModalFormCtrl.constructor();
    return notificationModalFormCtrl;
  };

});