
define([], function () {

  return (function() {

    var self;

    var notification = {
      ERROR: function() { return "error"; },
      INFO: function() { return "info"; },
      WARNING: function() { return "warning"; },

      constructor: function() {
        self = this;

        var $elem = $("<div></div>");
        $elem.load("/SiteEngine/Client/Views/forms/notificationForm/notification.html", function () {
          $("body").append($elem);
        });
      },

      show: function(type, message) {
        if (!type || !message || message == "")
          return;

        var imgSrc;
        switch (type) {
        case self.ERROR():
          {
            imgSrc = "./images/notification/error.png";
            break;
          }
        case self.WARNING():
          {
            imgSrc = "./images/notification/warning.png";
            break;
          }
        default:
          {
            imgSrc = "./images/notification/info.png";
            break;
          }
        }

        var $dvNotificationFormElem = $(".dvNotificationForm");
        $dvNotificationFormElem.find("img").attr("src", imgSrc);

        $(".dvNotificationForm").find(".dvMessage").html(message);

        $dvNotificationFormElem.css({ display: "block", opacity: 0 });
        $(".dvNotificationForm").animate({
          opacity: 1,
        }, 300);

        $dvNotificationFormElem.mousedown(function (ev) {
          ev = ev || window.event;
          if (ev.which === 3) {
            self.hide();
          }
        });

        setTimeout(function() {
          self.hide(true);
        }, 2500);
      },

      hide: function(isAnimate) {
        var $dvNotificationFormElem = $(".dvNotificationForm");
        if (isAnimate) {
          $(".dvNotificationForm").animate({
            opacity: 0,
          }, "slow");
        } else {
          $(".dvNotificationForm").css("opacity", 0);
        }
      },
    };
    notification.constructor();
    return notification;
  })();

});