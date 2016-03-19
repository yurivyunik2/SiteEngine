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
        var contentItems = application.getContentItems();
        var itemsRequest = [];
        _.each(contentItems, function (item) {
          if (item.name) {
            $scope[item.name] = item;
            if (item.parentObj)
              $scope[item.parentObj.name + "_" + item.name] = item;
            itemsRequest.push(item);
            if (item.children && item.children.length > 0) {
              Utils.findChildItems(itemsRequest, item);
            }
          }
        });

        // additional items
        var itemNamesId = SiteConst.getItemNamesId();
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