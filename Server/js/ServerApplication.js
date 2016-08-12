exports.ServerApplication = function (CONST, Utils) {
  var _ = require('underscore');
  var self;

  var itemMgr;
  var items;
  var itemsHash;
  var parentItems;

  var contentParentItems;

  var isNeedUpdateItems = false;
  var lastUpdateItems = Date.now();

  var intervalUpdateFunc = 1000; // 1 sec
  var intervalUpdateItems = 60 * 1000; // 60 sec

  var serverApplicationObj = {
    constructor: function() {
      self = this;

      setInterval(function() {
        self.update();
      }, intervalUpdateFunc);
    },

    setIsNeedUpdateItems: function() {
      isNeedUpdateItems = true;
    },

    update: function () {
      // updating of items
      //if (!items || isNeedUpdateItems || (Date.now() - lastUpdateItems) > intervalUpdateItems) {
      if (!items || isNeedUpdateItems) {
        isNeedUpdateItems = false;
        self.updateItems();
      }
    },

    updateItems: function (data, objResponse, callback) {
      lastUpdateItems = Date.now();
      if (!data)
        data = {};
      if(!objResponse)
        objResponse = {};
      itemMgr.getItems(data, objResponse, function () {
        if (!objResponse.notAllItems) {
          if (objResponse && objResponse.data) {
            items = objResponse.data;
          } else {
            items = [];
          }
          itemsHash = {};
          parentItems = {};
          // content ParentItems
          var contentItemId = CONST.CONTENT_ROOT_ID();
          contentParentItems = [];
          for (var i = 0; i < items.length; i++) {
            var item = items[i];
            item.childs = [];
            itemsHash[item.id] = item;

            if (!parentItems[item.parentId]) {
              parentItems[item.parentId] = {
                childs: []
              };
            }
            parentItems[item.parentId].childs.push(item);

            if (item.parentId === contentItemId) {
              contentParentItems.push(item);
            }
          }

          var parentIds = _.keys(parentItems);
          _.each(parentIds, function(parentId) {
            if (itemsHash[parentId]) {
              itemsHash[parentId].childs = parentItems[parentId].childs;
            }
          });

        }
        if (callback)
          callback();
      });
    },

    setItemMgr: function(_itemMgr) {
      if (_itemMgr)
        itemMgr = _itemMgr;
    },

    getItems: function() {
      return items;
    },
    getItemsHash: function () {
      return itemsHash;
    },

    getContentParentItems: function() {
      return contentParentItems;
    },

  };
  serverApplicationObj.constructor();
  return serverApplicationObj;
}