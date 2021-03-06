﻿require.config({
  paths: {
    jquery: "js/lib/jquery-1.11.3",
    jqueryUi: "js/lib/jquery-ui/jquery-ui",
    underscore: "js/lib/underscore",
    bootstrap: "js/lib/bootstrap/bootstrap",
    angular: "js/lib/angular/angular",
    angularRoute: "js/lib/angular-route/angular-route",

    
    AppConfig: "/SiteEngine/Common/appConfig",
    routing: "routing",
    application: "js/application",
    CONST: "/SiteEngine/Common/Const",
    notification: "Views/forms/notificationForm/notification",
    CommonTypes: "js/Common/CommonTypes",
    Utils: "/SiteEngine/Common/Utils",
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
    underscore: ["jquery"],

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
      
    //var test = CONST2.TEMPLATES_ROOT_ID();
    // bootstrap the app manually
    angular.bootstrap(document, [CONST.APPLICATION_NAME()]);
  });

});