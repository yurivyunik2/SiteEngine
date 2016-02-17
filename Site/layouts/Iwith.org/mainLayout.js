
require.config({
  paths: {
    bxSlider: "/SiteEngine/Site/lib/jquery.bxslider/jquery.bxslider",
  },
});

require(["Utils", "bxSlider", "css!bxSlider"], function (Utils) {

  var mainLayout = {
    constructor: function () {
      console.log("mainLayout");

      this.init();
    },

    init: function () {
      //
      $('.dvSlider').bxSlider({
        slideWidth: screen.width,
        minSlides: 1,
        maxSlides: 1,
        //slideMargin: 10
      });
      $('.bx-viewport').css("left", "0px");

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

      //
      this.initCallback();
    },

    initCallback: function () {
      Utils.setLoadingApplication(false);
    },
  };

  mainLayout.constructor();
  return mainLayout;
});