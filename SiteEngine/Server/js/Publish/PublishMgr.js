﻿exports.PublishMgr = function (itemMgr) {
  if (!itemMgr)
    return;

  var _ = require('underscore');

  var Modules = require('../Modules.js');

  var Utils = Modules.Utils;
  var DatabaseMgr = Modules.DatabaseMgr;
  var ServerApplication = Modules.ServerApplication;

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
              var langFields = _.where(fields, { lang: data.lang });
              _.each(langFields, function (field) {
                field.isPublish = false;
              });
              if (!data.isMaxVersion) {
                var versionFields = _.where(fields, { lang: data.lang, version: parseInt(data.version) });
                _.each(versionFields, function(field) {
                  field.isPublish = data.item.isPublish;
                });
              } else {
                langFields = _.where(fields, { lang: data.lang });
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
                  objResponse.error = objResponseClone.error;
                  callback();
                }
              });
            } else {
              if (callback) {
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

      var itemsHash = ServerApplication.getItemsHash();
      if (itemsHash && itemsHash[data.item.id]) {
        var isPublish = data.item.isPublish;
        data.item = itemsHash[data.item.id];
        var publishItemTreeData = { parentItem: data.item, isPublish: isPublish, countChilds: 0 };
        var allChildItems = [];
        Utils.findChildItems(allChildItems, publishItemTreeData.parentItem);
        publishItemTreeData.countItems = allChildItems.length + 1;

        publishItemTreeData.publishItemNumber = 0;
        self.publishItemAndChilds(data, publishItemTreeData, objResponse, function () {
          if (publishItemTreeData.publishItemNumber && publishItemTreeData.publishItemNumber === publishItemTreeData.countItems) {
            if (callback) {
              callback();
            }
          }
        });
      } else {
        objResponse.error = "Items are not accesed!";
        if (callback)
          callback();
      }
      
    },

  };

};