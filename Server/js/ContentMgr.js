exports.ContentMgr = function (itemMgr) {
  var _ = require('underscore');
  var url = require('url');
  var fs = require('fs');

  var Modules = require('./Modules.js');

  var CONST = Modules.CONST;
  //var Utils = Modules.Utils;
  var ServerApplication = Modules.ServerApplication;

  var self;

  var contentMgrObj = {

    constructor: function() {
      self = this;
    },

    // finding of the Defined Content item - Last part of the URLpath
    getContentItem: function (request, objResponse, callback) {
      var urlParts = url.parse(request.url, true);
      var pathname = urlParts.pathname;
      var arPath = pathname.split("/");
      if (arPath.length <= 1) {
        arPath = pathname.split("\\");
      }
      arPath = _.without(arPath, "");
      
      var isEditMode;
      if (urlParts.query && urlParts.query.isEdit)
        isEditMode = true;

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
            if (name) {
              name = name.toLowerCase();
              var contentItems = contentParentItems;
              if (finishContentItem)
                contentItems = finishContentItem.childs;
              var itemFound = null;
              for (var j = 0; j < contentItems.length; j++) {
                if (contentItems[j].name && contentItems[j].name.toLowerCase() === name) {
                  itemFound = contentItems[j];
                  break;
                }
              }
              if (itemFound)
                finishContentItem = itemFound;
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

      if (finishContentItem && finishContentItem.isPublish) {
        itemMgr.getItemFields(finishContentItem, objResponse, function () {
          if (!(objResponse.error && objResponse.error !== "")) {
            finishContentItem.fields = objResponse.data;
            objResponse.data = { item: finishContentItem };
          }
          if (callback)
            callback();
        });
      } else {
        objResponse.error = "Page isn't found!";
        if (callback)
          callback();
      }
    },

    getRenderingItem: function (request, item, objResponse, callback) {
      if (!item.fields)
        return null;

      try {

        var renderingObj;
        var renderingFields = [];
        _.each(item.fields, function (field) {
          if (field.fieldId === CONST.RENDERINGS_FIELD_ID())
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

        if (renderingObj && renderingObj.id && parseInt(renderingObj.id) > 0) {
          var renderingId = parseInt(renderingObj.id);
          var itemsHash = ServerApplication.getItemsHash();
          if (itemsHash[renderingId]) {
            renderingObj.layoutItem = itemsHash[renderingId];
          }

          if (renderingObj.layoutItem) {

            var getItemFieldsCallback = function (itemData) {
              try{
                if (!(objResponse.error && objResponse.error !== "")) {
                  var pathLayout;
                  var arUserAgents;
                  itemData.fields = objResponse.data;
                  _.each(itemData.fields, function (field) {
                    if (field.fieldId === CONST.LAYOUT_CONTENT_FIELD_ID()) {
                      var stUserAgents = field.value;
                      try {
                        arUserAgents = JSON.parse(stUserAgents);
                        if (arUserAgents && request.headers["user-agent"]) {
                          var userAgent;
                          var reqUserAgent = request.headers["user-agent"];
                          for (var i = 0; i < arUserAgents.length; i++) {
                            if (arUserAgents[i].userAgent) {
                              var index = reqUserAgent.toLowerCase().indexOf(arUserAgents[i].userAgent.toLowerCase());
                              if (index >= 0) {
                                userAgent = arUserAgents[i];
                                break;
                              }
                            }
                          }
                          if (!userAgent) {
                            userAgent = _.find(arUserAgents, { userAgent: "" });
                          }
                          if (userAgent) {
                            pathLayout = userAgent.path;
                          }
                        }
                      }
                      catch (ex) { }
                    }
                  });

                  if (pathLayout && fs.existsSync(pathLayout)) {
                    var content = fs.readFileSync(pathLayout).toString();
                    itemData.layoutContent = content;

                    objResponse.data = renderingObj;
                  } else {
                    objResponse.error = "PATH field isn't found in layout item!";
                  }
                }
                if (callback)
                  callback();
              } catch (ex) {
                objResponse.error = "PATH field isn't found in layout item!";
                if (callback)
                  callback();
              }
            };
            itemMgr.getItemFields(renderingObj.layoutItem, objResponse, getItemFieldsCallback);
          } else {
            objResponse.error = "RENDERING layout-item isn't found!";
          }
        } else {
          objResponse.error = "RENDERING layout isn't found!";
        }

        if (objResponse.error && callback)
          callback();        
      } catch (ex) {
        objResponse.error = "RENDERING layout isn't found!";
        if (callback)
          callback();
      }

    },

    getContent: function (request, objResponse, callback) {
      self.getContentItem(request, objResponse, function () {
        if (!(objResponse.error && objResponse.error !== "")) {
          var contentItem = null;
          if (objResponse.data) {
            contentItem = objResponse.data.item;
          }
          if (contentItem && contentItem.fields) {
            try {
              self.getRenderingItem(request, contentItem, objResponse, function () {
                if (callback)
                  callback();
              });
            }
            catch (ex) { }
            return;
          } else {
            objResponse.error = "Data for this page aren't found!";
          }
        }
        if (objResponse.error && callback)
          callback();
      });
    },
    
  };
  contentMgrObj.constructor();
  return contentMgrObj;
};