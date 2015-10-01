
var AppConfig = function () {
  var self;

  return {
    SERVER: {
      PORT: function () { return 80; },
      HOST: function () { return "localhost"; },
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