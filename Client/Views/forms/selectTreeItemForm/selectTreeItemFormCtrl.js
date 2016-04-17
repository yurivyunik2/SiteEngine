
define(["application", "CONST", "TreeGrid", "CommonTypes", "Utils", "notification"], function (application, CONST, TreeGrid, CommonTypes, Utils, Notification) {

  var selectItemTreeCtrl;

  return function () {

    var self;

    var treeGrid;

    var selectTreeItemForm = new CommonTypes.BaseFormElement();
    _.extend(selectTreeItemForm, {
      constructor: function () {
        self = this;
        self.setBaseData({
          formId: "selectTreeItemForm",
          formPath: "/SiteEngine/Client/Views/forms/selectTreeItemForm/selectTreeItemForm.html",
        });
      },

      dispose: function () {
        if (treeGrid) {
          treeGrid.dispose();
          treeGrid = null;
        }
      },

      show: function (data) {
        if (!data || !data.availableItems)
          return;

        self.setDataCtrl(data);

        var $el = $("#" + this.getFormId());

        $el.find(".lbTitle").html((data.title?data.title: ""));

        var $dvTreePanel = $el.find(".dvTreePanel");
        treeGrid = new TreeGrid($dvTreePanel);
        treeGrid.setIsCheckBoxElem(false);        
        treeGrid.populate(data.availableItems);
        var treeItems = treeGrid.getTreeItems();
        if (treeItems && treeItems.length > 0) {
          treeGrid.selectItem(treeItems[0]);
        }
      },

      isValidate: function (error) {
        if (!error)
          return true;

        var $el = $("#" + this.getFormId());

        //if (!treeGrid.selectedItem || !application.isTemplateItem(treeGrid.selectedItem)) {
        //  error.message = "Selected item isn't template!";
        //  return false;
        //}

        return true;
      },

      clickOK: function (callback) {
        var dataCtrl = self.getDataCtrl();
        if (!dataCtrl || !dataCtrl.selectedItem)
          return;

        var curlang = Utils.getLanguageCurrent();
        var langCode = "";
        if (curlang)
          langCode = curlang.code;

        var $el = $("#" + this.getFormId());

        var newItemName = $el.find(".inName").val();

        var action = "createItem";
        var data = {
          action: action,
          item: {
            name: newItemName,
            parentId: dataCtrl.selectedItem.id,
            templateId: treeGrid.selectedItem.id
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
    selectTreeItemForm.constructor();
    return selectTreeItemForm;

  };
});