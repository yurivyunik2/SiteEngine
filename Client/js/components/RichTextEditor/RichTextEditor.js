require.config({
  paths: {
    customEditor: "js/components/RichTextEditor/ckeditor/ckeditor",
  }
});


define(["application", "CONST", "customEditor"], function (application, CONST, customEditor) {
  //
  // RichTextEditor
  //
  function RichTextEditor() {

    var self;

    var idPrefix = "cke_";
    var classImageBtn = ".cke_button__image";

    var arInitElements = [];

    var richTextEditorObj = {

      constructor: function () {
        self = this;

        if (CKEDITOR.env.ie && CKEDITOR.env.version < 9)
          CKEDITOR.tools.enableHtml5Elements(document);

        // The trick to keep the editor in the sample quite small
        // unless user specified own height.
        CKEDITOR.config.height = 150;
        CKEDITOR.config.width = 'auto';

        //
        application.addUIComponent("richTextEditor", self);
      },

      isWysiwygareaAvailable: function () {
        // If in development mode, then the wysiwygarea must be available.
        // Split REV into two strings so builder does not replace it :D.
        if ( CKEDITOR.revision == ( '%RE' + 'V%' ) ) {
          return true;
        }
        return !!CKEDITOR.plugins.get( 'wysiwygarea' );
      },

      convertElement: function (idReplaceElem, textValue) {
        var editorElement = CKEDITOR.document.getById(idReplaceElem);
        editorElement.setHtml(textValue);

        // Depending on the wysiwygare plugin availability initialize classic or inline editor.
        var wysiwygareaAvailable = self.isWysiwygareaAvailable();
        if ( wysiwygareaAvailable ) {
          //CKEDITOR.replace( 'editor' );
          CKEDITOR.replace(idReplaceElem);
        } else {
          editorElement.setAttribute( 'contenteditable', 'true' );
          //CKEDITOR.inline( 'editor' );
          CKEDITOR.inline(idReplaceElem);

        }

        arInitElements.push(idReplaceElem);
      },

      intervalUI: function (uiData) {
        //if (!uiData || !uiData.keyDownEventLast)
        //  return;

        //self.keyDownEventFunc(uiData.keyDownEventLast);

        if (arInitElements.length > 0) {
          var isClearInit = false;
          _.each(arInitElements, function (idElem) {
            var idConvertedElement = "#" + idPrefix + idElem;
            var $richElement = $(idConvertedElement);
            if ($richElement.length > 0) {
              isClearInit = true;
              var $btnImage = $richElement.find(classImageBtn);
              $btnImage.attr("idElem", idElem);
              $btnImage.click(function(event) {
                setTimeout(self.addGalleryButtonForImage, 300, { event: event });
              });
            }
          });
          if (isClearInit)
            arInitElements = [];          
        }
      },

      addGalleryButtonForImage: function (data) {
        if (!data || !data.event)
          return;
        
        var idElem = $(data.event.currentTarget).attr("idElem");
        var classDlg = ".cke_editor_" + idElem + "_dialog";
        var $imgDlgElem = $(classDlg);
        if ($imgDlgElem.length > 0) {
          var $contentsBody = $imgDlgElem.find(".cke_dialog_contents_body");
          var $inputUrl = $contentsBody.find("input.cke_dialog_ui_input_text").first();          
          var $imgGallery = $inputUrl.parent().find("img");
          if ($imgGallery.length === 0) {
            $inputUrl.parent().append('<div class="dvBtnImgGallery"><img src="./images/gallery256.png"></div>');
            var $btnImgGallery = $inputUrl.parent().find(".dvBtnImgGallery");
            $btnImgGallery.click(self.imageGalleryOpen);
          }

        }
        
      },

      imageGalleryOpen: function() {
        //var modalFormCtrl = new ModalFormCtrl($scope);
        var modalFormCtrl = application.getModalFormCtrl();
        modalFormCtrl.showType(modalFormCtrl.FORM_TYPE().IMAGE_GALLERY, {});
      },

    };

    richTextEditorObj.constructor();
    return richTextEditorObj;
  };

  return RichTextEditor;
});

