
define(["application", "CONST", "Utils"], function (application, CONST, Utils) {
  //
  // ImageChangeCtrl
  //
  var $dvImgChangeCtrlElem;
  var pathTemplate = "js/components/ImageChangeCtrl/ImageChangeCtrl.html";

  (function LoadTemplate() {
    var $template = $("<div></div>");
    $template.load(pathTemplate, function () {
      $(document.body).append($template.html());
      $dvImgChangeCtrlElem = $template.find(".dvImgChangeCtrl");
    });
  })();

  var ImageChangeCtrl = function (parentElem, field) {

    var self;

    var srcEmptyImage = "/SiteEngine/Client/images/media/emptyImage.png";    

    var imgValue;
    var $el;
    
    var imageChangeCtrl = {

      constructor: function () {
        self = this;
      },

      render: function () {
        if ($dvImgChangeCtrlElem && $dvImgChangeCtrlElem.length > 0) {
          $el = $dvImgChangeCtrlElem.clone();
          $el.css("display", "block");
          $el[0].id = field.id;
          if (Utils.isValueNull(field.value) && $el.find("img").length > 0) {
            $el.find("img")[0].src = srcEmptyImage;
            $el.find("a").html("Set image");
          } else {
            $el.find("img")[0].src = field.value;
            $el.find("a").html("Change");
          }

          var html = "<td>" + $el[0].outerHTML + "</br></br></td>";
          if (parentElem) {
            parentElem.append(html);
            var newElem = parentElem.children().last();
            newElem.find("img, a").click(self.changeImage);
          }
        }
      },

      changeImage: function () {
        var modalFormCtrl = application.getModalFormCtrl();
        modalFormCtrl.setType(modalFormCtrl.FORM_TYPE().IMAGE_GALLERY, { callback: self.imageGalleryOpenCallback });
      },

      imageGalleryOpenCallback: function (data) {
        var modalFormCtrl = application.getModalFormCtrl();
        var imageGalleryFormCtrl = modalFormCtrl.FORM_TYPE().IMAGE_GALLERY.getControl();
        if (imageGalleryFormCtrl) {
          var selectedItems = imageGalleryFormCtrl.getSelectedItems();
          // set of the selected image inot "input" in image dialog
          if (selectedItems && selectedItems.length > 0) {
            var selItem = selectedItems[0];
            if (selItem && selItem.type === CONST.MEDIA_TYPES().IMAGE() && selItem.imgSrc && selItem.imgSrc !== "") {
              
            }
          }
        }
      },

      //getHtmlComponent: function () {
      //  self.createElement();
      //  if ($el)
      //    return $el[0].outerHTML;
      //  else
      //    return "";
      //},
    };

    imageChangeCtrl.constructor();
    return imageChangeCtrl;
  };

  ImageChangeCtrl.isLoadTemplate = false;
  return ImageChangeCtrl;
});

