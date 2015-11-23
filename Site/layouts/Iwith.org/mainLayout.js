
require.config({
  paths: {
    contentArea: "/SiteEngine/Site/layouts/Iwith.org/ContentArea/ContentArea",
    header: "/SiteEngine/Site/layouts/Iwith.org/Header/Header",
    carousel: "/SiteEngine/Site/layouts/Iwith.org/Carousel/Carousel",
    services: "/SiteEngine/Site/layouts/Iwith.org/Services/Services",
    headerMenu: "/SiteEngine/Site/layouts/Iwith.org/HeaderMenu/HeaderMenu",
    footer: "/SiteEngine/Site/layouts/Iwith.org/Footer/Footer",

    //bxSlider: "/SiteEngine/Site/lib/jquery.bxslider/jquery.bxslider",
    siteConst: "/SiteEngine/Site/layouts/Iwith.org/SiteConst",
    appCtrl: "/SiteEngine/Site/layouts/Iwith.org/appCtrl/appCtrl",
  },
});

//require(["bxSlider", "css!bxSlider", "contentArea", "header", "headerMenu", "footer", "appCtrl"], function () {

//});

require(["appCtrl", "header", "carousel", "services"], function () {

  });