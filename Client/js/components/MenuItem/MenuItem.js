require.config({
  paths: {
    menuItemCss: "js/components/MenuItem/MenuItem",
  },
});

//
// MeniItem
//
define(["application", "css!menuItemCss"], function (application) {

  var menuTestItems = [{
    id: 'menu_insert',
    img: 'images/insert.png',
    title: 'Insert',
    actionFunc: function () {
      //alert('i am add button');
    },
    subMenu: [
      {
        id: 'menu_insert_template',
        title: 'Insert from template',
        img: 'images/merge.png',
        actionFunc: function () {
          //alert('It will merge row');
        },
        subMenu: [
          //{
          //  id: 'sub1',
          //  title: 'sub1',
          //  img: 'images/merge.png',
          //},
          //{
          //  id: 'sub2',
          //  title: 'sub2',
          //  img: 'images/merge.png',
          //},
        ],
      }
    ],
  }, {
    id: 'menu_edit',
    img: 'images/edit.png',
    title: 'Edit',
    isVisible: function (dataItem) {
      if (!dataItem)
        return false;

      return application.isTemplateItem(dataItem);
    },
  }, {
    id: 'menu_copy',
    img: 'images/update.png',
    title: 'Copy',
  }, {
    id: 'menu_paste',
    img: 'images/paste.png',
    title: 'Paste',
  }, {
    id: 'menu_delete',
    img: 'images/delete.png',
    title: 'Delete',
  }
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

      insertTemplates: null,

      EVENT_CLICK_ITEM: function () { return "CLICK_ITEM"; },

      constructor: function () {
        this.className = "menuItem";

        self = this;

        //
        this.menuItems = this.clone(menuTestItems);

        MenuItem.index++;
        this.id = this.className + MenuItem.index;

        var html = self.getTemplateMenu(this.id);
        $('body').append(html);
        $firstMenu = $("#" + this.id);
        $firstMenu.focusout(function (event) {
          this.hide();
        });

        this.createMenu(this.menuItems, $firstMenu);

        hashMenuElems[$firstMenu.attr("id")] = $firstMenu;
      },
      
      getTemplateMenu: function (id) {
        return "<div id=" + id + " class='menuItem'></div>";
      },

      clone: function (obj) {
        var newObj;
        if(!$.isFunction(obj))
          newObj = _.clone(obj);
        else
          newObj = obj;
        var arKeys = _.keys(newObj);
        _.each(arKeys, function (key) {
          newObj[key] = self.clone(newObj[key]);
        });
        return newObj;
      },

      hasElem: function (childElem) {
        var isHas = false;
        _.each(hashMenuElems, function (menu) {
          isHas = isHas || menu.has(childElem).length > 0;
        });

        return isHas;
      },

      updateInsertOptions: function (insertTemplates) {
        if (!insertTemplates)
          return;

        this.menuItems = this.clone(menuTestItems);

        this.insertTemplates = insertTemplates;

        var arInsertMenuItem = _.where(this.menuItems, { id: "menu_insert" });
        if (arInsertMenuItem && arInsertMenuItem.length > 0) {
          var insertMenuItem = arInsertMenuItem[0];
          var subMenu = [];
          if(insertMenuItem.subMenu)
            _.extend(subMenu, insertMenuItem.subMenu);
          for (var i = 0; i < insertTemplates.length; i++) {
            var item = insertTemplates[i];
            
            subMenu.splice(0, 0, { id: "menu_template", title: item.name, item: item });
          }
          insertMenuItem.subMenu = subMenu;
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

          var htmlElem = "<li id='" + menuItem.id + "'>" + menuItem.title;
          if (menuItem.subMenu) {
            htmlElem += "<img class='imgArrow' src='./images/node-collapsed.png'>";
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
          $menuElem.find("li").click(self.clickItemEvent);
          $menuElem.find("li").mouseenter(self.hoverMenuItem);
        }

        return $ulElem;
      },

      findChildMenu: function ($parentMenu, childMenus) {
        if (!$parentMenu)
          return;

        var menuFound;
        _.each(hashMenuElems, function (menu) {
          if ($(menu).attr("parentId") && $(menu).attr("parentId") == $parentMenu.attr("id")) {
            menuFound = $(menu);
          }
        });
        if (menuFound) {
          childMenus.push(menuFound);
          self.findChildMenu(menuFound, childMenus);
        }
      },

      hoverMenuItem: function (event) {
        
        var $parentMenu = $(event.target).parents("div.menuItem");
        if ($parentMenu.length > 0) {
          var childMenus = [];
          self.findChildMenu($parentMenu, childMenus);

          _.each(childMenus, function (menu) {
            $(menu).css("display", "none");
          });
          var i = 0;
        }

        var itemFound = self.getItem(self.menuItems, event.target.id);
        if (!itemFound)
          return;

        var stIdElem = self.id + "_" + itemFound.id;
        var $idSubElem = $("#" + stIdElem);
        if ($idSubElem.length == 0 && itemFound.subMenu && itemFound.subMenu.length > 0) { // create elem

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

          var parentPosition = $(event.target).parents("div").position();
          var liPosition = $(event.target).position();

          var liWidth = event.target.clientWidth;
          //var liHeight = event.target.clientHeight;
          var left = parentPosition.left + liWidth;
          var top = parentPosition.top + liPosition.top;

          $idSubElem.css("left", left);
          $idSubElem.css("top", top);
          $idSubElem.show();
        } else {
          $idSubElem.hide();
        }
      },

      clickItemEvent: function (event) {

        self.hide();
        
        var actionType;
        var liElem = event.currentTarget;
        var dataEvent = {};
        switch (liElem.id) {
          case "menu_insert_template":
            {
              dataEvent.actionType = "insertFromTemplate";
              break;
            }
          case "menu_template":
            {
              dataEvent.actionType = "insertItem";
              if ($(liElem).attr("itemId")) {
                var itemId = $(liElem).attr("itemId");
                var arItems = _.where(self.insertTemplates, { id: parseInt(itemId) });
                if (arItems && arItems.length > 0)
                  dataEvent.item = arItems[0];
              }
              break;
            }
          case "menu_delete":
            {
              dataEvent.actionType = "deleteItem";
              break;
            }
          case "menu_edit":
            {
              dataEvent.actionType = "editItem";
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
