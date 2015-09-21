exports.PublishMgr = function (itemMgr) {
  var _ = require('underscore');

  var ServerApplication = require('../ServerApplication.js');

  var config = ServerApplication.Config;

  //var itemMgrModule = require('../ItemMgr.js');
  //var itemMgrPublish = new itemMgrModule.ItemMgr(ServerApplication.DatabasePublish);

  var databaseMgrModule = require('../Database/DatabaseMgr.js');
  var DatabaseMgr = new databaseMgrModule.DatabaseMgr(ServerApplication.Database);

  return {

    publishItem: function (data, objResponse, callback) {
      if (!data || !data.item || !data.item.id || !data.lang || !data.version) {
        objResponse.error = "Error: data";
        if (callback)
          callback();
        return;
      }

      var self = this;

      var updateItemTemplateCallback = function (dataResponse) {
        if (!(objResponse.error && objResponse.error !== "")) {
          itemMgr.getItemFields({ id: data.item.id, templateId: data.item.templateId }, objResponse, function () {
            if (objResponse.data) {
              var fields = objResponse.data;
              _.each(fields, function (field) {
                field.isPublish = false;
              });
              var versionFields = _.where(fields, {lang: data.lang, version: parseInt(data.version)});
              _.each(versionFields, function (field) {
                field.isPublish = data.item.isPublish;
              });
              data.item.fields = fields;
              itemMgr.saveItem({ item: data.item, lang: data.lang, version: data.version }, objResponse, function () {
                if (callback)
                  callback();
              });
            } else {
              if (callback)
                callback();
            }
          });

        } else {
          if (callback)
            callback();
        }
      };
      DatabaseMgr.updateItem({ id: data.item.id, name: data.item.name, isPublish: data.item.isPublish }, objResponse, updateItemTemplateCallback);
    },


  };

};