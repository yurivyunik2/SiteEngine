
var configModule = require('./Config.js');
module.exports.Config = new configModule.Config();

var utilsModule = require('./Utils.js');
module.exports.Utils = new utilsModule.Utils();

var dbModule = require('./Database/Database.js');
module.exports.Database = new dbModule.Database(module.exports.Config.DATABASE.adminDB_Config);

module.exports.DatabasePublish = new dbModule.Database(module.exports.Config.DATABASE.publishDB_Config);

