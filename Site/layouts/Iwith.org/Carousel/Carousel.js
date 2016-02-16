
require.config({
  paths: {
    bxSlider: "/SiteEngine/Site/lib/jquery.bxslider/jquery.bxslider",
  },
});

require(["application", "siteConst", "appCtrl", "bxSlider", "css!bxSlider"], function (application, siteConst, appCtrl) {

  var carouselObj = {
    constructor: function () {
      setTimeout(function () {
        //
        $('.dvSlider').bxSlider({
          slideWidth: screen.width,
          minSlides: 1,
          maxSlides: 1,
          //slideMargin: 10
        });
        $('.bx-viewport').css("left", "0px");

      }, 1000);

    },
  };
  carouselObj.constructor();
  return carouselObj;
});