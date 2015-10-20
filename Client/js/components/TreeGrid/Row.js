define(["application", "CONST"], function (application, CONST) {
  return function Row (treeGrid, item) {
    var self;

    var srcArrowRight = "./images/node-collapsed.png";
    var srcFolderClose = "./images/folderClose2.png";
    var srcEditImg = "./images/edit16_16.png";
    var srcRefreshImg = "./images/refresh.png";

    var row = {
      constructor: function () {
        self = this;
      },

      // rendering of the item
      render: function (parent, marginLeft, isFiltered) {

        var html = this.getRowHTML({
          item: item,
          parent: parent,
          marginLeft: marginLeft,
          isFiltered: isFiltered
        });

        // appending of the elem
        var $trElem;
        if ($(parent.elem)[0].nodeName === "TBODY") {
          parent.elem.append(html);
          $trElem = parent.elem.children().last();
        } else if ($(parent.elem)[0].nodeName === "TR") {
          $trElem = $(html).insertAfter(parent.elem);
        }

        // set "tr" for item
        if ($trElem && $trElem.length > 0)
          item.trElem = $trElem[0];

        // event-definition        
        this.rowEventDefine();
      },

      getRowHTML: function (data) {
        if (!data)
          return;

        // parentId
        var parentIdStr = "";
        if (data.parent && data.parent.id && data.parent.id !== '') {
          parentIdStr += 'parentId="' + data.parent.id + '"';
        }

        // margin-left
        var marginLeftStr = "";
        if (data.marginLeft && data.marginLeft !== '') {
          marginLeftStr += "margin-left: " + data.marginLeft + "px;";
        }

        // img: arrow, folder
        var imgSrcArrowVisible = "hidden;";
        var imgSrcFolderVisible = "none;";

        var hashItem = treeGrid.hashParentItems[item.id];
        if (hashItem && hashItem.children) {
          imgSrcArrowVisible = "visible;";
          imgSrcFolderVisible = "inline-block;";
        }

        var imgFolderSrc = srcFolderClose;
        if (item.iconCustom && item.iconCustom !== '') {
          imgSrcFolderVisible = "inline-block;";
          imgFolderSrc = item.iconCustom;
        }

        // isChecked
        var checkedClass = "";
        if (item.isChecked)
          checkedClass += " inputCheckboxChecked";

        // isVisible
        var itemVisible = "table-row;";
        if (data.isFiltered && !item.filteredOK)
          itemVisible = "none;";

        var html =
          "<tr id='" + item.id + "' " + parentIdStr + " style='display:" + itemVisible + "'>\
            <td colName='name' class='tdFirst td-0' >\
              <div class='dvFirst' unselectable='on' style='" + marginLeftStr + ";' >\
                <div class='dvArrow'><img class='imgArrow' style='visibility:" + imgSrcArrowVisible + "' src=" + srcArrowRight + " /></div>";
              
        if (treeGrid.getIsCheckBoxElem())
          html += "<input type='button' role='checkbox' class='inputCheckbox " + checkedClass + "' aria-checked='true' >";
        
        html += "<img class='imgFolder' style='display:" + imgSrcFolderVisible + "' src=" + imgFolderSrc + " />\
                 <div class='dvName dvData' unselectable='on' >" + item.name + "</div>\
               </div>\
             </td>\
           </tr>";

        return html;
      },

      rowEventDefine: function () {
        var $trElem = $(item.trElem);

        // mousedown - select item
        $trElem.mousedown(function (event) {

          $(this).parent().find(".trSelected").removeClass("trSelected");
          $(this).addClass("trSelected");

          treeGrid.$trDragStart = $(this);
          treeGrid.isDrag = true;

          var selItem = treeGrid.hashItems[this.id];
          treeGrid.selectedItem = selItem;
          if (!selItem)
            return;

          if(treeGrid.getIsApplicationEvents())
            application.getItemFields(selItem, function() {
            ////var responseData = JSON.parse(response);            
            //if (!responseData.error) {
            //  self.isRequestProcess = false;
            //  var fields = responseData.data;
            //  //var filterFields = {};
            //  //_.each(fields, function (field) {
            //  //  filterFields[field.fieldId] = field;
            //  //});
            //  ////_.each(fields, function (field) {
            //  ////  if (field.itemId == selItem.id)
            //  ////    filterFields[field.fieldId] = field;
            //  ////});
            //  //var arKeys = _.keys(filterFields);
            //  //var arFields = [];
            //  //_.each(arKeys, function (key) {
            //  //  arFields.push(filterFields[key]);
            //  //});              
            //  //selItem.fields = arFields;

            //  selItem.fields = fields;
            //} else {
            //  //responseData.error
            //}

            //
            application.treeGridItemSelected();
          });
        });

        $trElem.mousemove(function (event) {
          treeGrid.$trDrag = $(event.currentTarget);
          event.preventDefault();
        });

        $(window).mouseup(function (event) {
          treeGrid.$dragLine.css("display", "none");
          treeGrid.isDrag = false;
        });
        $(window).mousemove(function (event) {

          if (treeGrid.isDrag && treeGrid.$trDrag && treeGrid.$trDragStart[0] != treeGrid.$trDrag[0]) {
            treeGrid.$dragLine.css("display", "block");
            var offsetTop = ($("table")[0].offsetTop + treeGrid.$trDrag[0].offsetTop + treeGrid.$trDrag[0].offsetHeight - 1);
            treeGrid.$dragLine.css("top", offsetTop + "px");
            var offsetLeft = $("table")[0].offsetLeft + treeGrid.$trDrag.find(".dvFirst")[0].offsetLeft + treeGrid.$trDrag.find(".dvData")[0].offsetLeft;
            treeGrid.$dragLine.css("left", offsetLeft + "px");
            
            treeGrid.$dragLine.css("width", treeGrid.$trDrag.find(".dvData")[0].offsetWidth + "px");
          }
          
          event.preventDefault();
        });

        //
        $trElem.dblclick([$trElem], treeGrid.clickNode);

        // menu for first column
        var tdFirstElem = $trElem.find(".tdFirst");
        tdFirstElem.mousedown(function (event) {
          if (treeGrid.getIsApplicationEvents() && event.which === CONST.RIGHT_MOUSE_KEY()) {  // right click
            var menuItem = application.getMenuItemEngineTree();
            if (menuItem)
              menuItem.show(event.pageX + 5, event.pageY, item);
          }            
        });

        // mouse down on item-elem(imgArrow)
        var dvArrowElem = $trElem.find(".dvArrow");
        dvArrowElem.mousedown([$trElem], function () {          
          treeGrid.clickNode({ data: [$trElem] });
          event.stopPropagation();
        });

        // checkbox-mousedown
        var inputCheckboxElem = $trElem.find(".inputCheckbox");
        inputCheckboxElem.mousedown([treeGrid, $trElem], function (event) {
          var self = event.data[0];
          var trElem = event.data[1][0];

          var item = self.hashItems[trElem.id];
          self.checkNode(item);
          event.stopPropagation();
        });        
      },

    };

    row.constructor();
    return row;
  };
});