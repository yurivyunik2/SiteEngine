//var http = require('http');
var express = require('express');
var session = require('express-session');
var multipart = require('multipart');

var app = express();

var serverMgrModule = require('./js/ServerMgr.js');
var serverMgr;

app.use(session({ secret: 'ssshhhhh' }));

//app.post('/', function (request, response) {

//  var i = 0;
//  //if (done == true) {
//  //  console.log(req.files);
//  //  res.end("File uploaded.");
//  //}

//  var length = session.length;

//  if (!serverMgr)
//    serverMgr = new serverMgrModule.ServerMgr();

//  serverMgr.requestHandle(request, response);  
//});

try {
  app.use(function (request, response, next) {

    //if (request.session && request.session.id) {
    //  console.log("session: " + request.session.id);
    //} else {
    //  console.log("NO SESSION");
    //}

    var objResponse = {};

    try {
      var length = session.length;

      if (!serverMgr)
        serverMgr = new serverMgrModule.ServerMgr();

      serverMgr.requestHandle(objResponse, request, response);
    } catch (ex) {
      objResponse.error = "Server exception: " + ex;
      response.end(JSON.stringify(objResponse));
    }

    //if (request.method == "POST") {
    //  serverMgr.processPOST(request, response);
    //} else if (request.method == "GET") {
    //  serverMgr.processGET(request, response);
    //} else {
    //  objResponse.error = "ERROR: UNKNOWN REQUEST";
    //  response.end(JSON.stringify(objResponse));
    //}

  }).listen(8082);
  console.log('Server running at http://127.0.0.1:8082/');
} catch (ex) {
}

