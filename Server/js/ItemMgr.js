
exports.ItemMgr = function () {
  var _ = require('underscore');
  
  var ServerApplication = require('./ServerApplication.js');

  //var configModule = require('./Config.js');
  //var config = new configModule.Config;
  var config = ServerApplication.Config;

  //var dbModule = require('./Database/Database.js');
  //var database = new dbModule.Database();
  var database = ServerApplication.Database;

  //var databaseMgrModule = require('./Database/DatabaseMgr.js');
  //var DatabaseMgr = new databaseMgrModule.DatabaseMgr();
  var DatabaseMgr = ServerApplication.DatabaseMgr;

  var currentRequest;

  return {

    setRequest: function (request) {
      currentRequest = request;
    },

    getItems: function (data, objResponse, callback) {
      var query = "SELECT id, name, parentid as parent, templateId FROM items";
      if (data && data.parent) {
        query += " where parentID = " + data.parent;
      }
      var getItemsCallback = function (err, rows) {
        if (!err) {
          objResponse.isOK = true;
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

    getItemFields: function (data, objResponse, callback) {
      if (!data || !data.id || !data.templateId) {
        objResponse.error = "Error: data";
        if (callback)
          callback();
        return;
      }

      var self = this;
      if (!data.baseId)
        data.baseId = 0;

      var query = 'SELECT f.id, items.id as fieldId, items.name, (select distinct f2.value from fields f2 where f2.itemId = items.id and f2.fieldId = ' + config.DATABASE.TYPE_FIELD_ID() + ') as type, items.templateId, items.masterId, items.parentId, items.created, items.updated, f.itemId, f.value, f.language as lang, f.version FROM items\
                   LEFT JOIN fields f ON items.id=f.fieldId and (f.itemId=items.parentId || f.itemId=' + data.id + ' || f.itemId=' + data.baseId + ' || f.itemId=' + data.templateId + ')\
                   where items.parentId=' + data.templateId;

      var getTemplateFieldsForTemplateCallback = function (err, rows) {
        if (!err) {
          var fields = rows;
          var filteredFields = [];
          if (fields && fields.length > 0) {
            if (!objResponse.data)
              objResponse.data = [];

            _.each(fields, function (field) { 
              var existedField = _.findWhere(objResponse.data, { fieldId: field.fieldId, lang: field.lang, version: field.version });
              if (existedField) {
                //if (existedField.itemId != data.id || !existedField.value) { // if there isn't item's(owned) field then remove field and add fresh(next) field
                if (existedField.itemId != data.id) { // if there isn't item's(owned) field then remove field and add fresh(next) field
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
          _.each(objResponse.data, function (field) {
            if (config.DATABASE.BaseTemplateFieldID() == field.fieldId) {
              if (!baseTemplateField || field.itemId == data.id)
                baseTemplateField = field;
            }
          });

          if (objResponse.indexBaseTemplate >= 0)
            objResponse.indexBaseTemplate++;
          else
            objResponse.indexBaseTemplate = 0;

          if (baseTemplateField && baseTemplateField.value && !objResponse.amountBaseTemplate) {
            var arTemplates = baseTemplateField.value.split("|");
            objResponse.amountBaseTemplate = arTemplates.length;
            //if (objResponse.amountBaseTemplate >= 0)
            //  objResponse.amountBaseTemplate += arTemplates.length;
            //else              
            for (var i = 0; i < arTemplates.length; i++) {
              var template = arTemplates[i];
              self.getItemFields({ templateId: template, id: data.id, baseId: data.templateId }, objResponse, callback);
            }
          }

          if (objResponse.indexBaseTemplate >= objResponse.amountBaseTemplate || (!baseTemplateField && !objResponse.amountBaseTemplate)) {
            objResponse.isOK = true;
            if (callback)
              callback(data);
          }
          
        } else {
          
        }

      };

      var getTemplateFieldsForItemCallback = function (err, rows) {
        try {
          if (!err) {

            var addField = function (field) {
              var existedField = _.findWhere(objResponse.data, { fieldId: field.fieldId, lang: field.lang, version: field.version });
              if (existedField) {
                //if (existedField.itemId != data.id || !existedField.value) { // if there isn't item's(owned) field then remove field and add fresh(next) field
                if (existedField.itemId != data.id) { // if there isn't item's(owned) field then remove field and add fresh(next) field
                  objResponse.data = _.without(objResponse.data, existedField);
                  objResponse.data.push(field);
                }
              } else { // fields are not added previously
                objResponse.data.push(field);
              }
            };

            var fields = rows;
            if (fields && fields.length > 0) {
              if (!objResponse.data)
                objResponse.data = [];

              _.each(fields, function (field) {
                if (parseInt(field.type) === config.DATABASE.BLOB_TYPE_ID()) {
                  query = 'SELECT CONVERT(Data USING utf8) as Data FROM blobs b where id=' + field.value;
                  if (database) {
                    database.query(query, function(err, rows) {
                      if (!err) {
                        if (rows && rows.length > 0)
                          field.value = rows[0].Data;
                        addField(field); 
                      }
                    });
                  }
                } else {
                  addField(field);
                }

                //objResponse.data.push(field);                
              });
            }

            query = 'SELECT f.id, items.id as fieldId, items.name, (select distinct f2.value from fields f2 where f2.itemId = items.id and f2.fieldId = ' + config.DATABASE.TYPE_FIELD_ID() + ') as type, items.templateId, items.masterId, items.parentId, items.created, items.updated, f.itemId, f.value, f.language as lang, f.version FROM items\
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

    getItemChilds: function (data, requestResponse, callback) {
      var query = "SELECT id, name, parentid as parent, templateId FROM items";
      query += " where parentID = " + data.id;
      
      var getItemChildsCallback = function (err, rows) {
        var dataResponse = { rows: []};
        if (!err) {
          dataResponse.isOK = true;
          dataResponse.rows = rows;
        } else {
          dataResponse.isOK = false;
          dataResponse.error = "Error: " + err;
        }
        if (callback)
          callback(dataResponse);
      };
      if (database) {
        database.query(query, getItemChildsCallback);
      }
    },

    createItem: function (data, objResponse, callback) {
      if (!data || !data.item || !data.lang) {
        objResponse.error = "Error: data";
        if (callback)
          callback();
        return;
      }

      var self = this;

      var createItemCallback = function (dataResponse) {
        if (!(objResponse.error && objResponse.error != "") && dataResponse.id) {
          //objResponse.data = dataResponse;
          ////objResponse.requestData = data;
          //objResponse.isOK = true;
          //if (callback)
          //  callback();

          objResponse.item = dataResponse;
          objResponse.data = null;
          self.getItemFields({ id: dataResponse.id, templateId: dataResponse.templateId }, objResponse, function () {
            if (objResponse.data && objResponse.item) {
              var versionFirst = 1;
              var fields = objResponse.data;
              objResponse.item.fields = fields;
              if (data.item.fields) {
                _.each(data.item.fields, function (fieldData) {
                  var fieldChange = _.findWhere(fields, { fieldId: fieldData.fieldId });
                  if (fieldChange) {
                    fieldChange.value = fieldData.value;
                  }
                });
              }
              _.each(fields, function (field) {
                field.lang = data.lang;
                field.version = versionFirst;
              });
              self.saveItem({ isNewVersion: true, item: objResponse.item, lang: data.lang, version: versionFirst }, objResponse, function () {
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
      DatabaseMgr.insertIntoItems({ name: data.item.name, parentId: data.item.parentId, templateId: data.item.templateId }, objResponse, createItemCallback);
    },

    newVersionCreate: function (data, objResponse, callback) {
      if (!data || !data.item || !data.lang) {
        objResponse.error = "Error: data";
        if (callback)
          callback();
        return;
      }

      var self = this;
        
      objResponse.item = data.item;
      self.getItemFields({ id: data.item.id, templateId: data.item.templateId }, objResponse, function () {
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
            var maxVersionField = _.max(fieldsUnique, function (field) {
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
            _.each(fieldsUnique, function (field) {
              var newField = _.clone(field);
              newField.lang = data.lang;
              newField.version = newVersion;
              newFields.push(newField);
            });

            //objResponse.item.fields = fields;
            objResponse.newVersion = newVersion;
            self.saveItem({ isNewVersion: true, item: { id: data.item.id, fields: newFields }, lang: data.lang, version: newVersion }, objResponse, function () {
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

    saveItem: function (data, objResponse, callback) {
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
        if (dataResponse.isOK) {
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
          objResponse.isOK = true;
        }
        if (callback)
          callback();
      });
    },

  };
};