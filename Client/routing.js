
require.config({
  paths: {
    tabPanel: "js/components/TabPanel/tabPanel",
    startCtrl: "js/controllers/startCtrl",
    loginCtrl: "js/controllers/login/loginCtrl"
  },
});

define([
	"angular",
	"angularRoute",
  "CONST",
  "startCtrl",
  "loginCtrl",
  "tabPanel"	
], function (angular, angularRoute, CONST, startCtrl, loginCtrl) {
  "use strict";

  return angular.module(CONST.APPLICATION_NAME(), ["ngRoute"])
	.config(["$routeProvider", function ($routeProvider) {
	  $routeProvider.when("#", {
	    //redirectTo: "#/Views/start"
	    templateUrl: "/SiteEngine/Client/js/controllers/login/login.html",
	    controller: "LoginCtrl"
	  })
	    .when("/Views/start", {	    
	    templateUrl: "." + CONST.APPLICATION_START_VIEW() + ".html",
	    controller: "StartCtrl"
	    })
	    .when("/login", {	      
	      templateUrl: "/SiteEngine/Client/js/controllers/login/login.html",
	      controller: "LoginCtrl"
	    })
	    .otherwise({ redirectTo: CONST.APPLICATION_START_VIEW() });

	}])
	.controller("StartCtrl", ["$scope", "$http", "$window", startCtrl])
  .controller("LoginCtrl", ["$scope", "$http", "$window", loginCtrl]);

});
