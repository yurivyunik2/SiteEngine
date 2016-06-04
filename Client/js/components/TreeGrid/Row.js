define(["application", "CONST"], function (application, CONST) {
  return function Row (treeGrid, item) {
    var self;

    var srcArrowRight = "./images/node-collapsed.png";
    var srcFolderClose = "./images/folderClose2.png";
    var srcEditImg = "./images/edit16_16.png";
    var srcRefreshImg = "./images/refresh.png";

    var renderParent;
    var renderMarginLeft;
    var renderIsFiltered;

    var hashItemRow = treeGrid.getHashItemRow();

    var row = {
      trElem: null,
      $trElem: null,

      constructor: function () {
        self = this;
        
        hashItemRow[item.id] = self;
      },

      // rendering of the item
      render: function (parent, marginLeft, isFiltered) {
        renderParent = parent;
        renderMarginLeft = marginLeft;
        renderIsFiltered = isFiltered;

        var html = this.getRowHTML({
          item: item,
          parent: parent,
          marginLeft: marginLeft,
          isFiltered: isFiltered
        });

        // appending of the elem
        if ($(parent.elem)[0].nodeName === "TBODY") {
          parent.elem.append(html);
          this.$trElem = parent.elem.children().last();
        } else if ($(parent.elem)[0].nodeName === "TR") {
          this.$trElem = $(html).insertAfter(parent.elem);
        }

        // set "tr" for item
        if (this.$trElem && this.$trElem.length > 0) {
          //item.trElem = this.$trElem[0];
          self.trElem = this.$trElem[0];

          // event-definition        
          self.rowEventDefine();
        }        

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

        var imgFolderSrc = srcFolderClose;
        var hashItem = treeGrid.hashParentItems[item.id];
        if (hashItem && (hashItem.children || hashItem.templateId == CONST.FOLDER_TEMPLATE_ID())) {
          if(hashItem.children)
            imgSrcArrowVisible = "visible;";
          imgSrcFolderVisible = "inline-block;";
        }

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

      update: function () {
        if (!renderParent)
          return;

        var html = this.getRowHTML({
          item: item,
          parent: renderParent,
          marginLeft: renderMarginLeft,
          isFiltered: renderIsFiltered
        });

        var $trElemUpdated = $(html);
        if (self.$trElem) {
          self.$trElem.html($trElemUpdated.html());

          // event-definition        
          self.rowEventDefine();
        }        
      },

      rowEventDefine: function () {
        //var $trElem = $(item.trElem);

        // mousedown - select item
        self.$trElem.mousedown(function (event) {
          //
          application.setTreeGridFocused(treeGrid);

          $(this).parent().find(".trSelected").removeClass("trSelected");
          $(this).addClass("trSelected");

          treeGrid.$trDragStart = $(this);
          //treeGrid.isDrag = true;

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

        self.$trElem.mousemove(function (event) {
          treeGrid.$trDrag = $(event.currentTarget);
          event.preventDefault();
        });

        $(window).mouseup(function (event) {
          treeGrid.$dragLine.css("display", "none");
          treeGrid.isDrag = false;
        });
        $(window).mousemove(function (event) {

          if (treeGrid.isDrag && treeGrid.$trDrag && treeGrid.$trDragStart[0] !== treeGrid.$trDrag[0]) {
            var $parentElem = treeGrid.getParentElem();
            var $table;
            if ($parentElem) {
              var tables = $parentElem.find("table");
              if (tables.length > 0)
                $table = tables[0];
            }

            if ($table) {
              treeGrid.$dragLine.css("display", "block");
              var offsetTop = ($table.offsetTop + treeGrid.$trDrag[0].offsetTop + treeGrid.$trDrag[0].offsetHeight - 1);
              treeGrid.$dragLine.css("top", offsetTop + "px");
              var offsetLeft = $table.offsetLeft + treeGrid.$trDrag.find(".dvFirst")[0].offsetLeft + treeGrid.$trDrag.find(".dvData")[0].offsetLeft;
              treeGrid.$dragLine.css("left", offsetLeft + "px");

              treeGrid.$dragLine.css("width", treeGrid.$trDrag.find(".dvData")[0].offsetWidth + "px");
            }
          }
          
          event.preventDefault();
        });

        //
        self.$trElem.dblclick([self.$trElem], treeGrid.clickNode);

        // menu for first column
        var tdFirstElem = self.$trElem.find(".tdFirst");
        tdFirstElem.mousedown(function (event) {
          if (treeGrid.getIsApplicationEvents() && event.which === CONST.RIGHT_MOUSE_KEY()) {  // right click
            var menuItem = application.getMenuItemEngineTree();
            if (menuItem)
              menuItem.show(event.pageX + 5, event.pageY, item);
          }
        });

        // mouse down on item-elem(imgArrow)
        var dvArrowElem = self.$trElem.find(".dvArrow");
        dvArrowElem.mousedown([self.$trElem], function () {
          treeGrid.clickNode({ data: [self.$trElem] });
          event.stopPropagation();
        });

        // checkbox-mousedown
        var inputCheckboxElem = self.$trElem.find(".inputCheckbox");
        inputCheckboxElem.mousedown([treeGrid, self.$trElem], function (event) {
          var treeGridData = event.data[0];
          var trElem = event.data[1][0];

          var item = treeGridData.hashItems[trElem.id];
          self.checkNode(item);
          event.stopPropagation();
        });        
      },

    };

    row.constructor();
    return row;
  };
});