
define(["application", "CONST", "TreeGrid", "CommonTypes", "Utils"], function (application, CONST, TreeGrid, CommonTypes, Utils) {

  var selectItemTreeCtrl;

  return function () {

    var self;

    var treeGrid;

    var selectTemplateForm = new CommonTypes.BaseFormElement();
    _.extend(selectTemplateForm, {
      constructor: function () {
        self = this;        
      },

      dispose: function () {
        if (treeGrid) {
          treeGrid.dispose();
          treeGrid = null;
        }
      },

      show: function (data) {
        if (!data || !data.item)
          return;

        var $parentElem = $(".dvIncludePart");
        $parentElem.append("<div class='dvMainPanel' style='min-height: 100px;max-height: 350px;background-color: #EEEEEE;border: 2px solid #C2A9A9;overflow: auto;'></div>");
        var $dvMainPanel = $parentElem.find(".dvMainPanel");

        $dvMainPanel.append('<input type="text" class="form-control inName" id="Text1" value="" style="width: 400px;">');
        var $inName = $dvMainPanel.find(".inName");
        $inName.val("");
        $inName.focus();

        $dvMainPanel.append("<div class='dvTreePanel' style='height: 100%;'></div>");
        var $dvTreePanel = $parentElem.find(".dvTreePanel");
        treeGrid = new TreeGrid($dvTreePanel);
        treeGrid.setIsCheckBoxElem(false);
        treeGrid.populate(application.getTemplateItems());
      },

      clickOK: function (callback) {
        var dataCtrl = self.getDataCtrl();
        if (!dataCtrl || !treeGrid)
          return;

        var selTemplateId = '';
        if (treeGrid && treeGrid.selectedItem) {
          selTemplateId = treeGrid.selectedItem.id;
        }

        var curlang = Utils.getLanguageCurrent();
        var langCode = "";
        if (curlang)
          langCode = curlang.code;

        //$scope.itemName = $("#dvItemName").find(".inName").val();

        var action = "createItem";
        var data = {
          action: action,
          item: {
            name: 'test',// $scope.itemName,
            parentId: dataCtrl.item.id,
            templateId: selTemplateId
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
    selectTemplateForm.constructor();
    return selectTemplateForm;

  };
});