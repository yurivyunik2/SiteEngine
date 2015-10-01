exports.ServerApplication = function (CONST, Utils) {

  var self;

  var itemMgr;
  var itemsCash;

  var contentParentItems;

  var lastUpdateItemsCash = Date.now();
  var intervalUpdateItemsCash= 60 * 1000; // 60 sec

  var serverApplicationObj = {
    constructor: function() {
      self = this;
    },

    update: function () {
      // updating of itemsCash
      if (!itemsCash || (Date.now() - lastUpdateItemsCash) > intervalUpdateItemsCash) {
        self.updateItemsCash();
      }
    },

    updateItemsCash: function (data, objResponse, callback) {
      lastUpdateItemsCash = Date.now();
      if (!data)
        data = {};
      if(!objResponse)
        objResponse = {};
      itemMgr.getItems(data, objResponse, function () {
        if (!objResponse.notAllItems) {
          if (objResponse && objResponse.data) {
            itemsCash = objResponse.data;
          } else {
            itemsCash = [];
          }
          // content ParentItems
          var contentItemID = CONST.CONTENT_ROOT_ID();
          contentParentItems = [];
          for (var i = 0; i < itemsCash.length; i++) {
            var item = itemsCash[i];
            if (item.parent === contentItemID) {
              contentParentItems.push(item);
            }
          }
          // finding SubItems for ContentParentItems
          for (var i = 0; i < contentParentItems.length; i++) {
            Utils.findChildItems(itemsCash, { parentItem: contentParentItems[i] });
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

    getItemsCash: function() {
      return itemsCash;
    },

    getContentParentItems: function() {
      return contentParentItems;
    },

  };
  serverApplicationObj.constructor();
  return serverApplicationObj;
}