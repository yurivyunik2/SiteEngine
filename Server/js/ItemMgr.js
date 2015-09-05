
exports.ItemMgr = function () {
  var _ = require('underscore');
  
  var configModule = require('./Config.js');
  var config = new configModule.Config;

  var dbModule = require('./Database.js');
  var database = new dbModule.Database();

  var currentRequest;

  return {

    setRequest: function (request) {
      currentRequest = request;
    },

    findChildItems: function (allItems, parentItem) {
      if (!allItems || !parentItem)
        return;
      
      var self = this;
      for (var i = 0; i < allItems.length; i++) {
        var item = allItems[i];
        if (item.parent == parentItem.id) {
          if (!parentItem.childs)
            parentItem.childs = [];

          parentItem.childs.push(item);
          self.findChildItems(allItems, item);
        }
      }
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


    getTemplates: function (objResponse, callback) {
      var self = this;
      
      var getTemplateFieldsCallback = function (dataResponse) {
        if (!(objResponse.error && objResponse.error != "")
            && dataResponse.parent && dataResponse.templates && dataResponse.indexTemplate >= 0) {

          if (dataResponse.indexTemplate < dataResponse.templates.length) {
            dataResponse.templates[dataResponse.indexTemplate].fields = objResponse.data;
          }

          if (dataResponse.indexTemplate < (dataResponse.templates.length - 1)) {
            var indexTemplate = dataResponse.indexTemplate;
            indexTemplate++;
            var templateNext = dataResponse.templates[indexTemplate];
            if (templateNext) {
              dataResponse.indexTemplate = indexTemplate;
              dataResponse.parent = templateNext.id;
              self.getItems(dataResponse, objResponse, getTemplateFieldsCallback);
            }
          } else {
            objResponse.isOK = true;
            objResponse.data = dataResponse.templates;
            if (callback)
              callback();
          }
        } else {
          if (callback)
            callback();
        }
      };

      var getTemplatesCallback = function () {
        if (!(objResponse.error && objResponse.error != "")) {
          var templates = objResponse.data;
          if (templates && templates.length > 0) {
            var template = templates[0];
            self.getItems({ parent: template.id, indexTemplate: 0, templates:templates }, objResponse, getTemplateFieldsCallback);
          } else {
            if (callback)
              callback();
          }
        } else {
          if (callback)
            callback();
        }
      };
      this.getItems({ parent: config.DATABASE.TemplateRootID() }, objResponse, getTemplatesCallback);
    },

    addTemplate: function (data, objResponse, callback) {
      if (!data || !data.item || !data.lang) {
        objResponse.error = "Error: data";
        if (callback)
          callback();
        return;
      }

      var self = this;

      var versionFirst = 1;
      var addItemFieldCallback;

      var addFieldForItemFieldCallback = function (field) {

        var insertIntoFieldsCallback = function () {
          if (!(objResponse.error && objResponse.error != "")
              && field) {            
            addItemFieldCallback(field);
          } else {
            if (callback)
              callback();
          }
        };

        if (!(objResponse.error && objResponse.error != "")
            && field) {
          if (field.fields && field.fields.length > 0) {
            _.each(field.fields, function (f) {
              f.itemId = field.id;
            });
            var fieldInFieldTemplate = field.fields[0];
            fieldInFieldTemplate.indexField = 0;
            fieldInFieldTemplate.lang = data.lang;
            fieldInFieldTemplate.version = versionFirst;
            self.insertIntoFields(fieldInFieldTemplate, objResponse, insertIntoFieldsCallback);
          }
        } else {
          if (callback)
            callback();
        }
      };

      addItemFieldCallback = function (field) {
        if (!(objResponse.error && objResponse.error != "")
            && field && field.indexField >= 0) {
          if (data.fields && data.fields.length > 0 && field.indexField < (data.fields.length - 1)) {
            var indexField = field.indexField;
            indexField++;
            var fieldNext = data.fields[indexField];            
            fieldNext.indexField = indexField;
            self.insertIntoItems(fieldNext, objResponse, addFieldForItemFieldCallback);
          } else {
            objResponse.isOK = true;
            objResponse.requestData = data;
            if (callback)
              callback();
          }
        } else {
          if (callback)
            callback();
        }
      };

      var addItemTemplateCallback = function (dataResponse) {
        if (!(objResponse.error && objResponse.error != "") && dataResponse.id) {
          data.item = dataResponse;
          if (data.fields && data.fields.length > 0) {
            _.each(data.fields, function (field) {
              field.parentId = dataResponse.id;
            });
            var field = data.fields[0];
            field.indexField = 0;
            self.insertIntoItems(field, objResponse, addFieldForItemFieldCallback);
          } else {
            objResponse.isOK = true;
            objResponse.requestData = data;
            if (callback)
              callback();
          }          
        } else {
          if (callback)
          callback();
        }
      };
      this.insertIntoItems({ name: data.item.name, parentId: data.item.parentId, templateId: data.item.templateId }, objResponse, addItemTemplateCallback);      
    },

    updateTemplate: function (data, objResponse, callback) {
      if (!data || !data.item || !data.item.id) {
        objResponse.error = "Error: data";
        if (callback)
          callback();
        return;
      }

      var self = this;

      var removeItemFieldCallback;

      removeItemFieldCallback = function (field) {
        if (!(objResponse.error && objResponse.error != "")
            && field && field.indexRemoveField >= 0) {
          if (data.removeFields && data.removeFields.length > 0 && field.indexRemoveField < (data.removeFields.length - 1)) {
            var indexRemoveField = field.indexRemoveField;
            indexRemoveField++;
            var fieldNext = data.removeFields[indexRemoveField];
            fieldNext.indexRemoveField = indexRemoveField;
            self.deleteItem({ item: fieldNext }, objResponse, removeItemFieldCallback);
          } else {
            //objResponse.isOK = true;
            //if (callback)
            //  callback();

            // add fields
            self.addFieldsForTemplate(data, objResponse, callback);
          }
        } else {
          if (callback)
            callback();
        }
      };

      var updateItemTemplateCallback = function (dataResponse) {
        if (!(objResponse.error && objResponse.error != "") && dataResponse.id) {
          if (data.removeFields && data.removeFields.length > 0) {
            var field = data.removeFields[0];
            field.indexRemoveField = 0;
            self.deleteItem({ item: field }, objResponse, removeItemFieldCallback);
          } else {
            //objResponse.isOK = true;
            //if (callback)
            //  callback();
            self.addFieldsForTemplate(data, objResponse, callback);
          }
        } else {
          if (callback)
            callback();
        }
      };
      this.updateItem({ id: data.item.id, name: data.item.name, parentId: data.item.parentId, templateId: data.item.templateId }, objResponse, updateItemTemplateCallback);
    },

    addFieldsForTemplate: function (data, objResponse, callback) {
      if (!data || !data.item || !data.item.id || !data.lang) {
        objResponse.error = "Error: data";
        if (callback)
          callback();
        return;
      }

      var self = this;

      var versionFirst = 1;
      var addItemFieldCallback;

      var addFieldForItemFieldCallback = function (field) {

        var insertIntoFieldsCallback = function () {
          if (!(objResponse.error && objResponse.error != "")
              && field) {
            addItemFieldCallback(field);
          } else {
            if (callback)
              callback();
          }
        };

        if (!(objResponse.error && objResponse.error != "")
            && field) {
          if (field.fields && field.fields.length > 0) {
            _.each(field.fields, function (f) {
              f.itemId = field.id;
            });
            var fieldInFieldTemplate = field.fields[0];
            fieldInFieldTemplate.indexField = 0;
            fieldInFieldTemplate.lang = data.lang;
            fieldInFieldTemplate.version = versionFirst;
            self.insertIntoFields(fieldInFieldTemplate, objResponse, insertIntoFieldsCallback);
          }
        } else {
          if (callback)
            callback();
        }
      };

      addItemFieldCallback = function (field) {
        if (!(objResponse.error && objResponse.error != "")
            && field && field.indexField >= 0) {
          if (data.fields && data.fields.length > 0 && field.indexField < (data.fields.length - 1)) {
            var indexField = field.indexField;
            indexField++;
            var fieldNext = data.fields[indexField];
            fieldNext.indexField = indexField;
            fieldNext.parentId = data.item.id;
            if (fieldNext.id >= 0) {
              addItemFieldCallback(fieldNext);
            } else {              
              self.insertIntoItems(fieldNext, objResponse, addFieldForItemFieldCallback);
            }
            //self.insertIntoItems(fieldNext, objResponse, addFieldForItemFieldCallback);
          } else {
            objResponse.isOK = true;
            objResponse.requestData = data;
            if (callback)
              callback();
          }
        } else {
          if (callback)
            callback();
        }
      };

      if (data.fields && data.fields.length > 0) {
        _.each(data.fields, function (field) {
          field.parentId = data.item.id;
        });
        var field = data.fields[0];
        field.indexField = 0;
        if (field.id >= 0) {
          addItemFieldCallback(field);
        } else {
          self.insertIntoItems(field, objResponse, addFieldForItemFieldCallback);
        }        
      } else {
        objResponse.isOK = true;
        if (callback)
          callback();
      }
      
    },

    addItem: function (data, objResponse, callback) {
      if (!data || !data.item || !data.lang) {
        objResponse.error = "Error: data";
        if (callback)
          callback();
        return;
      }

      var self = this;

      var createItemCallback = function (dataResponse) {
        if (!(objResponse.error && objResponse.error != "") && dataResponse.id) {

          //objResponse.item = dataResponse;
          //objResponse.data = null;
          //self.getItemFields({ id: dataResponse.id, templateId: dataResponse.templateId }, objResponse, function () {
          //  if (objResponse.data && objResponse.item) {
          //    var versionFirst = 1;
          //    var fields = objResponse.data;
          //    objResponse.item.fields = fields;
          //    _.each(fields, function (field) {
          //      field.lang = data.lang;
          //      field.version = versionFirst;
          //    });
          //    self.saveItem({ isNewVersion: true, item: objResponse.item, lang: data.lang, version: versionFirst }, objResponse, function () {
          //      if (callback)
          //        callback();
          //    });
          //  } else {
          //    if (callback)
          //      callback();
          //  }
          //});

        } else {
          if (callback)
            callback();
        }
      };
      this.createItem(data, objResponse, createItemCallback);      
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
      this.insertIntoItems({ name: data.item.name, parentId: data.item.parentId, templateId: data.item.templateId }, objResponse, createItemCallback);
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
              //  self.updateFields(fieldNext, objResponse, updateFieldValueCallback);
              //else {
              //  fieldNext.itemId = data.item.id;
              //  self.insertIntoFields(fieldNext, objResponse, updateFieldValueCallback);
              //}
              fieldNext.itemId = data.item.id;
              self.insertIntoFields(fieldNext, objResponse, updateFieldValueCallback);
            } else {
              self.updateFields(fieldNext, objResponse, updateFieldValueCallback);
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
          //  self.updateFields(field, objResponse, updateFieldValueCallback);
          //else {
          //  field.itemId = data.item.id;
          //  self.insertIntoFields(field, objResponse, updateFieldValueCallback);
          //}
          field.itemId = data.item.id;
          self.insertIntoFields(field, objResponse, updateFieldValueCallback);
        } else {
          self.updateFields(field, objResponse, updateFieldValueCallback);
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
            self.deleteItemsAndFields({ item: data.item, itemChilds: requestResponse.itemChilds }, objResponse, callback);
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

      var self = this;
      self.deleteFromFields(data, objResponse, function () {
        if (!(objResponse.error && objResponse.error != "")) {
          objResponse.isOK = true;
        }
        if (callback)
          callback();
      });
    },

    insertIntoItems: function (data, objResponse, callback) {
      if (!data || !data.name || !data.parentId) {
        objResponse.error = "Error: data";
        if (callback)
          callback();
        return;
      }

      if (!data.templateId)
        data.templateId = -1;

      var query = "INSERT INTO db_site_engine.items(Name, ParentID, TemplateID, Created, Updated) VALUES('" + data.name + "', " + data.parentId + ", " + data.templateId + ", NOW(), NOW())";
      var insertIntoItemsCallback = function (err, rows) {
        if (!err && rows && rows.insertId) {
          data.id = rows.insertId;
        } else {
          objResponse.error = "Error: " + err;
        }
        if (callback)
          callback(data);
      };
      if (database) {
        database.query(query, insertIntoItemsCallback);
      }
    },

    updateItem: function (data, objResponse, callback) {
      if (!data || !data.id || !data.name || !data.parentId) {
        objResponse.error = "Error: data";
        if (callback)
          callback();
        return;
      }

      if (!data.templateId)
        data.templateId = -1;

      var query = "update items set name='" + data.name + "', templateId=" + data.templateId + ", parentId=" + data.parentId + " where id = " + data.id;
      
      var updateItemsCallback = function (err, rows) {
        if (!err && rows) {
          //data.id = rows.insertId;
        } else {
          objResponse.error = "Error: " + err;
        }
        if (callback)
          callback(data);
      };
      if (database) {
        database.query(query, updateItemsCallback);
      }
    },


    insertIntoFields: function (data, objResponse, callback) {
      if (!data || !data.itemId || !data.fieldId || !data.lang || !data.version) {
        objResponse.error = "Error: data";
        if (callback)
          callback();
        return;
      }

      var insertFields = function() {
        var query = "INSERT INTO `fields`(ItemId, Language, Version, FieldId, Value, Created, Updated)  VALUES(" + data.itemId + ",'" + data.lang + "'," + data.version + "," + data.fieldId + ",'" + data.value + "', NOW(), NOW())";
        var insertIntoFieldsCallback = function (err, rows) {
          if (!err) {

          } else {
            objResponse.error = "Error: " + err;
          }
          if (callback)
            callback(data);
        };
        if (database) {
          database.query(query, insertIntoFieldsCallback);
        }

      }

      // INSERT INTO BLOBS
      if (parseInt(data.type) === config.DATABASE.BLOB_TYPE_ID()) {
        var query = "INSERT INTO `blobs`(Data, Created)  VALUES('" + data.value + "', NOW())";
        var insertIntoBlobsCallback = function (err, rows) {
          if (!err) {
            if (rows) {
              data.value = rows.insertId;
              insertFields();
            }
            
          } else {
            objResponse.error = "Error: " + err;
          }
          if (callback)
            callback(data);
        };
        if (database) {
          database.query(query, insertIntoBlobsCallback);
        }


      }
      // INSERT INTO FIELDS
      else {
        insertFields();
      }
    },

    deleteFromFields: function (data, objResponse, callback) {
      if (!data || !data.item || !data.item.id) {
        objResponse.error = "Error: data";
        if (callback)
          callback();
        return;
      }
      var query = "DELETE FROM fields WHERE itemId =" + data.item.id;
      if (data.lang)
        query += " and language='" + data.lang + "'";
      if (data.version)
        query += " and version=" + data.version;
      var deleteFromFieldsCallback = function (err, rows) {
        if (!err) {

        } else {
          objResponse.error = "Error: " + err;
        }
        if (callback)
          callback(data);
      };
      if (database) {
        database.query(query, deleteFromFieldsCallback);
      }
    },

    updateFields: function (data, objResponse, callback) {
      if (!data || !data.itemId || !data.fieldId || !data.lang || !data.version) {
        objResponse.error = "Error: data";
        if (callback)
          callback();
        return;
      }
      var query = "UPDATE `fields` f SET value='" + data.value + "'\
                  where itemId=" + data.itemId + " and fieldId=" + data.fieldId + " and language='" + data.lang + "' and version=" + data.version;
      var updateFieldsCallback = function (err, rows) {
        if (!err) {

        } else {
          objResponse.error = "Error: " + err;
        }
        if (callback)
          callback(data);
      };
      if (database) {
        database.query(query, updateFieldsCallback);
      }
    },
    
    deleteItemsAndFields: function (data, objResponse, callback) {
      if (!data || !data.itemChilds) {
        objResponse.error = "Error: data";
        if (callback)
          callback();
        return;
      }
      
      var strIn = "(";
      _.each(data.itemChilds, function (child) {
        strIn += child.id + ",";
      });
      strIn += "-1)";

      var query = "DELETE FROM items where id in " + strIn;

      var deleteFromFieldsCallback = function (err, rows) {
        if (!err) {

        } else {
          objResponse.error = "Error: " + err;
        }
        if (callback) {
          objResponse.data = data;
          callback(data.item);
        }
      };
      
      var deleteFromBlobsCallback = function (err, rows) {
        if (!err) {
          query = "DELETE FROM fields where itemId in " + strIn + " or fieldId in " + strIn;
          if (database) {
            database.query(query, deleteFromFieldsCallback);
          }
        } else {
          objResponse.error = "Error: " + err;
          if (callback)
            callback();
        }
      };
      var deleteFromItemsCallback = function (err, rows) {
        if (!err) {
          query = "DELETE FROM blobs where id in (select value FROM fields where itemId in " + strIn + " or fieldId in " + strIn + ")";          
          if (database) {
            database.query(query, deleteFromBlobsCallback);
          }
        } else {
          objResponse.error = "Error: " + err;
          if (callback)
            callback();
        }
      };


      if (database) {
        database.query(query, deleteFromItemsCallback);
      }
    },

  };
};