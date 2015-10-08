define(["application", "CONST", "Utils", "CommonTypes"], function (application, CONST, Utils, CommonTypes) {

  return function ($scope) {
    var self;

    var createItemFormCtrl = new CommonTypes.BaseElement();
    _.extend(createItemFormCtrl, {
      constructor: function () {
        self = this;
        self.setBaseData({
          formId: "createItemForm",
          formPath: "/SiteEngine/Client/Views/forms/createItemForm/createItemForm.html",
        });

      },
      show: function (data) {
        self.setDataCtrl(data);
        var $inName = $("#dvItemName").find(".inName");
        $inName.val("");
        $inName.focus();
      },

      clickOK: function (callback) {
        var dataCtrl = self.getDataCtrl();
        if (!dataCtrl || !dataCtrl.selectedItem || !dataCtrl.selectedTemplate)
          return;

        var curlang = Utils.getLanguageCurrent();
        var langCode = "";
        if (curlang)
          langCode = curlang.code;

        $scope.itemName = $("#dvItemName").find(".inName").val();

        var action = "createItem";
        var data = {
          action: action,
          item: {
            name: $scope.itemName,
            parentId: dataCtrl.selectedItem.id,
            templateId: dataCtrl.selectedTemplate.id
          },
          lang: langCode
          //fields: $scope.selTemplate.fields
        };

        application.httpRequest(data, function (response) {
          if (!response.error) {
            if (response.data && response.data.item) {
              application.addItem(response.data.item);
            }
          }
          if (callback)
            callback();
        }, function (response, status, headers, config) {
          if (callback)
            callback();
        });

      },

    });
    createItemFormCtrl.constructor();
    return createItemFormCtrl;
  };
});