require.config({
  paths: {
    row: "js/components/TreeGrid/Row",
    headerRow: "js/components/TreeGrid/HeaderRow",
    TreeGridCss: "js/components/TreeGrid/TreeGrid",
  },
});

define(["application", "row", "headerRow", "CONST", "css!TreeGridCss"], function (application, Row, HeaderRow, CONST) {

  return function TreeGrid(_$parentElem) {

    var self;
    var $parentElem;

    var isCheckBoxElem = false;

    var isHeaderShow = false;

    var objTreeGrid = {
      parent: undefined,
      $el: undefined,
      tooltip: undefined,

      getIsCheckBoxElem: function() { return isCheckBoxElem; },

      selectedItem: null,
      selectedTemplate: null,

      $trDrag: null,
      $trDragStart: null,
      isDrag: false,
      $dragLine: null,

      menuItem: undefined,

      srcArrowDown: "./images/node-expanded.png",
      srcArrowRight: "./images/node-collapsed.png",

      srcFolderOpen: "./images/folderOpen2.png",
      srcFolderClose: "./images/folderClose2.png",

      srcEditImg: "./images/edit16_16.png",

      srcRefreshImg: "./images/refresh.png",

      //
      infoPanel: undefined,

      initItems: null,

      //
      hashParentItems: {},
      hashItems: {},
      hashChangedItems: {},

      hashInsertOptions: {},      

      treeItems: [],
      treeItemsHash: {},

      allItemsRequest: [],

      maxAmountRenderedItems: 1000,
      counterRenderedItems: 0,

      //hashTree: {},

      isFiltered: false,

      sortField: "",

      // sorting
      sortMethodEnum: {
        'NO': 0,
        'ASC': -1,
        'DESC': -2
      },
      sortMethod: undefined,

      constructor: function() {
        self = this;
        $parentElem = _$parentElem;

        //
        application.addItemChangeSubscribers(self, self.itemChangeEvent);
      },

      itemChangeEvent: function(event) {
        if (event && event.action && event.item) {
          if (event.action === "addItem") {
            self.addChildNode(event.item);
          }
        }
      },

      keyDownEventFunc: function (event) {
        if (!event)
          return;

        // if there are focused elements - then refuse action
        var focusedElems = $("*:focus");
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
                if (event.which == CONST.LEFT_KEY()) {
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

      upNodeClick: function () {
        var prevAll = $(self.selectedItem.trElem).prevAll(":visible");
        if (prevAll.length > 0) {
          $(prevAll[0]).mousedown();
        }
      },
      downNodeClick: function () {
        var nextAll = $(self.selectedItem.trElem).nextAll(":visible");
        if (nextAll.length > 0) {
          $(nextAll[0]).mousedown();
        }
      },


      get$parentElem: function () {
        return $parentElem;
      },

      setParameters: function (parameters) {
        this.parent = parameters.parent;
        this.tooltip = parameters.tooltip;

        this.menuItem = parameters.menuItem;        
        this.infoPanel = parameters.infoPanel;

        isCheckBoxElem = parameters.isCheckBoxElem;
      },      

      addInsertOptions: function (item) {
        if (!item)
          return;

        //var self = this;

        var insertOptionsField;
        _.each(item.fields, function (field) {
          if (CONST.INSERT_OPTIONS_FIELD_ID() == field.fieldId) {
            insertOptionsField = field;
          }
        });

        var arInsertItems = [];
        if (insertOptionsField && insertOptionsField.value && insertOptionsField.value != "") {
          var arTemplates = insertOptionsField.value.split("|");

          var initItems = application.getItems();
          _.each(initItems, function (item) {
            if (arTemplates.indexOf(item.id.toString()) >= 0) {
              self.hashInsertOptions[item.id] = item;
              arInsertItems.push(item);
            }
          });

        }
        if (self.menuItem)
          self.menuItem.updateInsertOptions(arInsertItems);
      },

        // populate
      populate: function (items) {
        this.initializeItems(items);

        //      
        this.renderTree();
      },

      initializeItems: function (items) {
        this.initItems = _.clone(items);
        this.initItems[0] = _.clone(items[0]);

        this.treeItems = [];
        this.treeItemsHash = {};

        this.hashParentItems = {};
        this.hashItems = {};
        this.hashChangedItems = {};

        this.populateItems(items);
      },

      populateItems: function (items) {

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

            if (typeof curItem.parent !== 'undefined' && curItem.parent != '') {
              parentItem = this.hashParentItems[curItem.parent];

              if (typeof parentItem === 'undefined') {
                for (var j = 0; j < items.length; j++) {
                  if (curItem.parent == items[j].id) {
                    parentItem = items[j];
                    break;
                  }
                }
              }
            }

            if (typeof parentItem !== 'undefined' && curItem.parent && curItem.parent != "") {
              if (typeof parentItem.children === 'undefined') {
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
        }
        catch (ex) {
          var i = 0;
        }
      },
      
        // renderTree
      renderTree: function (isFiltered) {
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
            '<div class="dvEditImg"><img src="' + this.srcEditImg + '" ></div>' +
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

        //
        self.$dragLine = $parentElem.find("#dragLine");

        //
        var tableHeader = $parentElem.find("#tbHeader").find("tbody");

        var tableHeaderRow = new HeaderRow(this, tableHeader);
        tableHeaderRow.render();
        

        ////
        var tableMain = $parentElem.find("#tbMain").find("tbody");
        //var tableMainHeaderRow = new HeaderRow(this, tableMain);
        //tableMainHeaderRow.render(true);

        //
        this.counterRenderedItems = 0;
        for (var i = 0; i < this.treeItems.length; i++) {
          this.renderItem(tableMain, this.treeItems[i], isFiltered);
        }


        //
        this.correctHeaderColumnWidth();
      },
      
      showEditingPanel: function (body) {

        //var self = this;

        var dvResizablePanelElem = $parentElem.find(".dvResizablePanel");

        var iframe = $("#frameEditing")[0];
        var iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

        var frameContent = $(iframeDoc).find("#Editor_contentIframe")[0];
        var contentDoc = frameContent.contentDocument || frameContent.contentWindow.document;
        var docBody = $(contentDoc).find("body");

        var dvDataElem = $(self.curTdEditingElem).find(".dvData");
        docBody.html(dvDataElem.html());

        dvResizablePanelElem.css("display", "block");
        dvResizablePanelElem.css("left", $(window).width() / 2 - dvResizablePanelElem[0].clientWidth / 2);
        dvResizablePanelElem.css("top", $(window).height() / 2 - dvResizablePanelElem[0].clientHeight / 2);

      },

        // rendering of the item
      renderItem: function (parentElem, item, parentId, marginLeft, isFiltered) {
        //var self = this;

        self.counterRenderedItems++;
        if (self.counterRenderedItems >= self.maxAmountRenderedItems)
          return;

        // hash item
        this.hashItems[item.id] = item;


        var row = new Row(this, item);
        return row.render({ elem: parentElem, id: parentId }, marginLeft, isFiltered);

      },

      // updating of opened nodes(and sub-nodes) - if we open node then pass through sub-nodes and open them if they were opened early
      updateOpenNodes: function (childItems) {
        if (typeof childItems == 'undefined')
          return;

        //
        for (var i = 0; i < childItems.length; i++) {
          this.openCloseNode(childItems[i].trElem, true);

          // children
          this.updateOpenNodes(childItems[i].children);
        }
      },

      // checking node(with sub-nodes)
      checkNode: function (item) {
        if (typeof item !== 'undefined') {
          if (item.isChecked)
            item.isChecked = false;
          else
            item.isChecked = true;

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
              this.checkNode(item.childrenHash[children[i].id]);
            }
          }
        }
      },

      // click on node
      clickNode: function (event) {
        //var self = event.data[0];
        //var trElem = event.data[1][0];
        if (!event || !event.data || event.data.length == 0)
          return;

        var trElem = event.data[0][0];

        //$(trElem).draggable();
        self.openCloseNode(trElem);
        $(trElem).mousedown();
      },

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

        // open-close node(parent with sub-nodes)
      openCloseNode: function (trElem, isNoChange) {
        if (!trElem)
          return;
        
        var self = this;

        var imgArrowElem = $(trElem).find(".imgArrow")[0];
        var imgFolderElem = $(trElem).find(".imgFolder")[0];

        var parentObj = self.hashParentItems[trElem.id];
        if (typeof parentObj !== 'undefined') {

          if (!isNoChange) { // if it's needed to change state
            if (parentObj.isOpened)
              parentObj.isOpened = false;
            else
              parentObj.isOpened = true;
          }

          var display = "none";
          if (parentObj.isOpened) { // is node is opened
            imgArrowElem.src = self.srcArrowDown;
            if (!parentObj.iconCustom || parentObj.iconCustom == '') {
              imgFolderElem.src = self.srcFolderOpen;
            }
            display = "table-row";
          } else { // is node is closed
            imgArrowElem.src = self.srcArrowRight;
            if (!parentObj.iconCustom || parentObj.iconCustom == '') {
              imgFolderElem.src = self.srcFolderClose;
            }
          }


          // child elements
          var childElems = [];
          self.getChildsWithParent(childElems, trElem.id, $(trElem).parent());

          if (parentObj.isOpened) { // Opened
            // request to server
            //self.requestGetItems(parentObj);
            if (parentObj.children) {
              if (childElems.length != 0) { // if do not exist - then create html-elems                
                $(childElems).remove();
              }
              for (var i = parentObj.children.length - 1; i >= 0; i--) {
                  var marginLeftVar = 10;
                  //if (marginLeft)
                  //  marginLeftVar += marginLeft;
                  var marginLeft = $(trElem).find(".dvFirst").css("margin-left");
                  if (marginLeft)
                    marginLeftVar += parseInt(marginLeft);

                  self.renderItem($(trElem), parentObj.childrenHash[parentObj.children[i].id], parentObj.id, marginLeftVar, self.isFiltered);
                }
              
              //else { // if html-elems exists - then show/hide them
              //  for (var i = 0; i < childElems.length; i++) {
              //    var trElem = childElems[i];
              //    var parentId = $(trElem).attr("parentId");
              //    parentObj = self.hashParentItems[parentId];

              //    var display = "none";
              //    if (parentObj.isOpened) {
              //      display = "table-row";
              //    }
              //    $(trElem).css("display", display);
              //  }
              //}

            }

          } else { // Closed
            $(childElems).css("display", "none");
          }
        }
        
        if (self.infoPanel)
          self.infoPanel.resizeInfoPanel();
      },

      addChildNode: function (newItem, isNodeUpdate) {
        if (!newItem || !newItem.parentObj)
          return;

        try {
          var parentItem = newItem.parentObj;
          var $trElem = $(parentItem.trElem);
          var marginLeftVar = 10;
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

      getChildsWithParent: function (childElems, parentId, parentElem) {
        var listElems;
        if ($(parentElem)[0].nodeName == "TBODY") {
          listElems = $(parentElem).find("tr[parentId='" + parentId + "']");
        } else if ($(parentElem)[0].nodeName == "TR") {
          listElems = $(parentElem).nextAll("tr[parentId='" + parentId + "']");
        }

        for (var i = 0; i < listElems.length; i++) {
          childElems.push(listElems[i]);
          this.getChildsWithParent(childElems, listElems[i].id, listElems[i]);
        }

      },


      //
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

      // correcting of header-column width
      correctHeaderColumnWidth: function () {
        var tableMain = $parentElem.find("#tbMain").find("tbody");
        var trHeader = tableMain.children().first();
        for (var i = 0; i < trHeader.children().length; i++) {
          var thElem = trHeader.children()[i];

          var colIndex = $(thElem).attr("colIndex");
          $parentElem.find("#tbHeader").find(".th-" + colIndex).css("width", thElem.clientWidth);
        }

        //// set table's height equal with component's height
        //var dvTableMainElem = $parentElem.find(".dvTableMain");
        //dvTableMainElem.css("height", $parentElem[0].clientHeight - $parentElem.find("#tbHeader")[0].clientHeight - 1);
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
        if (this.sortMethod == this.sortMethodEnum.ASC)
          treeItems.sort(this.sortAsc);
        else if (this.sortMethod == this.sortMethodEnum.DESC)
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

    };

    objTreeGrid.constructor();
    return objTreeGrid;
  };

});
