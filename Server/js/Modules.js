
var configModule = require('./Config.js');
module.exports.Config = new configModule.Config();

var utilsModule = require('./Utils.js');
module.exports.Utils = new utilsModule.Utils();

var serverApplicationModule = require('./ServerApplication.js');
module.exports.ServerApplication = new serverApplicationModule.ServerApplication(module.exports.Config, module.exports.Utils);

var dbModule = require('./Database/Database.js');
module.exports.Database = new dbModule.Database(module.exports.Config.DATABASE.dbConfig);

var databaseMgrModule = require('./Database/DatabaseMgr.js');
module.exports.DatabaseMgr = new databaseMgrModule.DatabaseMgr();
