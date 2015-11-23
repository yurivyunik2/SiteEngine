
require(["application", "siteConst"], function (application, siteConst) {

  var servicesObj = {
    constructor: function () {
      var items = application.getItems();

      var linksContainerElem = $("#linksContainer");
      if (linksContainerElem.length > 0) {
        var services = [];
        var servicesItem = _.findWhere(items, { id: siteConst.SERVICES_ITEM_ID() });
        if (servicesItem && servicesItem.children) {
          _.each(servicesItem.children, function (child) {
            services.push(child);
          });
        }

        application.getItemGroupFields(services, function (itemsGroup) {
          if (itemsGroup) {
            linksContainerElem.html("");
            var templServiceItem = _.template($("#templServiceItem").html());
            _.each(servicesItem.children, function (item) {
              if (itemsGroup[item.id] && itemsGroup[item.id].fields) {
                var imageField = _.findWhere(itemsGroup[item.id].fields, { name: "Image" })
                if (imageField)
                  item.srcImage = imageField.value;
                var titleField = _.findWhere(itemsGroup[item.id].fields, { name: "Title" })
                if (titleField)
                  item.title = titleField.value;
                var infoField = _.findWhere(itemsGroup[item.id].fields, { name: "Info" })
                if (infoField)
                  item.info = infoField.value;
              }
              linksContainerElem.append(templServiceItem(item));
            });
          }

        });


      }

    },
  };
  servicesObj.constructor();
  return servicesObj;
});