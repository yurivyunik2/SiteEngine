require.config({
  paths: {
    imageChangeCtrl: "js/components/ImageChangeCtrl/ImageChangeCtrl",
  },
});


define(["application", "CONST", "imageChangeCtrl"], function (application, CONST, ImageChangeCtrl) {
  //
  // RichTextEditor
  //
  function ComponentMgr($scope) {

    var self;

    var _idElem;
    var richTextEditor;

    var hashComponents = {};



    var componentMgrObj = {

      constructor: function () {
        self = this;

        richTextEditor = application.getRichTextEditorCtrl();
      },

      addComponent: function (parentElem, field) {
        if (!field)
          return "";

        var disabledAttr = field.isPublish ? "disabled" : "";
        var html = "";

        if (field.type && !isNaN(parseInt(field.type))) {
          if (parseInt(field.type) === CONST.RICH_TEXT_TYPE()) {
            //html += "<td><textarea id='" + field.fieldId + "' class='scrollCustom itemField'>" + field.value + "</textarea></br></br></td>";
            html += "<td><div " + disabledAttr + " id='rich_" + field.fieldId + "' class='scrollCustom itemField'>" + field.value + "</div></br></br>";
            html += "</td>";

          } else if (parseInt(field.type) === CONST.INTEGER_TYPE() || parseInt(field.type) === CONST.NUMBER_TYPE()) { //INTEGER
            html += "<td><input type='number' " + disabledAttr + " id='" + field.fieldId + "' class='itemField' onclick='javascript:this.select();return false' value='" + field.value + "'></br></br></td>";
          } else if (parseInt(field.type) === CONST.DATETIME_TYPE()) {
            //DATETIME
            html += "<td><input type='datetime' " + disabledAttr + " id='" + field.fieldId + "' class='itemField' onclick='javascript:this.select();return false' value='" + field.value + "'></br></br></td>";
          } else if (parseInt(field.type) === CONST.IMAGE_TYPE()) {
            //html += "<td>" + field.value + "</br></br></td>";
            //if (!imageChangeCtrl)
            //  imageChangeCtrl = application.getImageChangeCtrl();

            //
            var imageChangeCtrl = new ImageChangeCtrl(parentElem, field);
            hashComponents[field.id] = imageChangeCtrl;

            //html += "<td>" + imageChangeCtrl.getHtmlComponent(field) + "</br></br></td>";
            imageChangeCtrl.addElement(field);
          }
          else
            html += "<td><input " + disabledAttr + " id='" + field.fieldId + "' class='itemField' onclick='javascript:this.select();return false' value='" + field.value + "'></br></br></td>";
        }
        else
          html += "<td><input " + disabledAttr + " id='" + field.fieldId + "' class='itemField' onclick='javascript:this.select();return false' value='" + field.value + "'></br></br></td>";

        if(html)
          parentElem.append(html);

        // RICH_TEXT_TYPE - converting of the component using "RichTextEditorCtrl"
        if (parseInt(field.type) === CONST.RICH_TEXT_TYPE()) {          
          if(!richTextEditor)
            richTextEditor = application.getRichTextEditorCtrl();

          richTextEditor.convertElement("rich_" + field.fieldId, field.value);
        }
      },

      clearComponents: function () {
        //hashComponents.
      },

    };

    componentMgrObj.constructor();
    return componentMgrObj;
  };

  return ComponentMgr;
});

