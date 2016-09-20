
var AppConfig = function () {
  var self;

  return {
    SERVER: {
      //PORT: function () { return 1221; },
      PORT: function () { return 80; },
      //HOST: function () { return "localhost"; },
      HOST: function () { return "46.98.145.74"; },
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