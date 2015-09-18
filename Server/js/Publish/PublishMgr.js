exports.PublishMgr = function (itemMgr, templateMgr) {
  var _ = require('underscore');

  var ServerApplication = require('../ServerApplication.js');

  var config = ServerApplication.Config;

  var itemMgrModule = require('../ItemMgr.js');
  var itemMgrPublish = new itemMgrModule.ItemMgr(ServerApplication.DatabasePublish);

  var templateMgrModule = require('../TemplateMgr.js');
  var templateMgrPublish = new templateMgrModule.TemplateMgr(ServerApplication.DatabasePublish);

  //var databaseMgrModule = require('../Database/DatabaseMgr.js');
  //var DatabaseMgrPublish = new databaseMgrModule.DatabaseMgr(ServerApplication.DatabasePublish);  

  return {

    publishItem: function (data, objResponse, callback) {
      if (!data || !data.item || !data.item.id) {
        objResponse.error = "Error: data";
        if (callback)
          callback();
        return;
      }

      var self = this;
      itemMgrPublish.getItems(data, objResponse, function (err, rows) {
        if (!(objResponse.error && objResponse.error != "")) {
          if (objResponse.data && objResponse.data.length > 0) {
            itemMgrPublish.saveItem(data, objResponse, function() {
              var i = 0;
            });
          } else {
            var fields = data.item.fields;
            if (fields && fields.length > 0) {
              data.lang = fields[0].lang;
            }
            itemMgrPublish.createItem(data, objResponse, function () {
              var i = 0;
            });
          }
        } else {
          objResponse.error = "Error: " + err;
          if (callback)
            callback(data);
        }
      });

    },


  };

};