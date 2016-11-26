
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

        if (!treeGrid.selectedItem) {
          error.message = "You need to select the item!";
          return false;
        }

        return true;
      },

      clickOK: function (callback) {
        var selectedItem = treeGrid.selectedItem;

        if (callback)
          callback({ selectedItem: selectedItem });
      },

    });
    selectTreeItemForm.constructor();
    return selectTreeItemForm;

  };
});