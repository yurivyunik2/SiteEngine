require.config({
  paths: {
    menuItemCss: "js/components/MenuItem/MenuItem",
  },
});

//
// MeniItem
//
define(["application", "Utils", "css!menuItemCss"], function (application, Utils) {

  var menuTestItems = [{
    id: 'menu_addNew',
    img: 'images/addNew.png',
    title: 'Add',
    actionFunc: function () {
      //alert('i am add button');
    },
    subMenu: [
      {
        id: 'addNewFromTemplate',
        title: 'Add from template',
        img: 'images/merge.png',
        isVisible: function (dataItem) {
          if (!dataItem)
            return false;

          return !application.isTemplateItem(dataItem);
        },
        actionFunc: function () {
          //alert('It will merge row');
        },
        //subMenu: [
        //  {
        //    id: 'sub1',
        //    title: 'sub1',
        //    img: 'images/merge.png',
        //  },
        //  {
        //    id: 'sub2',
        //    title: 'sub2',
        //    img: 'images/merge.png',
        //  },
        //],
      }
    ],
  }, {
    id: 'editItem',
    img: 'images/edit.png',
    title: 'Edit',
    isVisible: function (dataItem) {
      if (!dataItem)
        return false;

      return application.isTemplateItem(dataItem);
    },
  }, {
    id: 'menu_copy',
    img: 'images/copy.png',
    title: 'Copy',
    subMenu: [
        {
          id: 'copyItem',
          title: 'Copy',
          img: 'images/copy.png',
          actionFunc: function () {
            //alert('It will merge row');
          },
        }, {
          id: 'copyItemTo',
          title: 'Copy to',
          img: 'images/copy_to.png',
          actionFunc: function () {
            //alert('It will merge row');
          },
        }
    ],
  }, {
    id: 'moveItemTo',
    img: 'images/moveTo.png',
    title: 'Move to',
  }, {
    id: 'deleteItem',
    img: 'images/delete.png',
    title: 'Delete',
  }, {
    id: 'renameItem',
    img: 'images/rename.png',
    title: 'Rename',
  },
  //{
  //  id: 'refreshItem',
  //  img: 'images/refresh.png',
  //  title: 'Refresh',
  //},
  ];

  MenuItem.index = 0;
  function MenuItem(menuItems) {

    var self;
    
    var hashMenuElems = {};

    var $firstMenu;

    var dataItem;

    var obj = {

      id: '',

      menuItems: null,

      arTemplatesNew: null,

      EVENT_CLICK_ITEM: function () { return "CLICK_ITEM"; },

      constructor: function () {
        this.className = "menuItem";

        self = this;

        //
        this.menuItems = Utils.clone(menuTestItems);

        MenuItem.index++;
        this.id = this.className + MenuItem.index;

        var html = self.getTemplateMenu(this.id);
        $('body').append(html);
        $firstMenu = $("#" + this.id);
        $firstMenu.focusout(function (event) {
          self.hide();
        });

        this.createMenu(this.menuItems, $firstMenu);

        hashMenuElems[$firstMenu.attr("id")] = $firstMenu;
      },
      
      getTemplateMenu: function (id) {
        return "<div id=" + id + " class='menuItem'></div>";
      },

      hasElem: function (childElem) {
        var isHas = false;
        _.each(hashMenuElems, function (menu) {
          isHas = isHas || menu.has(childElem).length > 0;
        });

        return isHas;
      },

      updateTemplatesNewItems: function (arTemplatesNew) {
        if (!arTemplatesNew)
          return;

        this.menuItems = Utils.clone(menuTestItems);

        this.arTemplatesNew = arTemplatesNew;

        var arTemlatesNewMenuItem = _.where(this.menuItems, { id: "menu_addNew" });
        if (arTemlatesNewMenuItem && arTemlatesNewMenuItem.length > 0) {
          var templatesNewMenuItem = arTemlatesNewMenuItem[0];
          var subMenu = [];
          if (templatesNewMenuItem.subMenu)
            _.extend(subMenu, templatesNewMenuItem.subMenu);
          for (var i = 0; i < arTemplatesNew.length; i++) {
            var item = arTemplatesNew[i];
            
            subMenu.splice(0, 0, { id: "addNewItem", title: item.name, item: item });
          }
          templatesNewMenuItem.subMenu = subMenu;
        }
      },

      getItem: function (items, id) {
        var itemFound;
        for (var i = 0; i < items.length; i++) {
          var item = items[i];
          if (item.id === id)
            itemFound = item;
          else if (item.subMenu) {
            itemFound = self.getItem(item.subMenu, id);
          }
          if (itemFound)
            return itemFound;
        }

        return null;
      },

      createMenu: function (menuItems, $menuElem, dataItem) {

        var $ulElem = $("<ul></ul>");
        _.each(menuItems, function (menuItem) {
          if (menuItem.isVisible && !menuItem.isVisible(dataItem)) {
            return;
          }

          if (menuItem.id === "menu_addNew") {
            var isSubItemVisible = false;
            if (menuItem.subMenu) {
              _.each(menuItem.subMenu, function(item) {
                if (!item.isVisible || item.isVisible()) {
                  isSubItemVisible = true;
                }
              });
            }
            if (!isSubItemVisible)
              return;
          }
          

          var htmlElem = "<li id='" + menuItem.id + "'><div class='dvTitle'>" + menuItem.title + "</div>";
          if (menuItem.subMenu) {
            htmlElem += "<div class='dvImg'><img class='imgArrow' src='./images/node-collapsed.png'></div>";
          }
          htmlElem += "</li>";
          var $liElem = $(htmlElem);
          if (menuItem.item && menuItem.item.id) {
            $liElem.attr("itemId", menuItem.item.id);
          }
          $ulElem.append($liElem);
        });

        if ($menuElem) {
          $menuElem.html($ulElem);
          var arLi = $menuElem.find("li");
          _.each(arLi, function (li) {
            //li.onclick = self.clickItemEvent;
            li.onmousedown = self.clickItemEvent;
            li.onmouseenter = self.hoverMenuItem;
          });
          //$menuElem.find("li").click(self.clickItemEvent);
          //$menuElem.find("li").mouseenter(self.hoverMenuItem);
        }

        return $ulElem;
      },

      findChildMenu: function ($parentMenu, childMenus) {
        if (!$parentMenu)
          return;

        var menuFound;
        var arFound = [];
        _.each(hashMenuElems, function (menu) {
          if ($(menu).attr("parentId") && $(menu).attr("parentId") === $parentMenu.attr("id")) {
            arFound.push($(menu));
          }
        });
        _.each(arFound, function (menuFound) {
          childMenus.push(menuFound);
          self.findChildMenu(menuFound, childMenus);
        });        
      },

      hoverMenuItem: function (event) {
        
        var $parentMenu = $(event.target).parents("div.menuItem");
        if ($parentMenu.length > 0) {
          var childMenus = [];
          self.findChildMenu($parentMenu, childMenus);

          _.each(childMenus, function (menu) {
            $(menu).css("display", "none");
          });          
        }

        var itemFound = self.getItem(self.menuItems, event.target.id);
        if (!itemFound)
          return;

        var stIdElem = self.id + "_" + itemFound.id;
        var $idSubElem = $("#" + stIdElem);
        if ($idSubElem.length === 0 && itemFound.subMenu && itemFound.subMenu.length > 0) { // create elem

          var stParentMenuId = "";
          var $parentMenu = $(event.target).parents("div.menuItem");
          if ($parentMenu.length > 0) {
            stParentMenuId = "parentId='" + $parentMenu[0].id + "'";
          }

          var html = "<div " + stParentMenuId + " + id='" + stIdElem + "' class='menuItem'> \
            </div>";
          
          $("body").append(html);
          $idSubElem = $("#" + stIdElem);
          hashMenuElems[stIdElem] = $idSubElem;
        }
        
        if (itemFound.subMenu) {
          self.createMenu(itemFound.subMenu, $idSubElem);

          var $parentDiv = $(event.target).parents("div");
          if ($parentDiv.length > 0) {
            var parentPosition = $parentDiv.position();
            var liPosition = $(event.target).position();

            var liWidth = event.target.clientWidth;
            //var liHeight = event.target.clientHeight;
            var left = parentPosition.left + liWidth;
            var top = parentPosition.top + liPosition.top;

            $idSubElem.css("left", left);
            $idSubElem.css("top", top);
            $idSubElem.show();
          }
        } else {
          $idSubElem.hide();
        }
      },

      clickItemEvent: function (event) {
        self.hide();
        
        var liElem = event.currentTarget;
        var dataEvent = {
          isNotification: true,
        };
        dataEvent.actionType = liElem.id;
        switch (liElem.id) {
          //case "menu_addNew_template":
          //  {
          //    dataEvent.actionType = "addNewFromTemplate";
          //    break;
          //  }
          case "addNewItem":
            {
              
              if ($(liElem).attr("itemId")) {
                var itemId = $(liElem).attr("itemId");
                var arItems = _.where(self.arTemplatesNew, { id: parseInt(itemId) });
                if (arItems && arItems.length > 0)
                  dataEvent.item = arItems[0];
              }
              break;
            }
          default:
            {
              break;
            }
        }
        

        if (dataEvent.actionType) {
          $(self).trigger(self.EVENT_CLICK_ITEM(), dataEvent);
        }
      },

      show: function (x, y, _dataItem) {
        dataItem = _dataItem;

        self.createMenu(self.menuItems, $firstMenu, dataItem);

        $firstMenu.css("left", x);
        $firstMenu.css("top", y);

        $firstMenu.show();
        $firstMenu.focus();
      },

      hide: function () {
        _.each(hashMenuElems, function ($menu) {
          $menu.css("display", "none");
        });
      },

    };

    obj.constructor();
    return obj;

  };

  return MenuItem;

});
