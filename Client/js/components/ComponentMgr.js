require.config({
  paths: {
    imageChangeCtrl: "js/components/ImageChangeCtrl/ImageChangeCtrl",
    richTextEditor: "js/components/RichTextEditor/RichTextEditor",
    assignTemplateCtrl: "js/components/AssignTemplateCtrl/AssignTemplateCtrl",
  },
});


define(["application", "CONST", "imageChangeCtrl", "richTextEditor", "assignTemplateCtrl"], function (application, CONST, ImageChangeCtrl, RichTextEditor, AssignTemplateCtrl) {
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
        
        parentElem.append("<td class='tdFieldCtrl'></td>");
        var parentTdElem = parentElem.children().last();

        var html = "";

        var iType = parseInt(field.type);

        if (iType === CONST.RICH_TEXT_TYPE()) {
          var richTextEditor = new RichTextEditor(parentTdElem, field);
          actualComponents[field.id] = richTextEditor;

          richTextEditor.render(disabledAttr);
        }
        else if (iType === CONST.INTEGER_TYPE() || iType === CONST.NUMBER_TYPE()) { //INTEGER
          html += "<input type='number' " + disabledAttr + " id='" + field.fieldId + "' class='itemField' onclick='javascript:this.select();return false' value='" + field.value + "'>";
        } else if (parseInt(field.type) === CONST.DATETIME_TYPE()) {
          //DATETIME
          html += "<input type='datetime' " + disabledAttr + " id='" + field.fieldId + "' class='itemField' onclick='javascript:this.select();return false' value='" + field.value + "'>";
        } else if (iType === CONST.IMAGE_TYPE()) {
          var imageChangeCtrl = new ImageChangeCtrl(parentTdElem, field);
          actualComponents[field.id] = imageChangeCtrl;

          imageChangeCtrl.render();
        } else if (field.fieldId === CONST.INSERT_OPTIONS_FIELD_ID()) {
          var assignTemplateCtrl = new AssignTemplateCtrl(parentTdElem, field);
          actualComponents[field.id] = assignTemplateCtrl;

          assignTemplateCtrl.render();
          assignTemplateCtrl.isEnabled(disabledAttr === "");
        }
        else
          html += "<input " + disabledAttr + " id='" + field.fieldId + "' class='itemField' onclick='javascript:this.select();return false' value='" + field.value + "'>";
        

        if (html) {
          parentTdElem.append(html);

          var $elem = parentTdElem.children().last().find(".itemField");
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

