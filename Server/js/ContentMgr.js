exports.ContentMgr = function (itemMgr) {
  var _ = require('underscore');
  var fs = require('fs');

  var Modules = require('./Modules.js');

  var Config = Modules.Config;
  //var Utils = Modules.Utils;
  var ServerApplication = Modules.ServerApplication;

  var self;

  var contentMgrObj = {

    constructor: function() {
      self = this;
    },

    // finding of the Defined Content item - Last part of the URLpath
    getItemRequest: function (request, objResponse, callback) {
      var url = request.url;
      var arPath = url.split("/");
      if (arPath.length <= 1) {
        arPath = url.split("\\");        
      }
      arPath = _.without(arPath, "");
      
      var finishContentItem;
      var contentParentItems = ServerApplication.getContentParentItems();
      if (contentParentItems && contentParentItems.length > 0) {
        if (arPath.length > 0) {
          for (var i = 0; i < arPath.length; i++) {
            var name = arPath[i];
            var indexDot = name.indexOf(".");
            if (indexDot >= 0) {
              name = name.substring(indexDot, name - indexDot);
            }
            if (name !== "") {
              var contentItems = contentParentItems;
              if (finishContentItem)
                contentItems = finishContentItem.childs;
              var arFound = _.where(contentItems, { name: name });
              if (arFound.length > 0)
                finishContentItem = arFound[0];
              else {
                finishContentItem = null;
                break;
              }
            }
          }
        } else {
          //HOME PAGE - first content Parent Item
          finishContentItem = contentParentItems[0];
        }
      }

      if (finishContentItem) {
        itemMgr.getItemFields(finishContentItem, objResponse, function () {
          if (!(objResponse.error && objResponse.error !== "")) {
            finishContentItem.fields = objResponse.data;
            objResponse.data = { item: finishContentItem };
          }
          if (callback)
            callback();
        });
      } else {
        objResponse.isOK = false;
        objResponse.error = "Page isn't found!";
        if (callback)
          callback();
      }
    },

    getRenderingItem: function (item, objResponse, callback) {
      if (!item.fields)
        return null;

      var renderingObj;
      var renderingFields = [];
      _.each(item.fields, function (field) {
        if (field.fieldId === Config.DATABASE.RENDERINGS_FIELD_ID())
          renderingFields.push(field);
      });
      _.each(renderingFields, function (rendering) {
        if (rendering.value && rendering.value !== "") {
          try {
            renderingObj = JSON.parse(rendering.value);
          } catch (ex) {

          }
        }
      });

      if (renderingObj && renderingObj.layout) {
        var items = ServerApplication.getItemsCash();
        _.each(items, function(item) {
          if (item.id === renderingObj.layout.id) {
            renderingObj.layoutItem = item;
          }
        });

        if (renderingObj.layoutItem) {
          var getItemFieldsCallback = function(itemData) {
            if (!(objResponse.error && objResponse.error != "")) {
              var pathLayout;
              itemData.fields = objResponse.data;
              _.each(itemData.fields, function(field) {
                if (field.name === "Path") {
                  pathLayout = field.value;
                }
              });

              if (pathLayout) {
                var content = fs.readFileSync(pathLayout).toString();
                itemData.layoutContent = content;

                objResponse.data = renderingObj;
              } else {
                objResponse.isOK = false;
                objResponse.error = "PATH field isn't found in layout item!";
              }
            }
            if (callback)
              callback();
          };
          itemMgr.getItemFields(renderingObj.layoutItem, objResponse, getItemFieldsCallback);
        } else {
          objResponse.isOK = false;
          objResponse.error = "RENDERING layout-item isn't found!";
          if (callback)
            callback();
        }
      } else {
        objResponse.isOK = false;
        objResponse.error = "RENDERING layout isn't found!";
        if (callback)
          callback();
      }
    },

    getContent: function (request, objResponse, callback) {
      self.getItemRequest(request, objResponse, function () {
        if (!(objResponse.error && objResponse.error !== "")) {
          var contentItem;
          if (objResponse.data) {
            contentItem = objResponse.data.item;
          }
          if (contentItem && contentItem.fields) {
            self.getRenderingItem(contentItem, objResponse, function() {
              if (callback)
                callback();
            });
          } else {
            objResponse.isOK = false;
            objResponse.error = "Data for this page aren't found!";
            if (callback)
              callback();
          }
        } else {
          if (callback)
            callback();
        }
      });
    },
    
  };
  contentMgrObj.constructor();
  return contentMgrObj;
};