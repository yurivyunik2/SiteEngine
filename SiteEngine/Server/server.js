//var http = require('http');
var express = require('express');
var session = require('express-session');
var cookieParser = require('cookie-parser');

var app = express();

var serverMgrModule = require('./js/ServerMgr.js');
var serverMgr = new serverMgrModule.ServerMgr();

var Modules = require('./js/Modules.js');
var CONST = Modules.CONST;
var AppConfig = Modules.AppConfig;

var port = process.env.PORT || AppConfig.SERVER.PORT();
//var port = process.env.PORT || 8088;
//var port = AppConfig.SERVER.PORT();

//if (AppConfig.SERVER.isRelease)
//  process.chdir('./SiteEngine_RELEASE');

app.use(cookieParser());
app.use(session({
  key: 'A_SESSION_KEY',
  secret: 'ssshhhhh',
  ////store: new express.session.MemoryStore,
  //cookie: { 
  //  domain: 'solution-site.com', 
  //  maxAge   : 1000*60*60*24*30*12 
  //}  
}));

try {

  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    //res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
    next();
  });

  app.use(function (request, response, next) {

    //if (request.session && request.session.id) {
    //  console.log("session: " + request.session.id);
    //} else {
    //  console.log("NO SESSION");
    //}

    response.header('Access-Control-Allow-Credentials', true);
    response.header('Access-Control-Allow-Origin', "*");

    var objResponse = {};

    try {
      serverMgr.requestHandle(objResponse, request, response);

    } catch (ex) {
      objResponse.error = "Server exception: " + ex;
      response.end(JSON.stringify(objResponse));
    }

  }).listen(port);
  console.log("Server running at " + AppConfig.SERVER.HOST() + ":" + port + "/");
} catch (ex) { }

