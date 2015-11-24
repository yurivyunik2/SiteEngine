
require.config({
  paths: {
    header: "/SiteEngine/Site/layouts/Iwith.org/Header/Header",
    carousel: "/SiteEngine/Site/layouts/Iwith.org/Carousel/Carousel",
    services: "/SiteEngine/Site/layouts/Iwith.org/Services/Services",
    news: "/SiteEngine/Site/layouts/Iwith.org/News/News",

    //headerMenu: "/SiteEngine/Site/layouts/Iwith.org/HeaderMenu/HeaderMenu",
    //footer: "/SiteEngine/Site/layouts/Iwith.org/Footer/Footer",

    bxSlider: "/SiteEngine/Site/lib/jquery.bxslider/jquery.bxslider",
    siteConst: "/SiteEngine/Site/layouts/Iwith.org/SiteConst",
    appCtrl: "/SiteEngine/Site/layouts/Iwith.org/appCtrl/appCtrl",
  },
});

//require(["bxSlider", "css!bxSlider", "contentArea", "header", "headerMenu", "footer", "appCtrl"], function () {

//});

require(["Utils", "appCtrl", "bxSlider", "header", "carousel", "services", "news"], function (Utils) {

  console.log("mainLayout: ", new Date(Date.now()));

  Utils.setLoadingApplication(true);

});