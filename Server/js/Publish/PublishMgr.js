exports.PublishMgr = function() {
  var _ = require('underscore');

  var ServerApplication = require('../ServerApplication.js');

  //var configModule = require('./Config.js');
  //var config = new configModule.Config;
  var config = ServerApplication.Config;

  //var databaseMgrModule = require('../Database/DatabaseMgr.js');
  //var DatabaseMgr = new databaseMgrModule.DatabaseMgr();
  var DatabaseMgr = ServerApplication.DatabaseMgr;

  return {

    publishItem: function (data, objResponse, callback) {
      if (!data || !data.item || (data.isNewVersion && (!data.lang || !data.version))) {
        objResponse.error = "Error: data";
        if (callback)
          callback();
        return;
      }

      var self = this;

      var updateFieldValueCallback = function (field) {
        if (!(objResponse.error && objResponse.error != "")
            && field && field.indexField >= 0) {
          if (data.item.fields && data.item.fields.length > 0 && field.indexField < (data.item.fields.length - 1)) {
            var indexField = field.indexField;
            indexField++;
            var fieldNext = data.item.fields[indexField];
            fieldNext.indexField = indexField;
            if (data.isNewVersion) {
              //if (fieldNext.itemId == data.item.id && fieldNext.lang == data.lang && fieldNext.version == data.version)
              //  DatabaseMgr.updateFields(fieldNext, objResponse, updateFieldValueCallback);
              //else {
              //  fieldNext.itemId = data.item.id;
              //  DatabaseMgr.insertIntoFields(fieldNext, objResponse, updateFieldValueCallback);
              //}
              fieldNext.itemId = data.item.id;
              DatabaseMgr.insertIntoFields(fieldNext, objResponse, updateFieldValueCallback);
            } else {
              DatabaseMgr.updateFields(fieldNext, objResponse, updateFieldValueCallback);
            }
          } else {
            objResponse.isOK = true;
            objResponse.data = {
              item: data.item
            };
            if (callback)
              callback();
          }
        } else {
          if (callback)
            callback();
        }
      };

      if (data.item.fields && data.item.fields.length > 0) {
        var field = data.item.fields[0];
        field.indexField = 0;
        if (data.isNewVersion) {
          //if (field.itemId == data.item.id && field.lang == data.lang && field.version == data.version)
          //  DatabaseMgr.updateFields(field, objResponse, updateFieldValueCallback);
          //else {
          //  field.itemId = data.item.id;
          //  DatabaseMgr.insertIntoFields(field, objResponse, updateFieldValueCallback);
          //}
          field.itemId = data.item.id;
          DatabaseMgr.insertIntoFields(field, objResponse, updateFieldValueCallback);
        } else {
          DatabaseMgr.updateFields(field, objResponse, updateFieldValueCallback);
        }
      }
    },


  };

};