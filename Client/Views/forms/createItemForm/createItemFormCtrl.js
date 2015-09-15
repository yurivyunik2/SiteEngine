define(["application", "CONST", "Utils"], function (application, CONST, Utils) {

  return function ($scope) {
    return {
      show: function () {
        var $inName = $("#dvItemName").find(".inName");
        $inName.val("");
        $inName.focus();
      },

      clickOK: function (dataRequest) {
        if (!dataRequest || !dataRequest.selectedItem || !dataRequest.selectedTemplate)
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
            parentId: dataRequest.selectedItem.id,
            templateId: dataRequest.selectedTemplate.id
          },
          lang: langCode
          //fields: $scope.selTemplate.fields
        };

        application.httpRequest(data, function (response) {
          $scope.isShowModalForm = false;
          if (response.isOK) {
            if (response.data && response.data.item) {              
              application.addItem(response.data.item);
            }
          }
        }, function (response, status, headers, config) {
        });

      },

    };
  };
});