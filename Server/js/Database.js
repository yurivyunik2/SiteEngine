//
// Database
//
exports.Database = function (_mysql, dbConfig) {
  var mysql = require('mysql');

  var configModule = require('./Config.js');
  var config = new configModule.Config;

  var dbConfig = config.DATABASE;
  var connection;
  return {
    connect: function () {
      if (mysql && dbConfig.host && dbConfig.user && dbConfig.pass && dbConfig.name) {
        if (!connection) {
          connection = mysql.createConnection({
            host: dbConfig.host,
            user: dbConfig.user,
            password: dbConfig.pass,
            database: dbConfig.name
          });
        }
        //if (connection.state && connection.state === "disconnected")
        //  connection.connect();
      }
    },
    query: function (queryStr, callback) {
      try {
        this.connect();
        if (connection && queryStr) {
          connection.query(queryStr, function (err, rows, fields) {
            if (callback)
              callback(err, rows);
          });
        }
      } catch (ex) {
        if (callback)
          callback("Exception: " + ex);
      }

    },

  };
};
