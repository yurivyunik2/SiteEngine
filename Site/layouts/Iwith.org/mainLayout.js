
require.config({
  paths: {
    contentArea: "/SiteEngine/Site/layouts/Iwith.org/ContentArea/ContentArea",
    header: "/SiteEngine/Site/layouts/Iwith.org/Header/Header",
    headerMenu: "/SiteEngine/Site/layouts/Iwith.org/HeaderMenu/HeaderMenu",
    footer: "/SiteEngine/Site/layouts/Iwith.org/Footer/Footer",
    
    siteConst: "/SiteEngine/Site/layouts/Iwith.org/SiteConst",
    appCtrl: "/SiteEngine/Site/layouts/Iwith.org/appCtrl/appCtrl",
  },
});

require(["contentArea", "header", "headerMenu", "footer", "appCtrl"], function () {

});
