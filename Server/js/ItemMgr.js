
exports.ItemMgr = function () {
  var _ = require('underscore');
  var fs = require('fs');
  
  var Modules = require('./Modules.js');

  var ServerApplication = Modules.ServerApplication;

  var CONST = Modules.CONST;

  var database = Modules.Database;

  var DatabaseMgr = Modules.DatabaseMgr;

  var Utils = Modules.Utils;

  var currentRequest;

  return {
    setRequest: function(request) {
      currentRequest = request;
    },

    getItems: function(data, objResponse, callback) {
      var query = "SELECT id, name, parentId, templateId, isPublish FROM items";
      if (data && (data.parentId || (data.item && data.item.id))) {
        objResponse.notAllItems = true;
        //query += " where parentID = " + data.parentId;
        query += " where ";
        if (data.parentId) {
          query += " parentID = " + data.parentId;
          if (data.item && data.item.id) {
            query += " and id = " + data.id;
          }
        } else if (data.item && data.item.id) {
          query += " id = " + data.item.id;
        }
      }
      var getItemsCallback = function(err, rows) {
        if (!err) {
          if (rows && rows.length > 0)
            objResponse.data = rows;
        } else {
          objResponse.error = "Error: " + err;
        }
        if (callback)
          callback(data);
      };
      if (database) {
        database.query(query, getItemsCallback);
      }
    },

    getTemplateItemFields: function(data, objResponse, callback) {
      if (!data || !data.id || !data.templateId) {
        objResponse.error = "Error: data";
        if (callback)
          callback();
        return;
      }

      var self = this;
      if (!data.baseId)
        data.baseId = 0;

      var query = 'SELECT f.id, items.id as fieldId, items.name, (select distinct f2.value from fields f2 where f2.itemId = items.id and f2.fieldId = ' + CONST.TYPE_FIELD_ID() + ') as type, items.templateId, items.masterId, items.parentId, items.created, items.updated, f.itemId, f.value, f.language as lang, f.version, f.isPublish FROM items\
                   LEFT JOIN fields f ON items.id=f.fieldId and (f.itemId=items.parentId || f.itemId=' + data.id + ' || f.itemId=' + data.baseId + ' || f.itemId=' + data.templateId + ')\
                   where items.parentId=' + data.templateId;

      var getTemplateFieldsForTemplateCallback = function(err, rows) {
        if (!err) {
          var fields = rows;
          var filteredFields = [];
          if (fields && fields.length > 0) {
            if (!objResponse.data || !(objResponse.data.length >= 0))
              objResponse.data = [];

            _.each(fields, function(field) {
              var existedField = _.findWhere(objResponse.data, { fieldId: field.fieldId, lang: field.lang, version: field.version });
              if (existedField) {
                //if (existedField.itemId != data.id || !existedField.value) { // if there isn't item's(owned) field then remove field and add fresh(next) field
                if (existedField.fieldId === CONST.BASE_TEMPLATE_FIELD_ID() && !objResponse.amountBaseTemplate) {
                  var arExistBaseTemplate = existedField.value.split("|");
                  var arFieldBaseTemplate = field.value.split("|");
                  _.each(arFieldBaseTemplate, function(baseTemplate) {
                    if (baseTemplate && arExistBaseTemplate.indexOf(baseTemplate) < 0) {
                      arExistBaseTemplate.push(baseTemplate);
                    }
                  });
                  existedField.value = "";
                  for (var i = 0; i < arExistBaseTemplate.length; i++) {
                    existedField.value += arExistBaseTemplate[i];
                    if (i !== (arExistBaseTemplate.length - 1)) existedField.value += "|";
                  }

                } else if (existedField.itemId !== data.id) { // if there isn't item's(owned) field then remove field and add fresh(next) field
                  objResponse.data = _.without(objResponse.data, existedField);
                  objResponse.data.push(field);

                  //filteredFields = _.without(filteredFields, existedField);
                  //filteredFields.push(field);
                }
              } else { // fields are not added previously
                objResponse.data.push(field);
                //filteredFields.push(field);
              }
            });

          }

          var baseTemplateField;
          _.each(objResponse.data, function(field) {
            if (CONST.BASE_TEMPLATE_FIELD_ID() === field.fieldId) {
              //if (!baseTemplateField || field.itemId === data.id)
              baseTemplateField = field;
            }
          });

          if (objResponse.indexBaseTemplate >= 0)
            objResponse.indexBaseTemplate++;
          else
            objResponse.indexBaseTemplate = 0;

          if (baseTemplateField && baseTemplateField.value && !objResponse.amountBaseTemplate) {
            var arTemplates = baseTemplateField.value.split("|");
            arTemplates = _.without(arTemplates, "");
            objResponse.amountBaseTemplate = arTemplates.length;
            //if (objResponse.amountBaseTemplate >= 0)
            //  objResponse.amountBaseTemplate += arTemplates.length;
            //else              
            for (var i = 0; i < arTemplates.length; i++) {
              var template = arTemplates[i];
              self.getTemplateItemFields({ templateId: template, id: data.id, baseId: data.templateId }, objResponse, callback);
            }
          }

          if (objResponse.indexBaseTemplate >= objResponse.amountBaseTemplate || (!baseTemplateField && !objResponse.amountBaseTemplate)) {
            if (callback)
              callback(data);
          }

        } else {

        }

      };

      var getTemplateFieldsForItemCallback = function(err, rows) {
        try {
          if (!err) {

            var addField = function(field) {
              var existedField = _.findWhere(objResponse.data, { fieldId: field.fieldId, lang: field.lang, version: field.version });
              if (existedField) {
                //if (existedField.itemId != data.id || !existedField.value) { // if there isn't item's(owned) field then remove field and add fresh(next) field
                if (existedField.itemId !== data.id) { // if there isn't item's(owned) field then remove field and add fresh(next) field
                  objResponse.data = _.without(objResponse.data, existedField);
                  objResponse.data.push(field);
                }
              } else { // fields are not added previously
                objResponse.data.push(field);
              }
            };

            var fields = rows;
            if (fields && fields.length > 0) {
              if (!objResponse.data || !(objResponse.data.length >= 0))
                objResponse.data = [];

              _.each(fields, function(field) {
                //if (parseInt(field.type) === CONST.BLOB_TYPE()) {
                //  query = 'SELECT CONVERT(Data USING utf8) as Data FROM blobs b where id=' + field.value;
                //  if (database) {
                //    database.query(query, function(err, rows) {
                //      if (!err) {
                //        if (rows && rows.length > 0)
                //          field.value = rows[0].Data;
                //        addField(field); 
                //      }
                //    });
                //  }
                //} else {
                //  addField(field);
                //}

                addField(field);

                //objResponse.data.push(field);                
              });
            }

            query = 'SELECT f.id, items.id as fieldId, items.name, (select distinct f2.value from fields f2 where f2.itemId = items.id and f2.fieldId = ' + CONST.TYPE_FIELD_ID() + ') as type, items.templateId, items.masterId, items.parentId, items.created, items.updated, f.itemId, f.value, f.language as lang, f.version, f.isPublish  FROM items\
                  LEFT JOIN fields f ON items.id=f.fieldId and (f.itemId=items.parentId || f.itemId=' + data.templateId + ' || f.itemId=' + data.id + ')\
                  where items.parentId=(select items_sub.templateId from items items_sub where id=' + data.templateId + ');';

            if (database) {
              database.query(query, getTemplateFieldsForTemplateCallback);
            }

          } else {
            objResponse.error = "Error: " + err;
            if (callback)
              callback(data);
          }
        } catch (ex) {
          objResponse.error = "Exception: " + ex;
          if (callback)
            callback(data);
        }
      };

      if (database) {
        database.query(query, getTemplateFieldsForItemCallback);
      }
    },

    getItemFields: function(data, objResponse, callback) {
      if (!data || !data.id || !data.templateId) {
        objResponse.error = "Error: data";
        if (callback)
          callback();
        return;
      }

      //var query = 'SELECT f.id, items.id as fieldId, items.name, (select distinct f2.value from fields f2 where f2.itemId = items.id and f2.fieldId = ' + CONST.TYPE_FIELD_ID() + ') as type, items.templateId, items.masterId, items.parentId, items.created, items.updated, f.itemId, f.value, f.language as lang, f.version, f.isPublish FROM items\
      //             LEFT JOIN fields f ON items.id=f.fieldId and (f.itemId=items.parentId || f.itemId=' + data.id + ' || f.itemId=' + data.baseId + ' || f.itemId=' + data.templateId + ')\
      //             where items.parentId=' + data.templateId;

      var query = 'SELECT f.id, items.id as fieldId, items.name, (select distinct f2.value from fields f2 where f2.itemId = items.id and f2.fieldId = ' + CONST.TYPE_FIELD_ID() + ') as type, ' +
        'items.templateId, items.masterId, items.parentId, f.created, f.updated, f.itemId, f.value, f.language as lang, f.version, f.isPublish ' +
        'FROM fields f LEFT JOIN items ON items.id=f.fieldId ' +
        'where f.ItemId = ' + data.id;

      var getItemFieldsCallback = function(err, rows) {
        try {
          if (!err) {
            objResponse.data = rows;
            if (callback)
              callback(data);
          } else {
            objResponse.error = "Error: " + err;
            if (callback)
              callback(data);
          }
        } catch (ex) {
          objResponse.error = "Exception: " + ex;
          if (callback)
            callback(data);
        }
      };

      if (database) {
        database.query(query, getItemFieldsCallback);
      }
    },

    getItemGroupFields: function(data, objResponse, callback) {
      if (!data || !data.items || data.items.length <= 0) {
        objResponse.error = "Error: data";
        if (callback)
          callback();
        return;
      }

      var self = this;

      var amountItems = data.items.length;
      if (amountItems > 0) {
        var indexItem = 0;
        var itemsGroup = {};
        _.each(data.items, function(item) {
          var _objResp = {};
          self.getItemFields(item, _objResp, function() {
            if (!(_objResp.error && _objResp.error != "")) {
              indexItem++;
              item.fields = _objResp.data;
              itemsGroup[item.id] = item;
              if (indexItem === amountItems) {
                objResponse.data = itemsGroup;
                if (callback)
                  callback();
              }
            } else {
              objResponse.error = _objResp.error;
              if (callback)
                callback();
            }
          });
        });
      }

    },

    getItemChilds: function(data, requestResponse, callback) {
      var query = "SELECT id, name, parentId, templateId FROM items";
      query += " where parentID = " + data.id;

      var getItemChildsCallback = function(err, rows) {
        var dataResponse = { rows: [] };
        if (!err) {
          dataResponse.rows = rows;
        } else {
          dataResponse.error = "Error: " + err;
        }
        if (callback)
          callback(dataResponse);
      };
      if (database) {
        database.query(query, getItemChildsCallback);
      }
    },

    createItem: function(data, objResponse, callback) {
      if (!data || !data.item || !data.lang) {
        objResponse.error = "Error: data";
        if (callback)
          callback();
        return;
      }

      var self = this;

      var createItemCallback = function(dataResponse) {
        if (!(objResponse.error && objResponse.error != "") && dataResponse.id) {
          //objResponse.data = dataResponse;
          ////objResponse.requestData = data;
          //if (callback)
          //  callback();
          objResponse.item = dataResponse;
          objResponse.data = null;
          if (!data.item.fields) {
            self.getTemplateItemFields({ id: dataResponse.id, templateId: dataResponse.templateId }, objResponse, function() {
              if (objResponse.data && objResponse.item) {
                var versionFirst = 1;
                var fields = objResponse.data;
                objResponse.item.fields = fields;
                if (data.item.fields) {
                  _.each(data.item.fields, function(fieldData) {
                    var fieldChange = _.findWhere(fields, { fieldId: fieldData.fieldId });
                    if (fieldChange) {
                      fieldChange.value = fieldData.value;
                    }
                  });
                }
                _.each(fields, function(field) {
                  field.lang = data.lang;
                  field.version = versionFirst;
                });
                self.saveItem({ isNewVersion: true, item: objResponse.item, lang: data.lang, version: versionFirst }, objResponse, function() {
                  if (callback)
                    callback();
                });
              } else {
                if (callback)
                  callback();
              }
            });
          } else {
            objResponse.item.fields = data.item.fields;
            self.saveItem({ isNewVersion: true, item: objResponse.item }, objResponse, function() {
              if (callback)
                callback();
            });
          }
        } else {
          if (callback)
            callback();
        }
      };
      DatabaseMgr.insertIntoItems({ name: data.item.name, parentId: data.item.parentId, templateId: data.item.templateId }, objResponse, createItemCallback);
    },

    newVersionCreate: function(data, objResponse, callback) {
      if (!data || !data.item || !data.lang) {
        objResponse.error = "Error: data";
        if (callback)
          callback();
        return;
      }

      var self = this;

      objResponse.item = data.item;
      self.getItemFields({ id: data.item.id, templateId: data.item.templateId }, objResponse, function() {
        if (objResponse.data && objResponse.item) {

          var fields = objResponse.data;

          var newVersion = -1;

          var fieldsUnique = _.where(fields, { itemId: data.item.id, lang: data.lang });
          if (!fieldsUnique || fieldsUnique.length == 0) {
            var hashFields = {};
            var arFieldId = [];
            _.each(fields, function(field) {
              if (field.fieldId) {
                if (arFieldId.indexOf(field.fieldId) < 0) {
                  hashFields[field.fieldId] = field;
                  arFieldId.push(field.fieldId);
                }
              }
            });

            if (arFieldId.length > 0) {
              fieldsUnique = [];
              _.each(arFieldId, function(fieldId) {
                fieldsUnique.push(hashFields[fieldId]);
              });
            }
            newVersion = 1;
          } else {
            var maxVersionField = _.max(fieldsUnique, function(field) {
              if (field.version)
                return field.version;
              else
                return 0;
            });
            var maxVersion = 0;
            if (maxVersionField && maxVersionField !== Infinity && maxVersionField !== -Infinity && !_.isNaN(maxVersionField)) {
              maxVersion = maxVersionField.version;
              fieldsUnique = _.where(fieldsUnique, { version: maxVersion });
            }

            if (newVersion <= 0) {
              newVersion = maxVersion + 1;
            }
          }

          if (fieldsUnique && fieldsUnique.length > 0) {
            var newFields = [];
            var hashVersion = {};
            _.each(fieldsUnique, function(field) {
              var newField = _.clone(field);
              newField.lang = data.lang;
              newField.version = newVersion;
              newFields.push(newField);
            });

            //objResponse.item.fields = fields;
            objResponse.newVersion = newVersion;
            self.saveItem({ isNewVersion: true, item: { id: data.item.id, fields: newFields }, lang: data.lang, version: newVersion }, objResponse, function() {
              if (callback)
                callback();
            });
          } else {
            if (callback)
              callback();
          }
        } else {
          if (callback)
            callback();
        }
      });
    },

    copyItem: function (data, objResponse, callback) {
      objResponse.errors = [];
      if (!data || !data.item || !data.item.id) {
        objResponse.errors.push("Error: data");
        if (callback)
          callback();
        return;
      }

      var itemsHash = ServerApplication.getItemsHash();
      var itemSource = itemsHash[data.item.id];

      var parentItemSource;
      if (data.parentItem) {
        parentItemSource = itemsHash[data.parentItem.id];
      }
      else {
        parentItemSource = itemsHash[itemSource.parentId];
      }

      if (!itemSource || !parentItemSource) {
        objResponse.errors.push("Error: source item or its parent item isn't found!");
        if (callback)
          callback();
        return;
      }

      var self = this;
      var objResponseItem = {};
      //var items = ServerApplication.getItems();
      
      //Utils.setChildItems(items, { parentItem: itemSource });
      var allItems = [];
      allItems.push(itemSource);
      Utils.findChildItems(allItems, itemSource);

      //finding items with same name as "itemSource"(previous copying) to define maxIndex of copied item
      var maxNameIndex = 0;        
      if (parentItemSource.childs) {
        _.each(parentItemSource.childs, function (item) {
          if (item.name && item.name.indexOf(itemSource.name) >= 0 && item.name.indexOf("_") >= 0) {
            var lastIndexSymbol = item.name.lastIndexOf("_");
            var stNameIndex = item.name.substring(lastIndexSymbol + 1, item.name.length);
            var iNameIndex = parseInt(stNameIndex);
            if (!isNaN(iNameIndex) && iNameIndex > maxNameIndex)
              maxNameIndex = iNameIndex;
          }
        });
      }
      maxNameIndex++;
      itemSource.name = itemSource.name + "_" + maxNameIndex;
      data.item = itemSource;
      data.item.parentId = parentItemSource.id;
      self.copyChilds({ item: itemSource, counterObj: { indexItem: 0, countItems: allItems.length } }, objResponse, function() {
        if(callback)
          callback();
      });
      

    },
    copyChilds: function (data, objResponse, callback) {
      if (!data || !data.item || !data.item.id || !data.counterObj) {
        objResponse.errors.push("Error: data");
        if (callback)
          callback();
        return;
      }

      var self = this;
      var item = data.item;
      self.copyItemAndFields(data, objResponse, function (dataResponse) {
        data.counterObj.indexItem++;
        if (dataResponse && dataResponse.item) {
          if (!objResponse.items)
            objResponse.items = [];
          objResponse.items.push(dataResponse.item);
        }
        
        if (data.counterObj.indexItem >= data.counterObj.countItems && callback) {
          callback();
        } else if(dataResponse.item) {
          if (item.childs && item.childs.length > 0) {
            for (var i = 0; i < item.childs.length; i++) {
              item.childs[i].parentId = dataResponse.item.id;
              data.item = item.childs[i];
              self.copyChilds(data, objResponse, callback);
            }
          }
        }
        
      });
    },
    copyItemAndFields: function (data, objResponse, callback) {
      if (!data || !data.item || !data.item.id) {
        objResponse.errors.push("Error: data");
        if (callback)
          callback();
        return;
      }

      var self = this;

      var item = data.item;
      var objResponseItem = {};
      self.getItemFields(item, objResponseItem, function () {
        if (!(objResponseItem.error && objResponseItem.error !== "")) {
          item.fields = objResponseItem.data;
          objResponseItem = {};
          self.createItem({ item: item, lang: 'en' }, objResponseItem, function () {
            if (!(objResponseItem.error && objResponseItem.error !== "")) {

            } else {
              objResponse.errors.push("itemId: " + data.item.id + ", Error: " + objResponseItem.error);
            }
            if (callback)
              callback(objResponseItem.data);
          });
        } else {
          objResponse.errors.push("itemId: " + data.item.id + ", Error: " + objResponseItem.error);
          if (callback)
            callback();
        }
      });

    },
    saveItem: function (data, objResponse, callback) {
      //if (!data || !data.item || (data.isNewVersion && (!data.lang || !data.version))) {
      if (!data || !data.item) {
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
              fieldNext.itemName = data.item.name;
              DatabaseMgr.insertIntoFields(fieldNext, objResponse, updateFieldValueCallback);
            } else {
              DatabaseMgr.updateFields(fieldNext, objResponse, updateFieldValueCallback);
            }
          } else {
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
          field.itemName = data.item.name;
          DatabaseMgr.insertIntoFields(field, objResponse, updateFieldValueCallback);
        } else {
          DatabaseMgr.updateFields(field, objResponse, updateFieldValueCallback);
        }
      } else {
        if (callback)
          callback();
      }
    },

    deleteItem: function (data, objResponse, callback) {
      if (!data || !data.item) {
        objResponse.error = "Error: data";
        if (callback)
          callback();
        return;
      }

      var self = this;
      
      var requestResponse = { itemChilds: [{id: data.item.id}], counterRequest: 0 };

      var getItemChildsCallback = function (dataResponse) {
        if (!dataResponse.error && dataResponse.error !== "") {
          var rows = [];
          if (dataResponse.rows)
            rows = dataResponse.rows;          
          
          if (rows && rows.length > 0) {
            _.each(rows, function (row) {
              requestResponse.itemChilds.push(row);
              requestResponse.counterRequest++;
              self.getItemChilds({ id: row.id }, requestResponse, getItemChildsCallback);
            });
          } else {
            requestResponse.counterRequest--;
          }

          if (requestResponse.counterRequest <= 0) {
            DatabaseMgr.deleteItemsAndFields({ item: data.item, itemChilds: requestResponse.itemChilds }, objResponse, callback);
          }
        } else {
          objResponse.error = dataResponse.error;
          if (callback)
            callback(data.item);
        }
      };
      self.getItemChilds({ id: data.item.id }, requestResponse, getItemChildsCallback);
    },
    
    deleteVersion: function (data, objResponse, callback) {
      if (!data || !data.item || !data.lang || !data.version) {
        objResponse.error = "Error: data";
        if (callback)
          callback();
        return;
      }

      DatabaseMgr.deleteFromFields(data, objResponse, function () {
        if (!(objResponse.error && objResponse.error !== "")) {
          
        }
        if (callback)
          callback();
      });
    },

  };
};