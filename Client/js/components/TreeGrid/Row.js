define(["application"], function (application) {
  return function Row (treeGrid, item) {
    var self;

    var row = {
      constructor: function () {
        self = this;
      },
      srcArrowRight : "./images/node-collapsed.png",

      srcFolderClose : "./images/folderClose2.png",

      srcEditImg : "./images/edit16_16.png",

      srcRefreshImg : "./images/refresh.png",

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
        if ($(parent.elem)[0].nodeName == "TBODY") {
          parent.elem.append(html);
          $trElem = parent.elem.children().last();
        } else if ($(parent.elem)[0].nodeName == "TR") {
          $trElem = $(html).insertAfter(parent.elem);
        }

        // set "tr" for item
        item.trElem = $trElem[0];

        // event-definition
        this.rowEventDefine();
      },

      getRowHTML: function (data) {
        if (!data)
          return;

        // parentId
        var parentIdStr = "";
        if (data.parent && data.parent.id && data.parent.id != '') {
          parentIdStr += 'parentId="' + data.parent.id + '"';
        }

        // margin-left
        var marginLeftStr = "";
        if (data.marginLeft && data.marginLeft != '') {
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

        var imgFolderSrc = this.srcFolderClose;
        if (item.iconCustom && item.iconCustom != '') {
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
                <div class='dvArrow'><img class='imgArrow' style='visibility:" + imgSrcArrowVisible + "' src=" + this.srcArrowRight + " /></div>";
              
        if (treeGrid.getIsCheckBoxElem())
          html += "<input type='button' role='checkbox' class='inputCheckbox " + checkedClass + "' aria-checked='true' style='width: 13px;'>";
        
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

          //var dataRequest = treeGrid.getDataRequest();
          //var data = "{ id: '" + this.id + "', database: '" + dataRequest.database + "', language: '" + dataRequest.language + "'}";

          var selItem = treeGrid.hashItems[this.id];
          treeGrid.selectedItem = selItem;
          if (!selItem)
            return;

          var data = { action: "getItemFields", id: selItem.id, templateId: selItem.templateId };

          application.httpRequest(data, function (responseData) {
            //var responseData = JSON.parse(response);            
            if (responseData.isOK) {
              self.isRequestProcess = false;
              var fields = responseData.data;
              //var filterFields = {};
              //_.each(fields, function (field) {
              //  filterFields[field.fieldId] = field;
              //});
              ////_.each(fields, function (field) {
              ////  if (field.itemId == selItem.id)
              ////    filterFields[field.fieldId] = field;
              ////});
              //var arKeys = _.keys(filterFields);
              //var arFields = [];
              //_.each(arKeys, function (key) {
              //  arFields.push(filterFields[key]);
              //});              
              //selItem.fields = arFields;
              
              selItem.fields = fields;
            } else {
              //responseData.error
            }

            if (treeGrid) {
              if (treeGrid.infoPanel)
                treeGrid.infoPanel.populateInfoPanel(selItem);

              //
              application.treeGridItemSelected();
            }
          }, function () {
            
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

          //$("table").css("cursor", "pointer");
          event.preventDefault();
        });


        //
        $trElem.dblclick([$trElem], treeGrid.clickNode);

        $trElem.keydown(function (event) {
          console.log("keydown");
        });

        // menu for first column
        var tdFirstElem = $trElem.find(".tdFirst");
        tdFirstElem.mousedown(function (event) {
          if (event.which == 3) // right click
            treeGrid.menuItem.show(event.pageX + 5, event.pageY, item);
        });

        // mouse down on item-elem(imgArrow)
        var dvArrowElem = $trElem.find(".dvArrow");
        dvArrowElem.mousedown([$trElem], treeGrid.clickNode);

        // checkbox-mousedown
        var inputCheckboxElem = $trElem.find(".inputCheckbox");
        inputCheckboxElem.mousedown([treeGrid, $trElem], function (event) {
          var self = event.data[0];
          var trElem = event.data[1][0];

          var item = self.hashItems[trElem.id];
          self.checkNode(item);
        });
        
      },

    };

    row.constructor();
    return row;
  };
});