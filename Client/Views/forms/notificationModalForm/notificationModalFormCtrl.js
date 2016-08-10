
define(["CommonTypes", "Utils"], function (CommonTypes, Utils) {

  return function () {

    var self;

    var notificationModalFormCtrl = new CommonTypes.BaseFormElement();
    _.extend(notificationModalFormCtrl, {
      constructor: function() {
        self = this;
        self.setBaseData({
          formId: "notificationModalForm",
          formTitle: "Warning",
          formPath: "/SiteEngine/Client/Views/forms/notificationModalForm/notificationModalForm.html",
        });
      },

      show: function (data) {
        if (!data || Utils.isValueNull(data.message))
          return;

        var $dvMessageElem = self.get$el().find(".dvMessage");
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