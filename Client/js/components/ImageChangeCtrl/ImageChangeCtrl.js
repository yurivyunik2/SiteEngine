
define(["application", "CONST", "Utils"], function (application, CONST, Utils) {
  //
  // ImageChangeCtrl
  //
  var $dvImgChangeCtrlElem;
  var pathTemplate = "js/components/ImageChangeCtrl/ImageChangeCtrl.html";
  var srcEmptyImage = "/SiteEngine/Client/images/media/emptyImage.png";

  (function LoadTemplate() {
    var $template = $("<div></div>");
    $template.load(pathTemplate, function () {
      $(document.body).append($template.html());
      $dvImgChangeCtrlElem = $template.find(".dvImgChangeCtrl");
    });
  })();

  var ImageChangeCtrl = function (parentElem, field) {
    var self;    

    var imgValue;
    var $el;
    
    var imageChangeCtrl = {

      constructor: function () {
        self = this;

        if (field)
          imgValue = field.value;
      },

      createElement: function () {
        if (parentElem &&field && $dvImgChangeCtrlElem) {
          var $newElem = $dvImgChangeCtrlElem.clone();
          $newElem.css("display", "block");
          $newElem[0].id = field.id;

          var html = "<td>" + $newElem[0].outerHTML + "</br></br></td>";
          if (parentElem) {
            parentElem.append(html);
            $el = parentElem.children().last();
            $el.find("img, a").click(self.chooseImage);
            $el.find("input").change(self.changeSrc);
          }
        }
      },

      render: function () {
        if (!$el) {
          self.createElement();
        } 

        if (Utils.isValueNull(imgValue) && $el.find("img").length > 0) {
          $el.find("img")[0].src = srcEmptyImage;
          $el.find("input").val("");
        } else {
          $el.find("img")[0].src = imgValue;
          $el.find("input").val(imgValue);
        }
      },

      getValue: function() {
        return imgValue;
      },

      chooseImage: function () {
        var modalFormCtrl = application.getModalFormCtrl();
        modalFormCtrl.setType(modalFormCtrl.FORM_TYPE().IMAGE_GALLERY, { callback: self.chooseImageCallback });
      },

      chooseImageCallback: function (data) {
        var modalFormCtrl = application.getModalFormCtrl();
        var imageGalleryFormCtrl = modalFormCtrl.FORM_TYPE().IMAGE_GALLERY.getControl();
        if (imageGalleryFormCtrl) {
          var selectedItems = imageGalleryFormCtrl.getSelectedItems();
          // set of the selected image inot "input" in image dialog
          if (selectedItems && selectedItems.length > 0) {
            var selItem = selectedItems[0];
            if (selItem && selItem.type === CONST.MEDIA_TYPES().IMAGE() && selItem.imgSrc && selItem.imgSrc !== "") {
              imgValue = selItem.imgSrc;
              self.render();
            }
          }
        }
      },

      changeSrc: function () {
        imgValue = $el.find("input").val();
        self.render();
      },

    };

    imageChangeCtrl.constructor();
    return imageChangeCtrl;
  };

  ImageChangeCtrl.isLoadTemplate = false;
  return ImageChangeCtrl;
});

