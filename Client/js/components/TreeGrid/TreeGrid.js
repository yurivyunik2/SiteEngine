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
    var $parentElem;
    var isApplicationEvents;
    var identifier = "treeGrid_" + treeGridCounter++;

    var isCheckBoxElem = true;
    var isHeaderShow = false;

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

    var objTreeGrid = {
      selectedItem: null,
      selectedTemplate: null,

      // Drag and Drop
      $trDrag: null,
      $trDragStart: null,
      isDrag: false,
      $dragLine: null,

      //
      hashParentItems: {},
      hashItems: {},

      treeItems: [],
      treeItemsHash: {},

      counterRenderedItems: 0,

      constructor: function() {
        self = this;
        $parentElem = _$parentElem;
        isApplicationEvents = _isApplicationEvents;

        //
        application.addItemChangeSubscribers(self, self.itemChangeEvent);

        //
        application.addUIComponent(identifier, self);
      },

      dispose: function() {
        application.removeUIComponent(identifier, self);
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

      getIsCheckBoxElem: function() { return isCheckBoxElem; },
      setIsCheckBoxElem: function(_isCheckBoxElem) { isCheckBoxElem = _isCheckBoxElem; },

      getIsApplicationEvents: function () { return isApplicationEvents; },

      initializeItems: function(items) {
        this.treeItems = [];
        this.treeItemsHash = {};

        this.hashParentItems = {};
        this.hashItems = {};

        this.populateItems(items);
      },

      // populate
      populate: function(items) {
        this.initializeItems(items);

        //      
        this.renderTree();
      },

      populateItems: function(_items) {

        //var items = Utils.clone(_items);
        var items = [];
        _.each(_items, function(item) {
          var newItem = _.clone(item);
          delete newItem.children;
          delete newItem.childrenHash;
          items.push(newItem);
        });

        try {
          // find parent for each item
          for (var i = 0; i < items.length; i++) {
            var curItem = items[i];

            //----fix----//
            if (typeof this.hashParentItems[curItem.id] != 'undefined') {
              this.hashParentItems[curItem.id].children = curItem.children;
              curItem = this.hashParentItems[curItem.id];
            }
            //----fix end----//

            //
            //this.hashItemsPopulate[curItem.id] = curItem;

            var parentItem;

            if (curItem.parent && curItem.parent !== '') {
              parentItem = this.hashParentItems[curItem.parent];

              if (typeof parentItem === 'undefined') {
                for (var j = 0; j < items.length; j++) {
                  if (curItem.parent === items[j].id) {
                    parentItem = items[j];
                    break;
                  }
                }
              }
            }

            if (parentItem && curItem.parent && curItem.parent !== "") {
              if (!parentItem.children) {
                parentItem.children = [];
                parentItem.childrenHash = {};
              }

              if (typeof parentItem.childrenHash[curItem.id] == 'undefined') {
                parentItem.children.push(curItem);
              } else {
                curItem = parentItem.childrenHash[curItem.id];
              }
              parentItem.childrenHash[curItem.id] = curItem;

              curItem.parentObj = parentItem;
              this.hashParentItems[parentItem.id] = parentItem;
            } else {
              if (typeof this.treeItemsHash[curItem.id] == 'undefined') {
                this.treeItems.push(curItem);
              }
              this.treeItemsHash[curItem.id] = curItem;
            }
          }
        } catch (ex) {

        }
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
          '<div class="dvTableMain scrollCustom" >' +
          // Img for editing 
          '<div class="dvEditImg"><img src="' + srcEditImg + '" ></div>' +
          // div for editing 
          '<div class="dvEditControl" >' +
          '<input type="text">' +
          '<input type="button" value="OK">' +
          '</div>' +
          // table 
          '<table id="tbMain" border="0" cellspacing="0" cellpadding="0">' +
          '<tbody></tbody>' +
          '</table>' +
          '<div id="dragLine" style="display: none; position: absolute; width: 30px; height: 2px; background-color: #1A86C8;"></div>' +
          '</div>';


        //
        $parentElem.html(html);

        // $dragLine
        self.$dragLine = $parentElem.find("#dragLine");

        //
        var tableHeader = $parentElem.find("#tbHeader").find("tbody");
        var tableHeaderRow = new HeaderRow(this, tableHeader);
        tableHeaderRow.render();


        //
        var tableMain = $parentElem.find("#tbMain").find("tbody");
        this.counterRenderedItems = 0;
        for (var i = 0; i < this.treeItems.length; i++) {
          this.renderItem(tableMain, this.treeItems[i], isFiltered);
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

      selectItem: function(item) {
        if (!item || !item.trElem)
          return;
        self.openCloseNode(item.trElem);
        $(item.trElem).mousedown();
      },

      //
      // EVENTS
      //

      // keyDownEventFunc
      keyDownEventFunc: function (event) {
        if (!event)
          return;

        // if there are focused elements - then refuse action
        var focusedElems = $parentElem.find("*:focus");
        if (focusedElems.length > 0)
          return;

        if (self.selectedItem && self.selectedItem.trElem) {
          //var trElem = self.selectedItem.trElem;
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
                if (self.selectedItem.isOpened)
                  self.downNodeClick();
                if (self.selectedItem)
                  self.clickNode({ data: [$(self.selectedItem.trElem)] });
                break;
              }
            case CONST.LEFT_KEY():
              {
                var selectedItem = self.selectedItem;
                if (event.which === CONST.LEFT_KEY()) {
                  if (!selectedItem.isOpened && selectedItem.parentObj) {
                    self.clickNode({ data: [$(selectedItem.parentObj.trElem)] });
                  } else {
                    self.clickNode({ data: [$(selectedItem.trElem)] });
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
          }
        }
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
          this.openCloseNode(childItems[i].trElem, true);

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

          var trElem = item.trElem;
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
        var prevAll = $(self.selectedItem.trElem).prevAll(":visible");
        if (prevAll.length > 0) {
          $(prevAll[0]).mousedown();
        }
      },

      // downNodeClick
      downNodeClick: function () {
        var nextAll = $(self.selectedItem.trElem).nextAll(":visible");
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

        var imgArrowElem = $(trElem).find(".imgArrow")[0];
        var imgFolderElem = $(trElem).find(".imgFolder")[0];

        var itemObj = self.hashParentItems[trElem.id];
        if (itemObj) {

          if (!isNoChange) { // if it's needed to change state
            if (itemObj.isOpened)
              itemObj.isOpened = false;
            else
              itemObj.isOpened = true;
          }

          // hidding of the "arrow" for opening of the node
          if (!itemObj.children || itemObj.children.length === 0) {
            $parentElem.find(imgArrowElem).css("visibility", "hidden");
          }

          var display = "none";
          if (itemObj.isOpened) { // is node is opened
            imgArrowElem.src = srcArrowDown;
            if (!itemObj.iconCustom || itemObj.iconCustom === '') {
              imgFolderElem.src = srcFolderOpen;
            }
            display = "table-row";
          } else { // is node is closed
            imgArrowElem.src = srcArrowRight;
            if (!itemObj.iconCustom || itemObj.iconCustom === '') {
              imgFolderElem.src = srcFolderClose;
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
          var parentItem = newItem.parentObj;
          var $trElem = $(parentItem.trElem);
          var marginLeftVar = marginLeftInterval;
          var marginLeft = $trElem.find(".dvFirst").css("margin-left");
          if (marginLeft)
            marginLeftVar += parseInt(marginLeft);

          if (!parentItem.childrenHash)
            parentItem.childrenHash = {};
          if (!parentItem.children)
            parentItem.children = [];
          parentItem.childrenHash[newItem.id] = newItem;
          parentItem.children.push(newItem);
          //self.renderItem($trElem, newItem, parentItem.id, marginLeftVar, self.isFiltered);
          //self.openCloseNode(parentItem.trElem, !isNodeUpdate);
          self.openCloseNode(parentItem.trElem, true);

          $(newItem.trElem).mousedown();
        } catch (ex) {
        }
      },

      removeChildNode: function (itemObj) {
        if (!itemObj || !itemObj.id)
          return;
        
        try {
          var initItems = application.getItems();

          var item = _.findWhere(initItems, { id: itemObj.id });
          if (!item || !item.parentObj || !item.parentObj.trElem)
            return;

          var parentItem = item.parentObj;

          delete parentItem.childrenHash[item.id];

          var index = parentItem.children.indexOf(item);
          parentItem.children.splice(index, 1);
          
          self.openCloseNode(parentItem.trElem, true);

          $(parentItem.trElem).mousedown();
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

        var parentItem = this.hashParentItems[item.id];

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
          for (var idItem in this.treeItemsHash) {
            this.filterNode(this.treeItemsHash[idItem], filterName);
          }

          //this.populate(itemsFiltered, true);
          this.isFiltered = true;
          this.renderTree(this.isFiltered);
          this.updateOpenNodes(this.treeItems);
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

        self.sortTree(self.treeItems);        

        self.renderTree();

        //
        self.updateOpenNodes(self.treeItems);
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
