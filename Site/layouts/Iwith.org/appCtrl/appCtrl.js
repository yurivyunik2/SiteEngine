
require(["application", "siteConst"], function (application, siteConst) {
  var appCtrlObj = function () {
    var self;

    var isAnimate = false;

    var obj = {
      constructor: function () {
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
