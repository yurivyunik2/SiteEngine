require.config({
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

    var _idElem;

    var actualComponents = {};



    var componentMgrObj = {

      constructor: function () {
        self = this;

        //richTextEditor = application.getRichTextEditorCtrl();
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

            richTextEditor.addElementToHtml(disabledAttr);
          }
          else if (parseInt(field.type) === CONST.INTEGER_TYPE() || parseInt(field.type) === CONST.NUMBER_TYPE()) { //INTEGER
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
            actualComponents[field.id] = imageChangeCtrl;

            //html += "<td>" + imageChangeCtrl.getHtmlComponent(field) + "</br></br></td>";
            imageChangeCtrl.addElementToHtml();
          }
          else
            html += "<td><input " + disabledAttr + " id='" + field.fieldId + "' class='itemField' onclick='javascript:this.select();return false' value='" + field.value + "'></br></br></td>";
        }
        else
          html += "<td><input " + disabledAttr + " id='" + field.fieldId + "' class='itemField' onclick='javascript:this.select();return false' value='" + field.value + "'></br></br></td>";

        if(html)
          parentElem.append(html);
      },

      clearComponents: function () {
        var keys = _.keys(actualComponents);
        _.each(keys, function(key) {
          var component = actualComponents[key];
          if (component.dispose)
            component.dispose();
        });        
      },

    };

    componentMgrObj.constructor();
    return componentMgrObj;
  };

  return ComponentMgr;
});

