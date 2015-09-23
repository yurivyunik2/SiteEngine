exports.DatabaseMgr = function () {
  var _ = require('underscore');

  var Modules = require('../Modules.js');

  var config = Modules.Config;

  var database = Modules.Database;

  return {

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

    insertIntoFields: function (data, objResponse, callback) {
      if (!data || !data.itemId || !data.fieldId || !data.lang || !data.version) {
        objResponse.error = "Error: data";
        if (callback)
          callback();
        return;
      }

      var insertFields = function () {
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

    updateItem: function (data, objResponse, callback) {
      if (!data || !data.id || !data.name) {
        objResponse.error = "Error: data";
        if (callback)
          callback();
        return;
      }

      //if (!data.templateId)
      //  data.templateId = -1;

      //var query = "update items set name='" + data.name + "', templateId=" + data.templateId + ", parentId=" + data.parentId + " where id = " + data.id;
      var query = "update items set name='" + data.name + "'";
      if (data.templateId)
        query += ", templateId=" + data.templateId;
      if (data.parentId)
        query += ", parentId=" + data.parentId;
      if (typeof data.isPublish !== "undefined")
        query += ", isPublish=" + data.isPublish;
      query += " where id = " + data.id;

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

    updateFields: function (data, objResponse, callback) {
      if (!data || !data.itemId || !data.fieldId || !data.lang || !data.version) {
        objResponse.error = "Error: data";
        if (callback)
          callback();
        return;
      }
      //var query = "UPDATE `fields` f SET value='" + data.value + "'\
      //            where itemId=" + data.itemId + " and fieldId=" + data.fieldId + " and language='" + data.lang + "' and version=" + data.version;
      var query = "UPDATE `fields` f SET value='" + data.value + "'";
      if (typeof data.isPublish !== "undefined")
        query += ", isPublish = " + data.isPublish;
      query += " where itemId=" + data.itemId + " and fieldId=" + data.fieldId + " and language='" + data.lang + "' and version=" + data.version;
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



  };
};