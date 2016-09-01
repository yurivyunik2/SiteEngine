
define(["application", "CONST", "Utils"], function (application, CONST, Utils) {

  function InfoPanel($parentElem, engineTree) {
    var self;
    var $dvInfoPanelElem;

    var infoPanel = {

      infoPanelSelector: ".dvInfoPanel",

      constructor: function() {
        self = this;
      },

      // populateInfoPanel
      populateInfoPanel: function (itemData) {
        //
        if (engineTree)
          engineTree.addTemplatesNew(itemData);

        if (!$dvInfoPanelElem || $dvInfoPanelElem.length === 0)
          $dvInfoPanelElem = $parentElem.find(".dvInfoPanel");

        if ($dvInfoPanelElem.length === 0)
          return;

        $dvInfoPanelElem.html("");

        // standart parameters
        var html = '';
        html += '<table class="tbStandardParams">' +
                  '<colgroup>' +
                    '<col style="white-space:nowrap" valign="top">' +
                    '<col style="white-space:nowrap" valign="top">' +
                  '</colgroup>' +
                  '<tbody>' +
                  '</tbody>' +
                '</table>';

        $dvInfoPanelElem.append(html);

        var tbStandardParamsElem = $parentElem.find(".tbStandardParams");
        var tbody = tbStandardParamsElem.find("tbody");

        ///
        /// MEDIA - show media manager
        ///
        if (itemData.id === CONST.MEDIA_ROOT_ID()) {
          tbody.append('<button type="button" style="margin: 15px 0px;" class="btn btn-success">Open Media Manager</button>');
          var $btnMediaManager = tbody.children().last();
          $btnMediaManager.click(function () {
            var modalFormCtrl = application.getModalFormCtrl();
            modalFormCtrl.setType(modalFormCtrl.FORM_TYPE().IMAGE_GALLERY, {});
          });
        }
        

        // Fields
        var fields = itemData.fields;
        var curLangguage = Utils.getLanguageCurrent();
        var curVersion = Utils.getVersionCurrent();
        var fieldsLang;
        if (fields && curLangguage && curVersion) {
          fieldsLang = _.where(fields, { itemId: itemData.id, lang: curLangguage.code, version: parseInt(curVersion) });
        }

        var listParam = [
          "id",
          "name",
          "template",
          "templateId",
          "path",
          "version",
          //"updated",
          //"createdBy",
        ];

        var listTitle = {};
        listTitle["id"] = "ID";
        listTitle["name"] = "Item Name";
        listTitle["template"] = "Template";
        listTitle["templateId"] = "TemplateId";
        listTitle["path"] = "Path";
        listTitle["version"] = "Version";
        //listTitle["updated"] = "Updated";
        //listTitle["createdBy"] = "Created by";

        for (var i = 0; i < listParam.length; i++) {
          var valueParam = "";
          // "isPublish" for version 
          switch (listParam[i]) {
            case "version":
              {
                if (fieldsLang && fieldsLang.length > 0) {
                  valueParam = fieldsLang[0].version;
                  if (fieldsLang[0].isPublish) {
                    valueParam += " <span style='color:red;'> (published)</span>";
                  }
                } else {
                  valueParam += "<span class='spNoVersion'>The current item doesn't have any version!</span>";
                }
                break;
              }
            case "template":
              {
                if (itemData.templateId) {
                  var templateItems = application.getTemplateItemsHash();
                  if (templateItems[itemData.templateId]) {
                    valueParam = templateItems[itemData.templateId].name;
                  } else {
                    valueParam = "unknown";
                  }
                } else {
                  valueParam = "unknown";
                }
                break;
              }
            case "path":
              {
                var fullPath = itemData.name;
                var parentObj = itemData.parentObj;
                while (parentObj) {
                  if (parentObj) {
                    fullPath = parentObj.name + "\\" + fullPath;
                  }
                  parentObj = parentObj.parentObj;
                }
                valueParam = fullPath;
                break;
              }
            default:
              {
                valueParam = itemData[listParam[i]];
                break;
              }
          }
          html =
            '<tr>' +
              '<td class="tdInfoParamName">' + listTitle[listParam[i]] + ': </td>' +
              '<td class="tdInfoParamValue">' +
              //'<input readonly="readonly" onclick="javascript:this.select();return false" value="' + valueParam + '">' +
              '<span readonly="readonly" onclick="javascript:if(this.select) { this.select();} return false;">' + valueParam + '</span>' +
              '</td>' +
              '</tr>';

          tbody.append(html);
        }

        // own parameters
        html = '';
        html += '<table class="tbOwnParameters">' +
                  '<colgroup>' +
                    '<col style="white-space:nowrap" valign="top">' +
                    '</colgroup>' +
                  '<tbody>' +
                  '</tbody>' +
                '</table>';

        $dvInfoPanelElem.append(html);
        var tbOwnParametersElem = $parentElem.find(".tbOwnParameters");
        tbody = tbOwnParametersElem.find("tbody");

        //var fields = itemData.fields;
        //var curLangguage = Utils.getLanguageCurrent();
        //var curVersion = Utils.getVersionCurrent();
        
        if (fieldsLang) {
          var componentMgr = application.getComponentMgr();
          componentMgr.populate(tbody, fieldsLang);
        }
      },

      getValuesForItemFields: function (item) {
        if (!item || !item.fields)
          return;
        
        var curLangguage = Utils.getLanguageCurrent();
        var curVersion = Utils.getVersionCurrent();
        if (!curLangguage || !curVersion)
          return;

        //var $infoPanelElem = $(this.infoPanelSelector);
        //var arElemFields = $infoPanelElem.find(".itemField");
        //var arFields = {};
        
        //_.each(arElemFields, function (elemField) {
        //  arFields[elemField.id] = $(elemField).val();
        //});

        var componentMgr = application.getComponentMgr();
        var fieldsValues = componentMgr.getValues();
        
        var fieldsLangVersion = _.where(item.fields, { lang: curLangguage.code, version: parseInt(curVersion) });
        _.each(fieldsLangVersion, function (field) {
          if (fieldsValues.hasOwnProperty(field.id))
            field.value = fieldsValues[field.id];
        });
      },

    };
    infoPanel.constructor();
    return infoPanel;
  };

  return InfoPanel;
});
