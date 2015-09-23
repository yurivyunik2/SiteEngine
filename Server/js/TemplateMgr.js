
exports.TemplateMgr = function() {
  var _ = require('underscore');

  var Modules = require('./Modules.js');

  var DatabaseMgr = Modules.DatabaseMgr;

  return {
    //getTemplates: function (objResponse, callback) {
    //  var self = this;

    //  var getTemplateFieldsCallback = function (dataResponse) {
    //    if (!(objResponse.error && objResponse.error != "")
    //        && dataResponse.parent && dataResponse.templates && dataResponse.indexTemplate >= 0) {

    //      if (dataResponse.indexTemplate < dataResponse.templates.length) {
    //        dataResponse.templates[dataResponse.indexTemplate].fields = objResponse.data;
    //      }

    //      if (dataResponse.indexTemplate < (dataResponse.templates.length - 1)) {
    //        var indexTemplate = dataResponse.indexTemplate;
    //        indexTemplate++;
    //        var templateNext = dataResponse.templates[indexTemplate];
    //        if (templateNext) {
    //          dataResponse.indexTemplate = indexTemplate;
    //          dataResponse.parent = templateNext.id;
    //          self.getItems(dataResponse, objResponse, getTemplateFieldsCallback);
    //        }
    //      } else {
    //        objResponse.data = dataResponse.templates;
    //        if (callback)
    //          callback();
    //      }
    //    } else {
    //      if (callback)
    //        callback();
    //    }
    //  };

    //  var getTemplatesCallback = function () {
    //    if (!(objResponse.error && objResponse.error != "")) {
    //      var templates = objResponse.data;
    //      if (templates && templates.length > 0) {
    //        var template = templates[0];
    //        self.getItems({ parent: template.id, indexTemplate: 0, templates: templates }, objResponse, getTemplateFieldsCallback);
    //      } else {
    //        if (callback)
    //          callback();
    //      }
    //    } else {
    //      if (callback)
    //        callback();
    //    }
    //  };
    //  this.getItems({ parent: config.DATABASE.TemplateRootID() }, objResponse, getTemplatesCallback);
    //},

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
            DatabaseMgr.insertIntoFields(fieldInFieldTemplate, objResponse, insertIntoFieldsCallback);
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
            DatabaseMgr.insertIntoItems(fieldNext, objResponse, addFieldForItemFieldCallback);
          } else {
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
            DatabaseMgr.insertIntoItems(field, objResponse, addFieldForItemFieldCallback);
          } else {
            objResponse.requestData = data;
            if (callback)
              callback();
          }
        } else {
          if (callback)
            callback();
        }
      };
      DatabaseMgr.insertIntoItems({ name: data.item.name, parentId: data.item.parentId, templateId: data.item.templateId }, objResponse, addItemTemplateCallback);
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
            //if (callback)
            //  callback();
            self.addFieldsForTemplate(data, objResponse, callback);
          }
        } else {
          if (callback)
            callback();
        }
      };
      DatabaseMgr.updateItem({ id: data.item.id, name: data.item.name, parentId: data.item.parentId, templateId: data.item.templateId }, objResponse, updateItemTemplateCallback);
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
            DatabaseMgr.insertIntoFields(fieldInFieldTemplate, objResponse, insertIntoFieldsCallback);
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
              DatabaseMgr.insertIntoItems(fieldNext, objResponse, addFieldForItemFieldCallback);
            }
            //DatabaseMgr.insertIntoItems(fieldNext, objResponse, addFieldForItemFieldCallback);
          } else {
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
          DatabaseMgr.insertIntoItems(field, objResponse, addFieldForItemFieldCallback);
        }
      } else {
        if (callback)
          callback();
      }

    },

  };
};