
var AppConfig = function () {
  var self;

  return {
    SERVER: {
      //PORT: function () { return 1221; },
      PORT: function () { return 80; },
      //HOST: function () { return "localhost"; },
      HOST: function () { return "178.151.211.118"; },
    },
  };
};

if (typeof exports != "undefined") {
  exports.AppConfig = AppConfig;
}

if (typeof define != "undefined") {
  define([], function () {
    return (new AppConfig());
  });
}