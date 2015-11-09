exports.DatabaseMgr = function () {
  var _ = require('underscore');
  var fs = require('fs');

  var Modules = require('../Modules.js');

  var CONST = Modules.CONST;

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
      };

      if (data.fieldId === CONST.SRC_MEDIA_FIELDS_ID()) {
        if (data.itemName) {
          var body = data.value;
          var base64Data = body.replace(/^data:image\/png;base64,/, "");
          var binaryData = new Buffer(base64Data, 'base64').toString('binary');
          
          try {
            var uploadDir = "." + CONST.UPLOAD_MEDIA_PATH();
            if (!fs.existsSync(uploadDir)) {
              fs.mkdirSync(uploadDir);
            }

            var filePath = CONST.UPLOAD_MEDIA_PATH() + data.itemId + "_" + data.itemName;

            require("fs").writeFile("." + filePath, binaryData, "binary", function (err) {
              if (!err) {
                data.value = filePath;
                insertFields();
              } else {
                objResponse.error = "Error: " + err;
                if (callback)
                  callback(data);
              }
            });
          } catch (ex) {
            objResponse.error = "Error: " + ex;
            if (callback)
              callback(data);
          }
          
        }
      }
      //// INSERT INTO BLOBS
      //else if (parseInt(data.type) === CONST.BLOB_TYPE()) { 
      //  var query = "INSERT INTO `blobs`(Data, Created)  VALUES('" + data.value + "', NOW())";
      //  var insertIntoBlobsCallback = function (err, rows) {
      //    if (!err) {
      //      if (rows) {
      //        data.value = rows.insertId;
      //        insertFields();
      //      }

      //    } else {
      //      objResponse.error = "Error: " + err;
      //    }
      //    if (callback)
      //      callback(data);
      //  };
      //  if (database) {
      //    database.query(query, insertIntoBlobsCallback);
      //  }
      //}
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

      //var deleteFromBlobsCallback = function (err, rows) {
      //  if (!err) {
      //    query = "DELETE FROM fields where itemId in " + strIn + " or fieldId in " + strIn;
      //    if (database) {
      //      database.query(query, deleteFromFieldsCallback);
      //    }
      //  } else {
      //    objResponse.error = "Error: " + err;
      //    if (callback)
      //      callback();
      //  }
      //};
      //var deleteFromItemsCallback = function (err, rows) {
      //  if (!err) {
      //    query = "DELETE FROM blobs where id in (select value FROM fields where itemId in " + strIn + " or fieldId in " + strIn + ")";
      //    if (database) {
      //      database.query(query, deleteFromBlobsCallback);
      //    }
      //  } else {
      //    objResponse.error = "Error: " + err;
      //    if (callback)
      //      callback();
      //  }
      //};

      var deleteFromItemsCallback = function (err, rows) {
        if (!err) {
          //var srcField = _.findWhere(data.itemChilds, { fieldId: CONST.SRC_MEDIA_FIELDS_ID(), lang: field.lang, version: field.version });
          //if (srcField && srcField.value) {
          //  var filePath = "." + srcField.value;
          //  if (fs.existsSync(srcField.value)) {
          //    try {
          //      fs.unlinkSync(srcField.value);
          //    } catch (ex) {
          //      objResponse.error = "Error: " + ex;
          //    }
          //  }
          //}

          var path = require('path');
          var currentDirPath = "." + CONST.UPLOAD_MEDIA_PATH();
          var arFiles = [];
          try {
            arFiles = fs.readdirSync(currentDirPath);
          } catch (ex) {
          }

          if (arFiles && arFiles.length > 0) {
            arFiles.forEach(function (name) {
              var itemId;
              if (name.indexOf("_") >= 0) {
                itemId = name.substr(0, name.indexOf("_"));
              }
              //var  data.itemChilds
              if (itemId && itemId !== "") {
                var child = _.findWhere(data.itemChilds, { id: parseInt(itemId) });
                if (child) {
                  var filePath = path.join(currentDirPath, name);
                  if (fs.existsSync(filePath)) {
                    try {
                      fs.unlinkSync(filePath);
                    } catch (ex) {
                      objResponse.error = "Error: " + ex;
                    }
                  }

                }
              }
            });
          }


          if (!objResponse.error) {
            query = "DELETE FROM fields where itemId in " + strIn + " or fieldId in " + strIn;
            if (database) {
              database.query(query, deleteFromFieldsCallback);
            }
          } else {
            if (callback)
              callback();
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

    historyLog: function(dataRequest, objResponse) {
      try {
        if (!dataRequest || !dataRequest.action || !dataRequest.item || !objResponse) {
          return;
        }

        var self = this;

        var historyResponse = {};
        var infoData = {
           item: {
             id: dataRequest.item.id,
             name: dataRequest.item.name,
           },
        };
        var infoResults = {
          isOK: objResponse.isOK,
          error: objResponse.error,
        };
        self.insertIntoHistory({ action: dataRequest.action, info: "Data: " + JSON.stringify(infoData) + ", Results: " + JSON.stringify(infoResults) }, historyResponse, function () {
          if (historyResponse.error) {
            var error = historyResponse.error.replace(/'/g, "\"");
            self.insertIntoHistory({ action: dataRequest.action, info: error }, historyResponse);
          }
        });
      } catch (ex) {

      }
    },

    insertIntoHistory: function (data, objResponse, callback) {
      if (!data || !data.action) {
        objResponse.error = "Error: data";
        if (callback)
          callback();
        return;
      }
      if (!data.user || typeof data.user !== "number" || isNaN(parseInt(data.user)))
        data.user = -1;

      var query = "INSERT INTO db_site_engine.history(action, info, user, datetime) VALUES('" + data.action + "', '" + data.info + "', " + data.user + ", NOW())";
      var insertIntoHistoryCallback = function (err, rows) {
        if (!err && rows && rows.insertId) {
          
        } else {
          objResponse.error = "Error: " + err;
        }
        if (callback)
          callback(data);
      };
      if (database) {
        database.query(query, insertIntoHistoryCallback);
      }

    },

  };
};