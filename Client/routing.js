
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
	//"Views/start"
], function (angular, angularRoute, CONST, startCtrl, loginCtrl) {
  "use strict";

  return angular.module(CONST.APPLICATION_NAME(), ["ngRoute"])
	.config(["$routeProvider", function ($routeProvider) {
	  $routeProvider.when("#", {
	      //templateUrl: "." + CONST.APPLICATION_START_VIEW() + ".html",
	      //controller: "StartCtrl"
	    //redirectTo: CONST.APPLICATION_START_VIEW() + "1"
	    //redirectTo: "#/Views/start"
	    templateUrl: "/SiteEngine/Client/js/controllers/login/login.html",
	    controller: "LoginCtrl"
	  })
	    .when("/Views/start", {
	    //redirectTo: CONST.APPLICATION_START_VIEW()
	    templateUrl: "." + CONST.APPLICATION_START_VIEW() + ".html",
	    controller: "StartCtrl"
	    })
	    .when("/login", {
	      //redirectTo: CONST.APPLICATION_START_VIEW()
	      templateUrl: "/SiteEngine/Client/js/controllers/login/login.html",
	      controller: "LoginCtrl"
	    })
	    .otherwise({ redirectTo: CONST.APPLICATION_START_VIEW() });

	}])
	.controller("StartCtrl", ["$scope", "$http", "$window", startCtrl])
  .controller("LoginCtrl", ["$scope", "$http", "$window", loginCtrl]);

});
