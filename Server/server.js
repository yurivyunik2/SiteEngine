//var http = require('http');
var express = require('express');
var session = require('express-session');

var app = express();

var serverMgrModule = require('./js/ServerMgr.js');
var serverMgr = new serverMgrModule.ServerMgr();

var Modules = require('./js/Modules.js');
var CONST = Modules.CONST;
var AppConfig = Modules.AppConfig;

app.use(session({ secret: 'ssshhhhh' }));

try {
  app.use(function (request, response, next) {

    //if (request.session && request.session.id) {
    //  console.log("session: " + request.session.id);
    //} else {
    //  console.log("NO SESSION");
    //}

    var objResponse = {};

    try {
      serverMgr.requestHandle(objResponse, request, response);

    } catch (ex) {
      objResponse.error = "Server exception: " + ex;
      response.end(JSON.stringify(objResponse));
    }

  }).listen(AppConfig.SERVER.PORT());
  console.log("Server running at " + AppConfig.SERVER.HOST() + ":" + AppConfig.SERVER.PORT() + "/");
} catch (ex) {

}

