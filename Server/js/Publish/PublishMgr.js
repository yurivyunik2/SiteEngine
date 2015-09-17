exports.PublishMgr = function() {
  var _ = require('underscore');

  var configModule = require('./Config.js');
  var config = new configModule.Config;

  var databaseMgrModule = require('./Database/DatabaseMgr.js');
  var DatabaseMgr = new databaseMgrModule.DatabaseMgr();

  return {

  };

};