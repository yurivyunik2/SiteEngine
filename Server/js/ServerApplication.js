exports.ServerApplication = function (CONST, Utils) {

  var self;

  var itemMgr;
  var items;
  var itemsHash;

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
          // content ParentItems
          var contentItemID = CONST.CONTENT_ROOT_ID();
          contentParentItems = [];
          for (var i = 0; i < items.length; i++) {
            var item = items[i];
            itemsHash[item.id] = item;

            if (item.parentId === contentItemID) {
              contentParentItems.push(item);
            }
          }
          // finding SubItems for ContentParentItems
          for (var i = 0; i < contentParentItems.length; i++) {
            Utils.setChildItems(items, { parentItem: contentParentItems[i] });
          }
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