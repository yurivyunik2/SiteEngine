require.config({
  paths: {
    SiteConst: "/SiteEngine/Site/js/siteConst",
  },
});

define(["application", "Utils", "SiteConst"], function (application, Utils, SiteConst) {

  var SiteInitialization = function () {

    var self;
    var isItemsBound = false;
    var itemsGroup = null;

    var siteInitialization = {
      constructor: function() {
        self = this;

      },
      
      isItemsBound: function () {
        return isItemsBound;
      },

      bindItems: function ($scope, items) {
        var contentItems = application.getContentItems();
        var itemsRequest = [];
        _.each(contentItems, function (item) {
          if (item.name) {
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
        //binding items to "$scope"
        _.each(itemsRequest, function(item) {
          if (item.name) {
            $scope[item.name] = item;
            if (item.parentObj)
              $scope[item.parentObj.name + "_" + item.name] = item;
          }
        });

        application.getItemGroupFields(itemsRequest, function (_itemsGroup) {
          itemsGroup = _itemsGroup;
          self.bindItemFields();
          isItemsBound = true;
        });
      },

      bindItemFields: function () {
        if (!itemsGroup)
          return;

        var itemsHash = application.getItemsHash();
        var curLang = Utils.getLanguageCurrent();
        var defaultLang = Utils.getLanguageDefault();
        _.each(itemsGroup, function (item) {
          if (item.id) {
            var itemHash = itemsHash[item.id];
            if (itemHash) {
              itemHash.fields = item.fields;
              var fieldNames = [];
              _.each(itemHash.fields, function (field) {
                if (field.name && fieldNames.indexOf(field.name) < 0) {
                  fieldNames.push(field.name);
                }
              });

              _.each(fieldNames, function (name) {
                var field = _.findWhere(item.fields, { name: name, lang: curLang.code, isPublish: 1 });
                if (!field) {
                  field = _.findWhere(item.fields, { name: name, lang: defaultLang.code, isPublish: 1 });
                }
                if (field) {
                  itemHash[field.name] = field.value;
                }
              });

            }
          }
        });

      },

    };
    siteInitialization.constructor();
    return siteInitialization;
  };

  return SiteInitialization();
});