exports.ContentMgr = function (itemMgr) {
  var _ = require('underscore');
  var fs = require('fs');

  var Modules = require('./Modules.js');

  var config = Modules.Config;
  var Utils = Modules.Utils;
  var ServerApplication = Modules.ServerApplication;

  var self;

  var contentMgrObj = {

    constructor: function() {
      self = this;
    },

    update: function() {      

    },

    getItemRequest: function (request, response, objResponse, callback) {
      // get content
      var url = request.url;
      var arPath = url.split("/");
      if (arPath.length <= 1) {
        arPath = url.split("\\");
      }

      // go to part of PATH
      if (arPath.length >= 1) {
        arPath = _.without(arPath, "");
        var contentParentItems = ServerApplication.getContentParentItems();
        if (contentParentItems) {
          var finishContentItem;
          for (var i = 0; i < arPath.length; i++) {
            var name = arPath[i];
            var indexDot = name.indexOf(".");
            if (indexDot >= 0) {
              name = name.substring(indexDot, name - indexDot);
            }
            if (name !== "") {
              var childItems = contentParentItems;
              if (finishContentItem)
                childItems = finishContentItem.childs;
              var arFound = _.where(childItems, { name: name });
              if (arFound.length > 0)
                finishContentItem = arFound[0];
              else {
                finishContentItem = null;
                break;
              }
            }
          }

          if (finishContentItem) {
            objResponse.items = ServerApplication.getItemsCash();
            objResponse.data = [];
            itemMgr.getItemFields(finishContentItem, objResponse, function () {
              if (!(objResponse.error && objResponse.error != "")) {
                finishContentItem.fields = objResponse.data;
                objResponse.data = finishContentItem;
              }
              if (callback)
                callback();
            });
          } else {
            objResponse.isOK = false;
            objResponse.error = "Page isn't found!";
            response.end(JSON.stringify(objResponse));
          }
        } else {
          objResponse.isOK = false;
          objResponse.error = "Page isn't found!";
          response.end(JSON.stringify(objResponse));
        }

      } else {
        //HOME PAGE
      }
    },

    getContent: function (request, response, objResponse) {
      response.writeHead(200, "OK", {
        'Content-Type': 'text/html',
        'Access-Control-Allow-Origin': '*'
      });

      self.getItemRequest(request, response, objResponse, function () {
        var error;
        var items = objResponse.items;
        var pathLayout;

        if (objResponse.data && objResponse.data.fields) {
          var fields = objResponse.data.fields;
          var renderingFields = [];
          _.each(fields, function(field) {
            if (field.name == "Renderings")
              renderingFields.push(field);
          });
          var renderingObj;
          _.each(renderingFields, function(rendering) {
            if (rendering.value && rendering.value != "") {
              try {
                renderingObj = JSON.parse(rendering.value);
              } catch(ex) {
              }
            }
          });

          if (renderingObj) {

            if (renderingObj.layout) {
              _.each(items, function(item) {
                if (item.id == renderingObj.layout.id) {
                  renderingObj.layoutItem = item;
                }
              });

              if (renderingObj.layoutItem && renderingObj.subLayouts) {
                _.each(renderingObj.subLayouts, function(subLayout) {

                  _.each(items, function(item) {
                    if (item.id == subLayout.id) {
                      subLayout.item = item;
                    }
                  });
                });
              }
            }

            if (renderingObj.layoutItem) {
              objResponse.data = [];
              var getItemFieldsCallback = function(itemData) {
                if (!(objResponse.error && objResponse.error != "")) {
                  itemData.fields = objResponse.data;
                  _.each(itemData.fields, function(field) {
                    if (field.name === "Path") {
                      pathLayout = field.value;
                    }
                  });

                  if (pathLayout) {
                    var content = fs.readFileSync(pathLayout).toString();
                    itemData.layoutContent = content;

                    if (renderingObj.subLayouts && renderingObj.subLayouts.length > 0) {
                      if (!objResponse.indexSubLayout && objResponse.indexSubLayout != 0) {
                        objResponse.indexSubLayout = 0;

                        itemMgr.getItemFields(renderingObj.subLayouts[0].item, objResponse, getItemFieldsCallback);
                      } else if ((objResponse.indexSubLayout + 1) < renderingObj.subLayouts.length) {
                        objResponse.indexSubLayout++;
                        itemMgr.getItemFields(renderingObj.subLayouts[objResponse.indexSubLayout].item, objResponse, getItemFieldsCallback);
                      } else {
                        objResponse.isOK = true;
                        objResponse.data = renderingObj;
                        response.end(JSON.stringify(objResponse));
                      }
                    } else {
                      objResponse.isOK = true;
                      objResponse.data = renderingObj;
                      response.end(JSON.stringify(objResponse));
                    }
                  } else {
                    error = "PATH field isn't found in layout item!";
                  }
                } else {
                  error = "Page isn't found!";
                }
                
                if (error && error != "") {
                  objResponse.isOK = false;
                  objResponse.error = "There are no data-items on the server!";
                  response.end(JSON.stringify(objResponse));
                  return;
                }
              };
              itemMgr.getItemFields(renderingObj.layoutItem, objResponse, getItemFieldsCallback);
            } else {
              error = "RENDERING layout isn't found!";
            }
          }

        } else {
          error = "There is no RENDERING on the item!";
        }

        if (error && error != "") {
          objResponse.isOK = false;
          objResponse.error = "There are no data-items on the server!";
          response.end(JSON.stringify(objResponse));
          return;
        }
      });
    },
    
  };
  contentMgrObj.constructor();
  return contentMgrObj;
};