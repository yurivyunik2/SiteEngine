//require.config({
//  paths: {
//    tabPanel: "js/components/TabPanel/tabPanel",
//    startCtrl: "js/controllers/startCtrl"
//  },
//});

//define([
//	"angular",
//  "underscore",
//  "CONST",
//  "startCtrl",
//  "tabPanel",  
//], function (angular, _, CONST, startCtrl) {
//  'use strict';

//  angular.module(CONST.APPLICATION_NAME() + ".start", ["ngRoute"])
//	.config(["$routeProvider", function ($routeProvider) {
//	  //$routeProvider.when(CONST.APPLICATION_START_VIEW(), {
//	  //  templateUrl: "." + CONST.APPLICATION_START_VIEW() + ".html",
//	  //  controller: "StartCtrl"
//	  //}).when("#", {
//	  //  templateUrl: "." + CONST.APPLICATION_START_VIEW() + ".html",
//	  //  controller: "StartCtrl"
//	  //});

//	  $routeProvider.when("#", {
//	    templateUrl: "." + CONST.APPLICATION_START_VIEW() + ".html",
//	    controller: "StartCtrl"
//	  });
	  
//	}])
//	.controller("StartCtrl", ["$scope", "$http", "$window", startCtrl]);
  
//});