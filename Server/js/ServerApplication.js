
var configModule = require('./Config.js');
module.exports.Config = new configModule.Config();

var utilsModule = require('./Utils.js');
module.exports.Utils = new utilsModule.Utils();

var dbModule = require('./Database/Database.js');
module.exports.Database = new dbModule.Database(module.exports.Config.DATABASE.dbConfig);

var databaseMgrModule = require('./Database/DatabaseMgr.js');
module.exports.DatabaseMgr = new databaseMgrModule.DatabaseMgr();
