require.config({
  paths: {
    SiteConst: "/SiteEngine/Site/js/siteConst",
  },
});

define(["application", "Utils", "SiteConst"], function (application, Utils, SiteConst) {

  var SiteInitialization = function () {

    var self;
    var isItemsBound = false;

    return {
      constructor: function(){},

      bindItems: function ($scope, items) {
        var itemNamesId = SiteConst.getItemNamesId();
        var itemsRequest = [];
        var itemNames = _.keys(itemNamesId);
        _.each(itemNames, function (name) {
          var id = itemNamesId[name];
          if (items[id]) {
            var item = items[id];
            $scope[name] = item;
            itemsRequest.push(item);
            if (item.children && item.children.length > 0) {
              var allChildren = [];
              Utils.findChildItems(itemsRequest, item);
            }
          }
        });

        application.getItemGroupFields(itemsRequest, function (itemsGroup) {
          isItemsBound = true;
        });
      },

      isItemsBound: function () {
        return isItemsBound;
      },

    };
  };

  return SiteInitialization();
});