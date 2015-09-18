//
// Database
//
exports.Database = function (_mysql, dbConfig) {
  var self;

  var mysql = require('mysql');
  var fs = require("fs");
  var readline = require('readline');

  var configModule = require('../Config.js');
  var config = new configModule.Config;

  var dbConfig = config.DATABASE;
  var connection;
  var isConnectProcessing = false;

  var databaseObj = {
    constructor: function() {
      self = this;
      self.connect();
    },
    connect: function (callback) {
      if (mysql && dbConfig.host && dbConfig.user && dbConfig.pass && dbConfig.name) {
        if (!isConnectProcessing && (!connection || (connection.state && connection.state === "disconnected"))) {
          isConnectProcessing = true;
          connection = mysql.createConnection({
            host: dbConfig.host,
            user: dbConfig.user,
            password: dbConfig.pass,
            database: dbConfig.name
          });

          connection.connect(function (err) {
            isConnectProcessing = false;
            if (callback)
              callback(err);
          });

          connection.on('error', function (err) {
            console.log('DB_ERROR', err);
            if (err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
              // lost due to either server restart, or a
            } else {                                      // connnection idle timeout (the wait_timeout
              throw err;                                  // server variable configures this)
            }
          });

        } else {
          if (callback)
            callback();
        }
        
      }
    },
    query: function (queryStr, callback) {
      try {
        this.connect(function (err) {
          if (!err) {
            if (connection && queryStr) {
              connection.query(queryStr, function(err, rows, fields) {
                if (callback)
                  callback(err, rows);
              });
            }
          } else {
            if (callback)
              callback("Error connection: " + err);
          }
        });
      } catch (ex) {
        if (callback)
          callback("Exception: " + ex);
      }
    },

  };
  databaseObj.constructor();
  return databaseObj;
};
