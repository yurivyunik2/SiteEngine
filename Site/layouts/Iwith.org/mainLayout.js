
require.config({
  paths: {
    //header: "/SiteEngine/Site/layouts/Iwith.org/Header/Header",
    carousel: "/SiteEngine/Site/layouts/Iwith.org/Carousel/Carousel",
    services: "/SiteEngine/Site/layouts/Iwith.org/Services/Services",
    news: "/SiteEngine/Site/layouts/Iwith.org/News/News",

    bxSlider: "/SiteEngine/Site/lib/jquery.bxslider/jquery.bxslider",
    siteConst: "/SiteEngine/Site/layouts/Iwith.org/SiteConst",
    appCtrl: "/SiteEngine/Site/layouts/Iwith.org/appCtrl/appCtrl",
  },
});

require(["Utils", "appCtrl", "bxSlider", "carousel", "services", "news"], function (Utils, appCtrl) {

  //var idInterval = setInterval(function () {
  //  if (appCtrl.isApplicationLoaded()) {
  //    clearInterval(idInterval);
  //    Utils.setLoadingApplication(false);
  //  }
  //}, 10);

});