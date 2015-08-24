define(["application", "TreeGrid", "CONST"], function (application, TreeGrid, CONST) {

  return function ($scope) {
    var self;

    var treeGridLayout;
    var treeGridSublayout;

    var formSelector = "#layoutForm";

    var itemChange;

    var layoutUI = {
      header: "Layout:",
      idBtn: "btnLayout",
      idTreeGrid: "treeLayout"
    };

    var subLayoutUI = {
      header: "Sublayout:",
      idBtn: "btnSubLayout",
      idTreeGrid: "treeSubLayout"
    };

    var rendering = {
      //layout: { name: "name", id: 1},
      layout: { },
      subLayouts: [
        //{ placeholder: "main", name: "sub1", id:2 },
        //{ placeholder: "main/content", name: "sub2", id: 3 },
      ]
    };

    var layoutFormCtrl = {

      constructor: function () {
        self = this;

        $scope.addSublayout = self.addSublayout;
      },

      show: function (data) {
        if (!data || !data.item)
          return;

        itemChange = data.item;

        var layoutChooseTemplate = _.template($("#layoutChoose").html());
        //layoutChooseTemplate

        // Layout 
        //$("#layoutChooseArea").prepend(layoutChooseTemplate(layoutUI));
        $("#layoutChooseArea").html(layoutChooseTemplate(layoutUI));

        // Sublayout
        //$("#subLayoutChooseArea").prepend(layoutChooseTemplate(subLayoutUI));
        $("#subLayoutChooseArea").html(layoutChooseTemplate(subLayoutUI));

        //
        $("#" + layoutUI.idBtn).click(self.btnChooseClick);
        $("#" + subLayoutUI.idBtn).click(self.btnChooseClick);


        $("#" + layoutUI.idTreeGrid).click(self.treeGridClick);
        $("#" + subLayoutUI.idTreeGrid).click(self.treeGridClick);

        self.populate(data);
      },

      btnChooseClick: function (event) {
        var $parent = $(event.target).parents(".dropdown");
        var $dvTreeGrid = $parent.find(".dvTreeGrid");
        var display;
        if ($dvTreeGrid.css("display") == "block")
          display = "none";
        else {
          display = "block";
        }
        $dvTreeGrid.css("display", display);
      },
      
      treeGridClick: function (event) {
        var $parentControl = $(event.target).parents(".dvControl");
        var $btn = $parentControl.find(".btn");

        var treeGrid;
        var $parentDvTreeGrid = $(event.target).parents(".dvTreeGrid");
        if ($parentDvTreeGrid.attr("id") == "treeLayout")
          treeGrid = treeGridLayout;
        else {
          treeGrid = treeGridSublayout;
        }

        if (treeGrid.selectedItem && (!treeGrid.selectedItem.children
          || treeGrid.selectedItem.children.length == 0)) {
          var selItem = treeGrid.selectedItem;
          $btn.find("#name").html(selItem.name);
          $btn.find("#name").attr("_id", selItem.id);

          // rendering.layout
          if (treeGrid === treeGridLayout && rendering) {
            rendering.layout = { name: selItem.name, id: selItem.id };
          }

          $parentDvTreeGrid.hide();
        }
      },

      populate: function () {
        var $formElem = $(formSelector);

        var $treeLayout = $formElem.find("#" + layoutUI.idTreeGrid);
        treeGridLayout = new TreeGrid($treeLayout);
        treeGridLayout.populate(application.getLayoutItems(true));
        
        var $treeSubLayout = $formElem.find("#" + subLayoutUI.idTreeGrid);
        treeGridSublayout = new TreeGrid($treeSubLayout);
        treeGridSublayout.populate(application.getLayoutItems(true));


        var renderingValue;
        if (itemChange.fields) {
          _.each(itemChange.fields, function (field) {
            if (field.id == CONST.RENDERINGS_FIELD_ID()) {
              renderingValue = field.value;
            }
          });
        }

        if (renderingValue) {
          var renderignObj = JSON.parse(renderingValue);
          if (renderignObj) {
            rendering = renderignObj;

            self.render();
          }
        }

        self.render();
      },
      
      addSublayout: function () {

        var $subLayoutBtn = $("#" + subLayoutUI.idBtn);
        var nameSub = $subLayoutBtn.find("#name").html();
        var idSub = $subLayoutBtn.find("#name").attr("_id");
        var $inputPlaceHolder = $(".inputPlaceHolder");
        var placeholder = $inputPlaceHolder.val();

        if (rendering && rendering.subLayouts && 
            idSub && nameSub && placeholder) {
          rendering.subLayouts.push({ placeholder: placeholder, id: idSub, name: nameSub });

          self.render();
        }
      },
      
      removeSubLayout: function (event) {
        var idSubLayout = $(event.target).parents(".dvSubLayoutItem").attr("id");
        if (rendering && rendering.subLayouts) {
          var foundItems = _.findWhere(rendering.subLayouts, { id: idSubLayout });
          rendering.subLayouts = _.without(rendering.subLayouts, foundItems);

          self.render();
        }
      },

      render: function () {
        var $layoutBtn = $("#" + layoutUI.idBtn);
        $layoutBtn.find("#name").html("");

        var $subLayoutsList = $("#subLayoutsList");
        $subLayoutsList.html("");

        if (rendering) {
          if (rendering.layout) {
            $layoutBtn.find("#name").html(rendering.layout.name);
          }
          if (rendering.subLayouts) {
            var subLayoutItemTemplate = _.template($("#subLayoutItem").html());
            _.each(rendering.subLayouts, function (subLayout) {              
              $subLayoutsList.append(subLayoutItemTemplate(subLayout));
              $subLayoutsList.find("#" + subLayout.id).find("img").click(self.removeSubLayout);
            });
          }
          
        }
      },
      
      clickOK: function () {
        if (!rendering || !itemChange)
          return;

        var renderingValue = JSON.stringify(rendering);
        if (itemChange && itemChange.fields) {
          _.each(itemChange.fields, function (field) {
            if (field.fieldId == CONST.RENDERINGS_FIELD_ID()) {
              field.value = renderingValue;
            }
          });
        }

        var actionCtrl = application.getActionCtrl();
        if (actionCtrl) {
          var data = {
            actionType: "saveItem",
            item: itemChange,
            callback: function () {
              $scope.isShowModalForm = false;
            },
          };
          actionCtrl.process(data);
        }
      },

    };
    
    layoutFormCtrl.constructor();
    return layoutFormCtrl;

  };
});