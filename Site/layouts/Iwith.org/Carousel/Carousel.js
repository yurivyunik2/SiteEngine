
require.config({
  paths: {
    bxSlider: "/SiteEngine/Site/lib/jquery.bxslider/jquery.bxslider",
  },
});

require(["application", "siteConst", "bxSlider", "css!bxSlider"], function (application, siteConst) {

  var headerObj = {
    constructor: function () {

      $('.dvSlider').bxSlider({
        slideWidth: screen.width,
        minSlides: 1,
        maxSlides: 1,
        //slideMargin: 10
      });
      $('.bx-viewport').css("left", "0px");
      return;


      var items = application.getItems();

      var ulMenuElem = $(".dvMenu").find("ul");
      if (ulMenuElem.length > 0) {
        var headerItems = [];
        var headerMenuItem = _.findWhere(items, { id: siteConst.HEADER_MENU_ITEM_ID() });
        if (headerMenuItem && headerMenuItem.children) {
          _.each(headerMenuItem.children, function (child) {
            headerItems.push(child);
          });
        }

        application.getItemGroupFields(headerItems, function (itemsGroup) {
          if (itemsGroup) {
            ulMenuElem.html("");
            var templMenuItem = _.template($("#templMenuItem").html());
            _.each(headerMenuItem.children, function (item) {
              if (itemsGroup[item.id] && itemsGroup[item.id].fields) {
                var pathField = _.findWhere(itemsGroup[item.id].fields, { name: "Path" })
                if (pathField)
                  item.pathField = pathField.value;
              }
              ulMenuElem.append(templMenuItem(item));
            });

          }

        });


      }

    },
  };
  headerObj.constructor();
  return headerObj;
});