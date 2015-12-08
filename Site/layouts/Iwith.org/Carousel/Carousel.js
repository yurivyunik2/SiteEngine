
require.config({
  paths: {
    bxSlider: "/SiteEngine/Site/lib/jquery.bxslider/jquery.bxslider",
  },
});

require(["application", "siteConst", "appCtrl", "bxSlider", "css!bxSlider"], function (application, siteConst, appCtrl) {

  var carouselObj = {
    constructor: function () {

      //var t = appCtrl.isApplicationLoaded();

      var items = application.getItems();

      var dvSliderElem = $(".dvSlider");
      if (dvSliderElem.length > 0) {
        var carouselItems = [];
        var carouselItem = _.findWhere(items, { id: siteConst.CAROUSEL_ITEM_ID() });
        if (carouselItem && carouselItem.children) {
          _.each(carouselItem.children, function (child) {
            carouselItems.push(child);
          });
        }

        application.getItemGroupFields(carouselItems, function (itemsGroup) {
          if (itemsGroup) {
            dvSliderElem.html("");
            var templCarouselItem = _.template($("#templCarouselItem").html());
            _.each(carouselItem.children, function (item) {
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
              dvSliderElem.append(templCarouselItem(item));
            });

            //
            $('.dvSlider').bxSlider({
              slideWidth: screen.width,
              minSlides: 1,
              maxSlides: 1,
              //slideMargin: 10
            });
            $('.bx-viewport').css("left", "0px");
          }

        });


      }

    },
  };
  carouselObj.constructor();
  return carouselObj;
});