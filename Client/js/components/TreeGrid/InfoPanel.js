
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
          engineTree.addInsertOptions(itemData);

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
          var valueParam = itemData[listParam[i]];
          // "isPublish" for version 
          if (listParam[i] === "version") {
            if (fieldsLang && fieldsLang.length > 0) {
              valueParam = fieldsLang[0].version;
              if (fieldsLang[0].isPublish) {
                valueParam += " <font color='red'>(published)</font>";
              }
            }
          }
          html =
            '<tr>' +
              '<td class="tdInfoParamName">' + listTitle[listParam[i]] + ': </td>' +
              '<td class="tdInfoParamValue">' +
              //'<input readonly="readonly" onclick="javascript:this.select();return false" value="' + valueParam + '">' +
              '<span readonly="readonly" onclick="javascript:this.select();return false">' + valueParam + '</span>' + 
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
          if (fieldsValues[field.id])
            field.value = fieldsValues[field.id];
        });
      },

    };
    infoPanel.constructor();
    return infoPanel;
  };

  return InfoPanel;
});
