require.config({
  paths: {
    customEditor: "js/components/RichTextEditor/ckeditor/ckeditor",
  }
});


define(["application", "CONST", "customEditor"], function (application, CONST, customEditor) {
  //
  // RichTextEditor
  //

  var idPrefix = "cke_";
  var classImageBtn = ".cke_button__image";
  var classImgEditDlgTemplate = ".cke_editor_<%= idElem %>_dialog";

  (function RichTextEditorStatic() {
    if (CKEDITOR.env.ie && CKEDITOR.env.version < 9)
      CKEDITOR.tools.enableHtml5Elements(document);

    // The trick to keep the editor in the sample quite small
    // unless user specified own height.
    CKEDITOR.config.height = 150;
    CKEDITOR.config.width = 'auto';
  })();

  function RichTextEditor(parentElem, field) {
    var self;

    var idElem;
    var isSubscribed = false;

    var richTextEditorObj = {

      constructor: function () {
        self = this;
        if (field) {
          idElem = "rich_" + field.id;
          //
          application.addUIComponent("richTextEditor_" + idElem, self);
        }
      },

      dispose: function () {
        if (field) {
          application.removeUIComponent("richTextEditor_" + idElem);

          var _classImgEditDlgTemplate = _.template(classImgEditDlgTemplate);
          var classImgEditDlg = _classImgEditDlgTemplate({ idElem: idElem });
          $(classImgEditDlg).remove();
        }
      },

      intervalUI: function (uiData) {
        if (!isSubscribed && idElem) {
          var idConvertedElement = "#" + idPrefix + idElem;
          var $richElement = $(idConvertedElement);
          if ($richElement.length > 0) {
            isSubscribed = true;
            var $btnImage = $richElement.find(classImageBtn);
            $btnImage.click(function (event) {
              setTimeout(self.addGalleryButtonForImage, 400, { event: event });
            });
          }
        }
      },

      addElementToHtml: function (isDisabled) {
        if (parentElem && field) {
          var html = "<td><div id='" + idElem + "' class='scrollCustom itemField'>" + field.value + "</div></br></br>";
          html += "</td>";

          parentElem.append(html);
          self.convertElement();

          if (isDisabled && CKEDITOR.instances && CKEDITOR.instances[idElem]) {
            CKEDITOR.instances[idElem].on("instanceReady", function (event) {
              //put your code here
              CKEDITOR.instances[idElem].setReadOnly(true);
            });
          }
        }
      },

      isWysiwygareaAvailable: function () {
        // If in development mode, then the wysiwygarea must be available.
        // Split REV into two strings so builder does not replace it :D.
        if (CKEDITOR.revision === ( '%RE' + 'V%' )) {
          return true;
        }
        return !!CKEDITOR.plugins.get('wysiwygarea');
      },

      convertElement: function () {
        if (field) {
          var editorElement = CKEDITOR.document.getById(idElem);
          editorElement.setHtml(field.value);

          // Depending on the wysiwygare plugin availability initialize classic or inline editor.
          var wysiwygareaAvailable = self.isWysiwygareaAvailable();
          if (wysiwygareaAvailable) {
            //CKEDITOR.replace( 'editor' );
            CKEDITOR.replace(idElem);
          } else {
            editorElement.setAttribute('contenteditable', 'true');
            //CKEDITOR.inline( 'editor' );
            CKEDITOR.inline(idElem);
          }
        }
      },

      // adding of the button for open Media(Image) gallery in ImageProperties dialog
      addGalleryButtonForImage: function (data) {
        if (!data || !data.event)
          return;
        
        //var  _idElem = $(data.event.currentTarget).attr("idElem");
        //var classDlg = ".cke_editor_" + idElem + "_dialog";
        var _classImgEditDlgTemplate = _.template(classImgEditDlgTemplate);
        var classImgEditDlg = _classImgEditDlgTemplate({ idElem: idElem });

        var $imgDlgElem = $(classImgEditDlg);
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

      // open of the Image Gallery
      imageGalleryOpen: function() {
        var modalFormCtrl = application.getModalFormCtrl();
        modalFormCtrl.setType(modalFormCtrl.FORM_TYPE().IMAGE_GALLERY, { isMultipleSelect: false, callback: self.imageGalleryOpenCallback });
      },
      // imageGalleryOpenCallback
      imageGalleryOpenCallback: function (data) {
        var modalFormCtrl = application.getModalFormCtrl();
        var imageGalleryFormCtrl = modalFormCtrl.FORM_TYPE().IMAGE_GALLERY.getControl();
        if (imageGalleryFormCtrl) {          
          var selectedItems = imageGalleryFormCtrl.getSelectedItems();
          // set of the selected image inot "input" in image dialog
          if (selectedItems && selectedItems.length > 0) {
            var selItem = selectedItems[0];
            if (selItem && selItem.type === CONST.MEDIA_TYPES().IMAGE() && selItem.imgSrc && selItem.imgSrc !== "") {
              var _classImgEditDlgTemplate = _.template(classImgEditDlgTemplate);
              var classImgEditDlg = _classImgEditDlgTemplate({ idElem: idElem });

              var $imgDlgElem = $(classImgEditDlg);
              if ($imgDlgElem.length > 0) {
                var $contentsBody = $imgDlgElem.find(".cke_dialog_contents_body");
                var $inputUrl = $contentsBody.find("input.cke_dialog_ui_input_text").first();
                var imgPath = CONST.SERVER.PATH() + selItem.imgSrc;
                //var imgPath = CONST.SERVER.PATH() + "getMedia?id=" + selItem.id;
                $inputUrl.val(imgPath).change();
              }
            }
          }
        }
      },

    };

    richTextEditorObj.constructor();
    return richTextEditorObj;
  };

  return RichTextEditor;
});

