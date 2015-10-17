﻿require.config({
  paths: {
    imageChangeCtrl: "js/components/ImageChangeCtrl/ImageChangeCtrl",
    richTextEditor: "js/components/RichTextEditor/RichTextEditor",
  },
});


define(["application", "CONST", "imageChangeCtrl", "richTextEditor"], function (application, CONST, ImageChangeCtrl, RichTextEditor) {
  //
  // RichTextEditor
  //
  function ComponentMgr($scope) {

    var self;

    var actualComponents = {};

    var componentMgrObj = {

      constructor: function () {
        self = this;

        //richTextEditor = application.getRichTextEditorCtrl();
      },

      clearComponents: function () {
        var keys = _.keys(actualComponents);
        _.each(keys, function (key) {
          var component = actualComponents[key];
          if (component.dispose)
            component.dispose();
        });
        actualComponents = {};
      },

      populate: function (parentElem, fields) {
        if (!parentElem || !fields)
          return;

        // clear
        self.clearComponents();

        var html;
        for (var i = 0; i < fields.length; i++) {
          var field = fields[i];
          html =
            "<tr>" +
              "<td class='tdFieldName'><span><b>" + field.name + ": </b></span></td>" +
            "</tr>";
          parentElem.append(html);

          // "tr" for component
          parentElem.append("<tr></tr>");

          self.addComponent(parentElem.children().last(), field);
        }
      },

      addComponent: function (parentElem, field) {
        if (!field)
          return "";

        var disabledAttr = field.isPublish ? "disabled" : "";
        var html = "";

        if (field.type && !isNaN(parseInt(field.type))) {
          if (parseInt(field.type) === CONST.RICH_TEXT_TYPE()) {
            var richTextEditor = new RichTextEditor(parentElem, field);
            actualComponents[field.id] = richTextEditor;

            richTextEditor.render(disabledAttr);
          }
          else if (parseInt(field.type) === CONST.INTEGER_TYPE() || parseInt(field.type) === CONST.NUMBER_TYPE()) { //INTEGER
            html += "<td><input type='number' " + disabledAttr + " id='" + field.fieldId + "' class='itemField' onclick='javascript:this.select();return false' value='" + field.value + "'></br></br></td>";
          } else if (parseInt(field.type) === CONST.DATETIME_TYPE()) {
            //DATETIME
            html += "<td><input type='datetime' " + disabledAttr + " id='" + field.fieldId + "' class='itemField' onclick='javascript:this.select();return false' value='" + field.value + "'></br></br></td>";
          } else if (parseInt(field.type) === CONST.IMAGE_TYPE()) {
            var imageChangeCtrl = new ImageChangeCtrl(parentElem, field);
            actualComponents[field.id] = imageChangeCtrl;

            imageChangeCtrl.render();
          }
          else
            html += "<td><input " + disabledAttr + " id='" + field.fieldId + "' class='itemField' onclick='javascript:this.select();return false' value='" + field.value + "'></br></br></td>";
        }
        else
          html += "<td><input " + disabledAttr + " id='" + field.fieldId + "' class='itemField' onclick='javascript:this.select();return false' value='" + field.value + "'></br></br></td>";

        if (html) {
          parentElem.append(html);

          var $elem = parentElem.children().last().find(".itemField");
          actualComponents[field.id] = $elem;
        }
      },

      getValues: function () {
        var values = {};
        var keys = _.keys(actualComponents);
        _.each(keys, function(key) {
          var component = actualComponents[key];
          if (component.getValue)
            values[key] = component.getValue();
          else if (component.val)
            values[key] = component.val();
        });

        return values;
      },

    };

    componentMgrObj.constructor();
    return componentMgrObj;
  };

  return ComponentMgr;
});

