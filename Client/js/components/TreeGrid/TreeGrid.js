require.config({
  paths: {
    row: "js/components/TreeGrid/Row",
    headerRow: "js/components/TreeGrid/HeaderRow",
    TreeGridCss: "js/components/TreeGrid/TreeGrid",
  },
});

define(["application", "CONST", "Utils", "row", "headerRow", "css!TreeGridCss"], function (application, CONST, Utils, Row, HeaderRow) {

  var treeGridCounter = 0;

  return function TreeGrid(_$parentElem, _isApplicationEvents) {

    var self;
    var $el;
    var $parentElem;
    var isApplicationEvents;
    var identifier = "treeGrid_" + treeGridCounter++;

    var isCheckBoxElem = true;
    var isHeaderShow = false;

    var treeItems = [];

    var hashItemRow = {};

    var curEditItem;
    var $editCtlrElem;

    // 
    var marginLeftInterval = 10;
    var maxAmountRenderedItems = 1000;

    var openCloseNodeEvent;

    // images
    var srcArrowDown = "./images/node-expanded.png";
    var srcArrowRight = "./images/node-collapsed.png";
    var srcFolderOpen = "./images/folderOpen2.png";
    var srcFolderClose = "./images/folderClose2.png";
    var srcEditImg = "./images/edit16_16.png";
    var srcRefreshImg = "./images/refresh.png";
    var srcRemoveImg = "./images/remove.png";
    

    var objTreeGrid = {
      _selectedItem: null,

      selectedTemplate: null,

      // Drag and Drop
      $trDrag: null,
      $trDragStart: null,
      isDrag: false,
      $dragLine: null,

      //
      hashParentItems: {},
      hashItems: {},

      counterRenderedItems: 0,

      constructor: function() {
        self = this;
        $parentElem = _$parentElem;
        isApplicationEvents = _isApplicationEvents;

        Object.defineProperty(self, 'selectedItem', {
          get: function () { return self._selectedItem; },
          set: function(newValue) {
            self._selectedItem = newValue;
            if (self._selectedItem !== curEditItem)
              $editCtlrElem.hide();
          },
          enumerable: true,
          configurable: true
        });


        //
        application.addItemChangeSubscribers(identifier, self.itemChangeEvent);

        //
        application.addUIComponent(identifier, self);
      },

      dispose: function() {
        application.removeItemChangeSubscribers(identifier);

        application.removeUIComponent(identifier);
      },

      intervalUI: function(uiData) {
        if (!uiData || self !== application.getTreeGridFocused())
          return;

        if (uiData.keyDownEventLast) {
          self.keyDownEventFunc(uiData.keyDownEventLast);
        }
      },

      getParentElem: function() {
        return $parentElem;
      },

      getHashItemRow: function() {
        return hashItemRow;
      },

      getIsCheckBoxElem: function() { return isCheckBoxElem; },
      setIsCheckBoxElem: function(_isCheckBoxElem) { isCheckBoxElem = _isCheckBoxElem; },

      getIsApplicationEvents: function() { return isApplicationEvents; },

      initializeItems: function(items) {
        //treeItems = [];
        //this.treeItemsHash = {};
        if (items && items.length > 0) {
          treeItems = [];
          treeItems.push(items[0]);
        } else {
          treeItems = application.treeItems;
        }

        this.hashParentItems = {};
        this.hashItems = {};
      },

      getTreeItems: function() {
        return treeItems;
      },

      // populate
      populate: function(items) {
        this.initializeItems(items);

        //this.populateItems(items);

        //      
        this.renderTree();
      },

      newItemClone: function(item) {
        var newItem = _.clone(item);
        //delete newItem.children;
        //delete newItem.childrenHash;
        return newItem;
      },

      populateItems: function(_items) {

        //var items = _items;
        ////var items = [];
        ////_.each(_items, function(item) {
        ////  var newItem = self.newItemClone(item);
        ////  items.push(newItem);
        ////});

        //try {
        //  // find parent for each item
        //  for (var i = 0; i < items.length; i++) {
        //    var curItem = items[i];

        //    //
        //    //yvy - fix temporary
        //    //
        //    this.hashParentItems[curItem.id] = curItem;

        //    //----fix----//
        //    //if (typeof this.hashParentItems[curItem.id] != 'undefined') {
        //    if (curItem && curItem.id) {
        //      this.hashParentItems[curItem.id].children = curItem.children;
        //      curItem = this.hashParentItems[curItem.id];
        //    }
        //    //----fix end----//

        //    //
        //    //this.hashItemsPopulate[curItem.id] = curItem;

        //    var parentItem;

        //    if (curItem.parentId && curItem.parentId !== '') {
        //      parentItem = this.hashParentItems[curItem.parentId];

        //      if (!parentItem) {
        //        for (var j = 0; j < items.length; j++) {
        //          if (curItem.parentId === items[j].id) {
        //            parentItem = items[j];
        //            break;
        //          }
        //        }
        //      }
        //    }

        //    if (parentItem && curItem.parentId && curItem.parentId !== "") {
        //      if (!parentItem.children) {
        //        parentItem.children = [];
        //        parentItem.childrenHash = {};
        //      }

        //      if (typeof parentItem.childrenHash[curItem.id] == 'undefined') {
        //        parentItem.children.push(curItem);
        //      } else {
        //        curItem = parentItem.childrenHash[curItem.id];
        //      }
        //      parentItem.childrenHash[curItem.id] = curItem;

        //      curItem.parentObj = parentItem;
        //      this.hashParentItems[parentItem.id] = parentItem;
        //    } else {
        //      if (typeof this.treeItemsHash[curItem.id] == 'undefined') {
        //        treeItems.push(curItem);
        //      }
        //      this.treeItemsHash[curItem.id] = curItem;
        //    }
        //  }

        //} catch (ex) {

        //}
      },

      // renderTree
      renderTree: function(isFiltered) {
        //var self = this;

        //var dvTableElem = $parentElem.find(".dvTable");

        var html = "";
        if (isHeaderShow) {
          html +=
            // Table-Header
            '<table id="tbHeader" border="0" cellspacing="0" cellpadding="0" style="width: 100%;">' +
            '<tbody></tbody>' +
            '</table>';
        }

        html +=
          // TableMain 
          '<div id="' + identifier + '" class="dvTreeGrid dvTableMain scrollCustom" >' +
          // Img for editing 
          '<div class="dvEditImg"><img src="' + srcEditImg + '" ></div>' +
          // div for editing 
          '<div class="dvEditControl" >' +
            '<table><tbody><tr>' + 
              '<td><input class="inputEdit" type="text" ></td>' + 
              '<td><div class="dvEditButtons"><input class="inputOK" type="button" value="OK"><div class="dvCancelEdit"><img src="' + srcRemoveImg + '"></div></div></td>' +
            '</tr></tbody></table>' + 
          '</div>' +
          // table 
          '<table class="tbMain" border="0" cellspacing="0" cellpadding="0">' +
          '<tbody></tbody>' +
          '</table>' +
          '<div id="dragLine" style="display: none; position: absolute; width: 30px; height: 2px; background-color: #1A86C8;"></div>' +
          '</div>';


        //
        $parentElem.html(html);
        $el = $parentElem.find("#" + identifier);

        $editCtlrElem = $el.find(".dvEditControl");
        var $inputOk = $editCtlrElem.find(".inputOK");
        $inputOk.click(self.clickOK_editCtrl);
        var $dvCancelEdit = $editCtlrElem.find(".dvCancelEdit");
        $dvCancelEdit.click(self.clickCancel_editCtrl);
          
        // $dragLine
        self.$dragLine = $parentElem.find("#dragLine");

        //
        var tableHeader = $parentElem.find("#tbHeader").find("tbody");
        var tableHeaderRow = new HeaderRow(this, tableHeader);
        tableHeaderRow.render();


        //
        var tableMain = $parentElem.find(".tbMain").find("tbody");
        this.counterRenderedItems = 0;
        for (var i = 0; i < treeItems.length; i++) {
          this.renderItem(tableMain, treeItems[i], isFiltered);
        }
      },

      // rendering of the item
      renderItem: function(parentElem, item, parentId, marginLeft, isFiltered) {
        self.counterRenderedItems++;
        if (self.counterRenderedItems >= maxAmountRenderedItems)
          return;

        // hash item
        this.hashItems[item.id] = item;

        var row = new Row(this, item);
        return row.render({ elem: parentElem, id: parentId }, marginLeft, isFiltered);
      },

      hide: function() {
        if ($parentElem)
          $parentElem.hide();
      },

      refreshItem: function(item) {
        if (!item)
          return;

        var itemRow = hashItemRow[item.id];
        if (itemRow) {
          itemRow.update();
          self.selectItem(item);
        }
      },

      selectItem: function(item) {
        if (!item)
          return;
        var itemRow = hashItemRow[item.id];
        if (itemRow && itemRow.trElem) {
          self.openCloseNode(itemRow.trElem);
          $(itemRow.trElem).mousedown();
        }
      },

      renameItem: function(item) {
        if (!item)
          return;

        curEditItem = item;

        var itemRow = hashItemRow[item.id];
        if (itemRow && itemRow.trElem) {
          var trElem = itemRow.trElem;          
          var rectItemRowElem = trElem.getBoundingClientRect();
          var $dvNameElem = $(trElem).find(".dvName");
          var rectItemNameElem = $dvNameElem[0].getBoundingClientRect();

          var rectTreeGridElem = $el[0].getBoundingClientRect();

          $editCtlrElem[0].style.left = (rectItemNameElem.left - rectTreeGridElem.left) + "px";
          $editCtlrElem[0].style.top = (rectItemRowElem.top - rectTreeGridElem.top) + "px";
          //$editCtrl[0].style.width = (rectItemRowElem.width - rectItemNameElem.left) + "px";
          var $inputEdit = $editCtlrElem.find(".inputEdit");
          $inputEdit.val(item.name);          
          $editCtlrElem.show();
          $inputEdit.focus();
        }
      },

      //
      // EVENTS
      //

      // keyDownEventFunc
      keyDownEventFunc: function (event) {
        if (!event || !self.selectedItem)
          return;
       
        // if there are focused elements - then refuse action
        //var focusedElems = $parentElem.find("*:focus");
        var focusedElems = $("input:focus,select:focus,textarea:focus");
        if (focusedElems.length > 0)
          return;

        var itemRow = hashItemRow[self.selectedItem.id];
        if (itemRow && itemRow.trElem) {
          switch (event.which) {
            case CONST.UP_KEY():
              {
                self.upNodeClick();
                break;
              }
            case CONST.DOWN_KEY():
              {
                self.downNodeClick();
                break;
              }
            case CONST.RIGHT_KEY():
              {
                if (self.selectedItem.isOpened) {
                  self.downNodeClick();
                  if (self.selectedItem)
                    itemRow = hashItemRow[self.selectedItem.id];
                }
                if (self.selectedItem)
                  self.clickNode({ data: [$(itemRow.trElem)] });
                break;
              }
            case CONST.LEFT_KEY():
              {
                var selItem = self.selectedItem;
                if (event.which === CONST.LEFT_KEY()) {
                  if (selItem.parentObj && (!selItem.isOpened || !selItem.children || selItem.children.length === 0)) {
                    var parentItemRow = hashItemRow[selItem.parentObj.id];
                    if (parentItemRow)
                      self.clickNode({ data: [$(parentItemRow.trElem)] });
                  } else {
                    self.clickNode({ data: [$(itemRow.trElem)] });
                  }
                }
                break;
              }
          }
        }
      },

      // itemChangeEvent
      itemChangeEvent: function (event) {
        if (event && event.action && event.item) {
          if (event.action === "addItem") {
            self.addChildNode(event.item);
          } else if (event.action === "removeItem") {
            self.removeChildNode(event.item);
          }

        }
      },

      clickOK_editCtrl: function (event) {
        if (!curEditItem)
          return;
        
        var $inputEdit = $editCtlrElem.find(".inputEdit");
        if (!$inputEdit.val())
          return;

        curEditItem.name = $inputEdit.val();

        var data = {
          item: curEditItem,
          actionName: "Renaming",
        };
        var actionCtrl = application.getActionCtrl();
        actionCtrl.saveItem(data, function (data) {
          if (data && data.item) {
            $editCtlrElem.hide();
          }          
        });
      },

      clickCancel_editCtrl: function(event) {
        $editCtlrElem.hide();
      },

      //
      // END EVENTS
      //


      //
      // NODES
      //

      // updating of opened nodes(and sub-nodes) - if we open node then pass through sub-nodes and open them if they were opened early
      updateOpenNodes: function (childItems) {
        if (!childItems)
          return;

        //
        for (var i = 0; i < childItems.length; i++) {
          var itemRow = hashItemRow[childItems[i].id];
          this.openCloseNode(itemRow.trElem, true);

          // children
          this.updateOpenNodes(childItems[i].children);
        }
      },

      // checking node(with sub-nodes)
      checkNode: function (item, parent) {
        if (item) {
          if (parent) {
            item.isChecked = parent.isChecked;
          } else {
            item.isChecked = item.isChecked ? false : true;
          }

          var itemRow = hashItemRow[item.id];
          var trElem = itemRow.trElem;
          if (trElem) {
            if (item.isChecked) {
              $(trElem).find(".inputCheckbox").addClass("inputCheckboxChecked");
            } else {
              $(trElem).find(".inputCheckbox").removeClass("inputCheckboxChecked");
            }
          }

          if (item.children) {
            var children = item.children;
            for (var i = 0; i < children.length; i++) {
              this.checkNode(item.childrenHash[children[i].id], item);
            }
          }
        }
      },

      // upNodeClick
      upNodeClick: function () {
        var itemRow = hashItemRow[self.selectedItem.id];
        var prevAll = $(itemRow.trElem).prevAll(":visible");
        if (prevAll.length > 0) {
          $(prevAll[0]).mousedown();
        }
      },

      // downNodeClick
      downNodeClick: function () {
        var itemRow = hashItemRow[self.selectedItem.id];
        var nextAll = $(itemRow.trElem).nextAll(":visible");
        if (nextAll.length > 0) {
          $(nextAll[0]).mousedown();
        }
      },

      // click on node
      clickNode: function (event) {
        if (!event || !event.data || event.data.length === 0)
          return;
        var trElem = event.data[0][0];

        //$(trElem).draggable();
        self.openCloseNode(trElem);
        $(trElem).mousedown();
      },

      // setOpenCloseNodeEvent
      setOpenCloseNodeEvent: function (_openCloseNodeEvent) {
        openCloseNodeEvent = _openCloseNodeEvent;
      },

      // open-close node(parent with sub-nodes)
      openCloseNode: function (trElem, isNoChange) {
        if (!trElem)
          return;
        
        var self = this;

        var $imgArrowElem = $(trElem).find(".imgArrow");
        var $imgFolderElem = $(trElem).find(".imgFolder");

        var itemObj = application.hashParentItems[trElem.id];
        if (itemObj) {

          if (!isNoChange) { // if it's needed to change state
            if (itemObj.isOpened)
              itemObj.isOpened = false;
            else
              itemObj.isOpened = true;
          }

          // hidding of the "arrow" for opening of the node
          if (!itemObj.children || itemObj.children.length === 0) {
            //$parentElem.find(".imgArrow").css("visibility", "hidden");
            $imgArrowElem.css("visibility", "hidden");
          } else {
            $imgArrowElem.css("visibility", "visible");
            $imgFolderElem.css("display", "inline-block");
          }

          var display = "none";
          if (itemObj.isOpened) { // is node is opened
            $imgArrowElem[0].src = srcArrowDown;
            if (!itemObj.iconCustom || itemObj.iconCustom === '') {
              $imgFolderElem[0].src = srcFolderOpen;
            }
            display = "table-row";
          } else { // is node is closed
            $imgArrowElem[0].src = srcArrowRight;
            if (!itemObj.iconCustom || itemObj.iconCustom === '') {
              $imgFolderElem[0].src = srcFolderClose;
            }
          }


          // child elements
          var childElems = [];
          self.getChildsWithParent(childElems, trElem.id, $(trElem).parent());

          if (itemObj.isOpened) { // Opened
            // request to server
            //self.requestGetItems(itemObj);
            if (itemObj.children) {
              if (childElems.length !== 0) { // if do not exist - then create html-elems                
                $(childElems).remove();
              }
              for (var i = itemObj.children.length - 1; i >= 0; i--) {
                var marginLeftVar = marginLeftInterval;
                //if (marginLeft)
                //  marginLeftVar += marginLeft;
                var marginLeft = $(trElem).find(".dvFirst").css("margin-left");
                if (marginLeft)
                  marginLeftVar += parseInt(marginLeft);

                self.renderItem($(trElem), itemObj.childrenHash[itemObj.children[i].id], itemObj.id, marginLeftVar, self.isFiltered);
              }
            }
          } else { // Closed
            $(childElems).css("display", "none");
          }
        }

        if (openCloseNodeEvent)
          openCloseNodeEvent(itemObj);
      },

      addChildNode: function (newItem, isNodeUpdate) {
        if (!newItem || !newItem.parentObj)
          return;

        try {

          //newItem = self.newItemClone(newItem);
          //var parentItem = newItem.parentObj;
          var parentItem = application.hashParentItems[newItem.parentObj.id];
          if (!parentItem)
            return;

          //var $trElem = $(parentItem.trElem);
          //var marginLeftVar = marginLeftInterval;
          //var marginLeft = $trElem.find(".dvFirst").css("margin-left");
          //if (marginLeft)
          //  marginLeftVar += parseInt(marginLeft);

          //if (!parentItem.childrenHash)
          //  parentItem.childrenHash = {};
          //if (!parentItem.children)
          //  parentItem.children = [];
          //parentItem.childrenHash[newItem.id] = newItem;
          //parentItem.children.push(newItem);

          //self.renderItem($trElem, newItem, parentItem.id, marginLeftVar, self.isFiltered);
          //self.openCloseNode(parentItem.trElem, !isNodeUpdate);
          
          application.hashParentItems[newItem.id] = newItem;
          var itemRow = hashItemRow[parentItem.id];
          if (itemRow.trElem) {
            parentItem.isOpened = true;
            self.openCloseNode(itemRow.trElem, true);

            itemRow = hashItemRow[newItem.id];
            $(itemRow.trElem).mousedown();
          }
        } catch (ex) {
        }
      },

      removeChildNode: function (item) {
        if (!item || !item.id || !item.parentObj)
          return;
        
        try {
          //var initItems = application.getItems();

          //var item = _.findWhere(initItems, { id: itemObj.id });
          ////if (!item || !item.parentObj || !item.parentObj.trElem)
          ////  return;
          //if (!item || !item.parentObj)
          //  return;

          //var parentItem = item.parentObj;
          var parentItem = application.hashParentItems[item.parentObj.id];
          if (!parentItem)
            return;

          //delete parentItem.childrenHash[item.id];

          //parentItem.children = _.without(parentItem.children, _.findWhere(parentItem.children, { id: item.id }));

          var itemRow = hashItemRow[parentItem.id];
          self.openCloseNode(itemRow.trElem, true);

          $(itemRow.trElem).mousedown();
        } catch (ex) { }
      },
      //
      // END NODES
      //

      getChildsWithParent: function (childElems, parentId, parentElem) {
        var listElems;
        if ($(parentElem)[0].nodeName === "TBODY") {
          listElems = $(parentElem).find("tr[parentId='" + parentId + "']");
        } else if ($(parentElem)[0].nodeName === "TR") {
          listElems = $(parentElem).nextAll("tr[parentId='" + parentId + "']");
        }

        if (listElems) {
          for (var i = 0; i < listElems.length; i++) {
            childElems.push(listElems[i]);
            this.getChildsWithParent(childElems, listElems[i].id, listElems[i]);
          }
        }
      },
      
      //
      // FILTERING
      //
      isFiltered: false,

      filterNode: function (item, filterName) {
        var isFound = false;
        if (item.name.toLowerCase().indexOf(filterName) >= 0)
          isFound = true;

        var parentItem = application.hashParentItems[item.id];

        if (parentItem) {
          for (var key in parentItem.childrenHash) {
            var isFoundChild = this.filterNode(parentItem.childrenHash[key], filterName);
            if (isFoundChild)
              isFound = true;
          }
        }

        //if (isFound) {
        //  //item.children = [];
        //  //item.childrenHash = {};
        //  //itemsFiltered.push(item);
        //}
        item.filteredOK = isFound;
        item.isOpened = isFound;

        return isFound;
      },

      filterTree: function (filterName) {
        if (filterName && filterName != "") {
          //this.setHashTree();

          var itemsFiltered = [];
          for (var index = 0; index < this.treeItems.length; index++) {
            this.filterNode(this.treeItems[index], filterName);
          }

          //this.populate(itemsFiltered, true);
          this.isFiltered = true;
          this.renderTree(this.isFiltered);
          this.updateOpenNodes(treeItems);
        } else {
          this.isFiltered = false;
          this.renderTree(this.isFiltered);
        }
        //else {
        //  this.populate({}, true, true);
        //}
      },
      //
      // END FILTERING
      //

      //
      // SORTING
      //
      sortField: "",

      // sorting method Enum
      sortMethodEnum: {
        'NO': 0,
        'ASC': -1,
        'DESC': -2
      },
      sortMethod: undefined,

      getSortImgSrc: function (columnName) {
        var src = "./images/sortArrow3.png";
        if (this.sortField == columnName) {
          if (this.sortMethod == this.sortMethodEnum.DESC)
            src = "./images/arrowDown3.png";
          else if (this.sortMethod == this.sortMethodEnum.ASC)
            src = "./images/arrowUp3.png";
        }

        return src;
      },

      sortHandler: function (event) {        
        var self = event.data[0];

        var thParentElem = $(this).parent().parent();
        self.sortField = thParentElem.attr("colName");

        if (typeof self.sortMethod === 'undefined' || self.sortMethod == self.sortMethodEnum.DESC) {
          self.sortMethod = self.sortMethodEnum.ASC;
        } else {
          self.sortMethod = self.sortMethodEnum.DESC;
        }
        var imgSortSrc = self.getSortImgSrc(self.sortField);

        $(this).attr("src", imgSortSrc);

        self.sortTree(treeItems);        

        self.renderTree();

        //
        self.updateOpenNodes(treeItems);
      },

      // sorting of tree
      sortTree: function (treeItems) {
        if (this.sortMethod === this.sortMethodEnum.ASC)
          treeItems.sort(this.sortAsc);
        else if (this.sortMethod === this.sortMethodEnum.DESC)
          treeItems.sort(this.sortDesc);

        for (var i = 0; i < treeItems.length; i++) {
          var elem = treeItems[i];

          if (typeof elem.children !== 'undefined')
            this.sortTree(elem.children);
        }
      },

      // sorting ASC
      sortAsc: function (obj1, obj2) {
        var name1 = obj1[self.sortField];
        var name2 = obj2[self.sortField];
        if (name1 < name2) {
          return -1;
        }
        if (name1 > name2) {
          return 1;
        }
        return 0;
      },

      // sorting DESC
      sortDesc: function (obj1, obj2) {
        var name1 = obj1[self.sortField];
        var name2 = obj2[self.sortField];
        if (name1 > name2) {
          return -1;
        }
        if (name1 < name2) {
          return 1;
        }
        return 0;
      },
      //
      // END SORTING
      // 

    };

    objTreeGrid.constructor();
    return objTreeGrid;
  };

});
