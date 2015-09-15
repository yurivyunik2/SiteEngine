﻿require.config({
  paths: {
    richTextEditor: "js/components/RichTextEditor/RichTextEditor",
  },
});

define(["application", "CONST", "Utils", "richTextEditor"], function (application, CONST, Utils, RichTextEditor) {

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
          html =
            '<tr>' +
              '<td class="tdInfoParamName">' + listTitle[listParam[i]] + ': </td>' +
              '<td class="tdInfoParamValue">' +
              '<input readonly="readonly" onclick="javascript:this.select();return false" value="' + itemData[listParam[i]] + '">' +
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

        var fields = itemData.fields;
        var curLangguage = Utils.getLanguageCurrent();
        var curVersion = Utils.getVersionCurrent();
        if (fields && curLangguage && curVersion) {
          var fieldsLang = _.where(fields, { itemId: itemData.id, lang: curLangguage.code, version: parseInt(curVersion)});
          for (var i = 0; i < fieldsLang.length; i++) {
            var field = fieldsLang[i];
            html =
              "<tr>" +
                "<td class='tdFieldName'><span><b>" + field.name + ": </b></span></td>" +
                "</tr>" +
                "<tr>";

            if (field.type && !isNaN(parseInt(field.type))) {
              if (parseInt(field.type) === CONST.RICH_TEXT_TYPE()) {
                //html += "<td><textarea id='" + field.fieldId + "' class='scrollCustom itemField'>" + field.value + "</textarea></br></br></td>";
                html += "<td><div id='rich_" + field.fieldId + "' class='scrollCustom itemField'>" + field.value + "</div></br></br>";                
                html += "</td>";

              } else if (parseInt(field.type) === CONST.INTEGER_TYPE() || parseInt(field.type) === CONST.NUMBER_TYPE()) { //INTEGER
                html += "<td><input id='" + field.fieldId + "' class='itemField' onclick='javascript:this.select();return false' value='" + field.value + "'></br></br></td>";
              } else if (parseInt(field.type) === CONST.DATETIME_TYPE()) {
                //DATETIME
                html += "<td><input id='" + field.fieldId + "' class='itemField' onclick='javascript:this.select();return false' value='" + field.value + "'></br></br></td>";
              } else if (parseInt(field.type) === CONST.IMAGE_TYPE())
                html += "<td>" + field.value + "</br></br></td>";
              else
                html += "<td><input id='" + field.fieldId + "' class='itemField' onclick='javascript:this.select();return false' value='" + field.value + "'></br></br></td>";
            }
            else
              html += "<td><input id='" + field.fieldId + "' class='itemField' onclick='javascript:this.select();return false' value='" + field.value + "'></br></br></td>";

            html += "</tr>";

            tbody.append(html);

            // RICH_TEXT_TYPE - converting of the component using "RichTextEditorCtrl"
            if (parseInt(field.type) === CONST.RICH_TEXT_TYPE()) {
              //var $fieldElem = $("id=#" + field.fieldId);
              var richTextEditor = application.getRichTextEditorCtrl();
              richTextEditor.convertElement("rich_" + field.fieldId, field.value);              
            }

          }
        }
      },

      setValuesForItemFields: function (item) {
        if (!item || !item.fields)
          return;
        
        var curLangguage = Utils.getLanguageCurrent();
        var curVersion = Utils.getVersionCurrent();
        if (!curLangguage || !curVersion)
          return;

        var $infoPanelElem = $(this.infoPanelSelector);
        var arElemFields = $infoPanelElem.find(".itemField");
        var arFields = {};
        
        _.each(arElemFields, function (elemField) {
          arFields[elemField.id] = $(elemField).val();
        });
        
        var fieldsLangVersion = _.where(item.fields, { lang: curLangguage.code, version: parseInt(curVersion) });
        _.each(fieldsLangVersion, function (field) {
          if (arFields[field.fieldId])
            field.value = arFields[field.fieldId];
        });
      },

    };
    infoPanel.constructor();
    return infoPanel;
  };

  return InfoPanel;
});
