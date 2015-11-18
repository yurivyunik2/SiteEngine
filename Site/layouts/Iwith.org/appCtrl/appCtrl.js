
require(["application", "siteConst"], function (application, siteConst) {
  var appCtrlObj = function () {
    var self;

    var isAnimate = false;

    var obj = {
      constructor: function () {

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

          $('.dvSlider').bxSlider({
            slideWidth: screen.width,
            minSlides: 1,
            maxSlides: 1,
            //slideMargin: 10
          });
          $('.bx-viewport').css("left", "0px");


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
    };
    obj.constructor();
    return obj;
  };
  
  return appCtrlObj();
});
