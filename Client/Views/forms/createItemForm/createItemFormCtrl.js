define(["application", "CONST"], function (application, CONST) {

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

        var curlang = application.getLanguageCurrent();
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
        //var data = {
        //  method: 'POST',
        //  url: $scope.server,
        //  headers: {
        //    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        //  },
        //  //data: "action=" + action + "&name=template1&fields=[1,2,3]&parent=5"
        //  data: JSON.stringify(data)
        //};

        application.httpRequest(data, function (response) {
          $scope.isShowModalForm = false;
          if (response.isOK) {
            if (response.data && response.data.item) {
              //application.getEngineTree().refresh(true);
              var item = response.data.item;
              var parentObj = { id: item.parentId };
              var newItem = { id: item.id, name: item.name, templateId: item.templateId };
              var engineTree = application.getEngineTree();
              var treeGrid = engineTree.getTreeGrid();
              treeGrid.addChildNode(parentObj, newItem);
            }
          }
        }, function (response, status, headers, config) {
        });

      },

    };
  };
});