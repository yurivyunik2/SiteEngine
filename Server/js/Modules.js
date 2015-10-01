﻿
var constModule = require('../../Common/Const.js');
module.exports.CONST = new constModule.CONST();

var utilsModule = require('./Utils.js');
module.exports.Utils = new utilsModule.Utils();

var serverApplicationModule = require('./ServerApplication.js');
module.exports.ServerApplication = new serverApplicationModule.ServerApplication(module.exports.CONST, module.exports.Utils);

var dbModule = require('./Database/Database.js');
module.exports.Database = new dbModule.Database();

var databaseMgrModule = require('./Database/DatabaseMgr.js');
module.exports.DatabaseMgr = new databaseMgrModule.DatabaseMgr();
