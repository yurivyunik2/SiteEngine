require.config({
  paths: {
    jquery: "js/lib/jquery-1.11.3",
    jqueryUi: "js/lib/jquery-ui/jquery-ui",
    underscore: "js/lib/underscore",
    bootstrap: "js/lib/bootstrap/bootstrap",
    angular: "js/lib/angular/angular",
    angularRoute: "js/lib/angular-route/angular-route",

    routing: "routing",
    application: "js/application",
    CONST: "js/const",
    notification: "Views/forms/notificationForm/notification",
    dataType: "js/Common/DataType",
    Utils: "js/Common/Utils",
  },
    shim: {
    angular: { "exports": "angular" },
    angularRoute: ["angular"],

    bootstrap: ["jquery"],
    jquery: {
      exports: "jQuery"
    },
    
    jqueryUi: ["jquery"],
    routing: ["jquery", "underscore"],
    //notificationFormCtrl: {
    //  exports: "NotificationFormCtrl"
    //},

    contextMenu: ["jquery"],
  },
  map: {
    "*": {
      "css": "js/lib/require-css/css",      
    }
  },
});

require(["jquery",          
          "angular",
          "CONST",
          "jqueryUi",
          "css!jqueryUi",
          "routing",
          "bootstrap",
          "css!bootstrap"],
function ($, angular, CONST) {
  "use strict";
  
  angular.element().ready(function () {
    // bootstrap the app manually
    angular.bootstrap(document, [CONST.APPLICATION_NAME()]);
  });

});