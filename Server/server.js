//var http = require('http');
var express = require('express');
var session = require('express-session');
var multipart = require('multipart');

var app = express();

var serverMgrModule = require('./js/ServerMgr.js');
var serverMgr = new serverMgrModule.ServerMgr();

app.use(session({ secret: 'ssshhhhh' }));

//app.post('/', function (request, response) {

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

      serverMgr.requestHandle(objResponse, request, response);

    } catch (ex) {
      objResponse.error = "Server exception: " + ex;
      response.end(JSON.stringify(objResponse));
    }

  }).listen(8082);
  console.log('Server running at http://127.0.0.1:8082/');
} catch (ex) {
}

