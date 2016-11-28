
var AppConfig = function () {
  var self;
  var processPort;

  return {
    SERVER: {
      //PORT: function () { return 1221; },
      SetProcessPort: function(port) { processPort = port; },
      //PORT: function () { return processPort || 8088; },
      PORT: function () { return processPort || 80; },
      HOST: function () { return "localhost"; },
      //HOST: function () { return "178.151.211.118"; },
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