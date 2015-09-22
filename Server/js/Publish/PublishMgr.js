exports.PublishMgr = function (itemMgr) {
  if (!itemMgr)
    return;

  var _ = require('underscore');

  var ServerApplication = require('../ServerApplication.js');

  var Utils = ServerApplication.Utils;

  //var itemMgrModule = require('../ItemMgr.js');
  //var itemMgrPublish = new itemMgrModule.ItemMgr(ServerApplication.DatabasePublish);

  var databaseMgrModule = require('../Database/DatabaseMgr.js');
  var DatabaseMgr = new databaseMgrModule.DatabaseMgr(ServerApplication.Database);

  return {
    publishItem: function(data, objResponse, callback) {
      if (!data || !data.item || !data.item.id || !data.lang || !data.version) {
        objResponse.error = "Error: data";
        if (callback)
          callback();
        return;
      }

      var self = this;

      var updateItemTemplateCallback = function(dataResponse) {
        if (!(objResponse.error && objResponse.error !== "")) {
          var objResponseClone = _.clone(objResponse);
          objResponseClone.data = [];
          itemMgr.getItemFields({ id: data.item.id, templateId: data.item.templateId }, objResponseClone, function () {
            if (objResponseClone.data) {
              var fields = objResponseClone.data;
              _.each(fields, function(field) {
                field.isPublish = false;
              });
              if (!data.isMaxVersion) {
                var versionFields = _.where(fields, { lang: data.lang, version: parseInt(data.version) });
                _.each(versionFields, function(field) {
                  field.isPublish = data.item.isPublish;
                });
              } else {
                var langFields = _.where(fields, { lang: data.lang });
                var hashFields = {};
                _.each(langFields, function(field) {
                  if (!hashFields[field.fieldId])
                    hashFields[field.fieldId] = [];
                  hashFields[field.fieldId].push(field);
                });
                var arKeys = _.keys(hashFields);
                _.each(arKeys, function(key) {
                  var versionFields = hashFields[key];
                  var maxVersionField = _.max(versionFields, function(field) {
                    if (field.version)
                      return field.version;
                    else
                      return 0;
                  });
                  maxVersionField.isPublish = data.item.isPublish;;
                });
              }
              data.item.fields = fields;
              itemMgr.saveItem({ item: data.item, lang: data.lang, version: data.version }, objResponseClone, function () {
                if (callback) {
                  objResponse.isOK = objResponseClone.isOK;
                  objResponse.error = objResponseClone.error;
                  callback();
                }                
              });
            } else {
              if (callback) {
                objResponse.isOK = objResponseClone.isOK;
                objResponse.error = objResponseClone.error;
                callback();
              }              
            }
          });
        } else {
          if (callback)
            callback();
        }
      };
      DatabaseMgr.updateItem({ id: data.item.id, name: data.item.name, isPublish: data.item.isPublish }, objResponse, updateItemTemplateCallback);
    },

    publishItemAndChilds: function (data, publishItemTreeData, objResponse, callback) {
      if (!data || !data.item || !publishItemTreeData) {
        objResponse.error = "Error: data";
        if (callback)
          callback();
        return;
      }

      var self = this;
      data.item.isPublish = publishItemTreeData.isPublish;

      self.publishItem(data, objResponse, function () {
        if (publishItemTreeData.publishItemNumber || publishItemTreeData.publishItemNumber === 0)
          publishItemTreeData.publishItemNumber++;
        if (data.item && data.item.childs && data.item.childs.length > 0) {
          data.isMaxVersion = true;

          _.each(data.item.childs, function(item) {
            var cloneData = _.clone(data);
            cloneData.item = item;
            self.publishItemAndChilds(cloneData, publishItemTreeData, objResponse, function () {
              if (callback)
                callback();              
            });
          });
        } else {
          if (callback)
            callback();
        }
      });

    },

    publishTree: function(data, objResponse, callback) {
      if (!data || !data.item || !data.item.id || !data.lang || !data.version) {
        objResponse.error = "Error: data";
        if (callback)
          callback();
        return;
      }

      var self = this;      

      itemMgr.getItems({}, objResponse, function () {
        if (objResponse && objResponse.data) {
          var allItems = objResponse.data;
          objResponse.data = [];

          var publishItemTreeData = {parentItem: data.item, isPublish: data.item.isPublish, countChilds: 0};
          Utils.findChildItems(allItems, publishItemTreeData);
          publishItemTreeData.countItems = publishItemTreeData.countChilds + 1; // plus Parent item

          publishItemTreeData.publishItemNumber = 0;
          self.publishItemAndChilds(data, publishItemTreeData, objResponse, function () {
            if (publishItemTreeData.publishItemNumber && publishItemTreeData.publishItemNumber === publishItemTreeData.countItems) {
              if (callback) {
                callback();
              }
            }
            
          });

        } else {
          objResponse.isOK = false;
          objResponse.error = "Items are not accesed!";
          if (callback)
            callback();
        }
      });
    },

  };

};