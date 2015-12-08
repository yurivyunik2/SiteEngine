
require(["application", "siteConst"], function (application, siteConst) {
  var appCtrlObj = function () {
    var self;

    var isAnimate = false;

    var loadedComponents = {};

    var obj = {
      constructor: function () {

        console.log("appCtrl: ", new Date(Date.now()));

        $(document).ready(function () {

          $(".tdLanguage").click(function (event) {
            if ($("#languageMenu").css("display") === "block") {
            }
            else
              $("#languageMenu").show();
          });

          $(window).mousedown(function () {
            $("#languageMenu").hide();
          });

        });

        $(window).scroll(function () {
          var opacity = 0;
          if ($(window).scrollTop() > 0) {
            opacity = 0.4;
          }

          $("#scrollToTop").stop();
          $("#scrollToTop").animate({
            //width: '150px',
            opacity: opacity
          }, 500, function () {
            
          });
        });

        $("#scrollToTop").click(function (event) {
          $("html,body").animate({
            scrollTop: 0
          }, 400);
        });
        
      },

      setLoadedComponent: function (component, isLoaded) {
        if (!component)
          return;
        loadedComponents[component] = isLoaded;
      },

      isApplicationLoaded: function () {
        return (loadedComponents["header"] && loadedComponents["carousel"] && loadedComponents["news"] && loadedComponents["services"]);
      },
    };
    obj.constructor();
    return obj;
  };
  
  return appCtrlObj();
});
