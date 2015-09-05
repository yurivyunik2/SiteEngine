﻿define(["application", "CONST"], function (application, CONST) {

  return function ($scope) {

    var self;

    var countImgInRow = 4;
    var mediaItems;

    var mediaClientImagesPath = "/SiteEngine/Client/images/media/";

    var imageGalleryFormSelector = "#imageGalleryForm";
    var imgWrapperTemplateSelector = "#imgWrapperTemplate";
    var loadingTemplateSelector = "#loadingTemplate";

    var dvUploadInformationSelector = ".dvUploadInformation";
    var inputFileDlgSelector = "#inputFileDlg";
    var btnUploadFilesSelector = "#btnUploadFiles";
    var uploadInfoSelector = "#uploadInfo";

    var isMultipleSelect = false;

    var imgGalleryObj = {
      constructor: function() {
        self = this;
      },

      renderMediaItems: function (items) {
        var $imageGalleryFormElem = $(imageGalleryFormSelector);
        if ($imageGalleryFormElem.length === 0)
          return;
        
        var $imgWrapperTemplateElem = $(imgWrapperTemplateSelector);

        var $tableElem = $imageGalleryFormElem.find("table");
        $tableElem.html("");

        var $imgWrapperTemplate = _.template($imgWrapperTemplateElem.html());

        var indexImgInRow = 0;
        $tableElem.append("<tr></tr>");
        
        var trLast = $tableElem.find("tr").last();
        _.each(items, function (item) {
          var html = $imgWrapperTemplate({ item: item });
          trLast.append(html);
          indexImgInRow++;
          if (indexImgInRow >= countImgInRow) {
            indexImgInRow = 0;
            $tableElem.append("<tr></tr>");
            trLast = $tableElem.find("tr").last();
          }
        });

        $tableElem.find(".dvImgWrapper").click(self.clickItem);
        $tableElem.find(".dvImgWrapper").dblclick(function (event) {
          event.notRemovePrevious = true;
          self.clickItem(event);
          var modalFormCtrl = application.getModalFormCtrl();
          modalFormCtrl.clickOk();
        });
      },

      populate: function() {
        var $imageGalleryFormElem = $(imageGalleryFormSelector);
        if ($imageGalleryFormElem.length === 0)
          return;
        
        //
        self.setLoading();

        mediaItems = application.getMediaItems();

        var mediaItemsCount = mediaItems.length;
        var indexRequest = 0;
        _.each(mediaItems, function(item) {
          application.getItemFields(item, function() {
            indexRequest++;
            if (item && item.fields) {
              var fieldSrc = _.findWhere(item.fields, { fieldId: CONST.SRC_MEDIA_FIELDS_ID() });
              if (fieldSrc && fieldSrc.value && fieldSrc.value !== "") {
                item.src = fieldSrc.value;
              }
              self.defineTypeItem(item);
            }
            if (mediaItemsCount === indexRequest) {
              self.renderMediaItems(mediaItems);
            }
          });

        });
      },

      setLoading: function () {
        var $imageGalleryFormElem = $(imageGalleryFormSelector);
        if ($imageGalleryFormElem.length === 0)
          return;

        var $loadingTemplateElem = $(loadingTemplateSelector);

        var $tableElem = $imageGalleryFormElem.find("table");
        $tableElem.html($loadingTemplateElem.html());
      },

      defineTypeItem: function(item) {
        if (!item)
          return;

        if (!item.src || item.src === "") {
          item.imgSrc = mediaClientImagesPath + "unknown.png";
          return;
        }

        var ext = item.src.substr(item.src.lastIndexOf('.') + 1);
        switch (ext) {
          //IMAGE
          case "jpg":          
          case "jpeg":
          case "png":
          case "bmp":
          case "gif":
          case "tiff": {
            item.imgSrc = item.src;
            item.type = CONST.MEDIA_TYPES().IMAGE();
            break;
          }
          //DOC
          case "doc": {
            item.imgSrc = mediaClientImagesPath + "doc_file.png";
            item.type = CONST.MEDIA_TYPES().DOC();
            break;
          }
          //AUDIO
          case "mp3":
          case "wav": {
            item.imgSrc = mediaClientImagesPath + "audio_file.png";
            item.type = CONST.MEDIA_TYPES().AUDIO();
            break;
          }
          //VIDEO
          case "mpg":
          case "mpeg": {
            item.imgSrc = mediaClientImagesPath + "movie_file.png";
            item.type = CONST.MEDIA_TYPES().VIDEO();
            break;
          }

          default: {
            item.imgSrc = mediaClientImagesPath + "text_file.gif";
            item.type = CONST.MEDIA_TYPES().UNKNOWN();
            break;
          }

        }

        //mediaClientImagesPath
      },

      show: function (data) {
        isMultipleSelect = (data && data.isMultipleSelect) ? true : false;

        self.populate();

        var $imageGalleryFormElem = $(imageGalleryFormSelector);
        if ($imageGalleryFormElem.length > 0) {
          $(inputFileDlgSelector).change(self.changeInputFileDlg);

          $(btnUploadFilesSelector).click(function () {
            var $inputFileDlgElem = $(inputFileDlgSelector);
            $inputFileDlgElem[0].files = [];
            $inputFileDlgElem[0].value = "";
            $inputFileDlgElem.click();
          });
        }
      },

      showHideUploadInfo: function (isShow) {
        var $imageGalleryFormElem = $(imageGalleryFormSelector);
        if ($imageGalleryFormElem.length === 0)
          return;

        var $dvUploadInformationElem = $imageGalleryFormElem.find(dvUploadInformationSelector);
        if(isShow)
          $dvUploadInformationElem.css("display", "table-cell");
        else 
          $dvUploadInformationElem.css("display", "none");        
      },

      readFile: function(file, callback) {
        var reader = new FileReader();
        reader.onload = function (readerEvt) {
          try {
            var binaryString = readerEvt.target.result;
            var binaryValue = btoa(binaryString);
            if (callback)
              callback(file, binaryValue);
          } catch (ex) {
          }
        };
        reader.readAsBinaryString(file);
      },

      handleFiles: function (files, callback) {
        if (files) {
          var amountFiles = files.length;
          var indexFile = 0;
          var hashBinaryFileValues = {};
          _.each(files, function(file) {
            if (file) {
              self.readFile(file, function (file, binaryValue) {
                indexFile++;
                file.binaryValue = binaryValue;
                hashBinaryFileValues[file.name + file.lastModified] = file;
                if (indexFile === amountFiles) {
                  self.uploadFiles(hashBinaryFileValues);
                }
              });
            }
          });
        }
      },

      uploadFiles: function (hashBinaryFileValues) {
        if (!hashBinaryFileValues)
          return;

        var fileKeys = _.keys(hashBinaryFileValues);

        var curlang = application.getLanguageCurrent();
        var langCode = "";
        if (curlang)
          langCode = curlang.code;

        var action = "createItem";
        var data = {
          action: action,
          item: {
            parentId: CONST.MEDIA_ROOT_ID(),
            templateId: CONST.MEDIA_ITEM_TEMPLATE_ID(),
          },
          lang: langCode
        };

        var amountFiles = fileKeys.length;
        var indexFileUpload = 0;

        _.each(fileKeys, function (key) {
          
          var file = hashBinaryFileValues[key];
          var binaryValue = file.binaryValue;
          var arBinaryValues = [];
          //var index = 0;
          var len = 1000;
          for (var i = 0; i < binaryValue.length; ) {
            var sub = binaryValue.substring(i, i + len);
            arBinaryValues.push(sub);
            i += len;
          }

          data.item.name = file.name;
          data.item.fields = [
            {
              fieldId: CONST.SRC_MEDIA_FIELDS_ID(),
              value: CONST.UPLOAD_MEDIA_PATH() + data.item.name,
            },
            {
              fieldId: CONST.BLOB_MEDIA_FIELDS_ID(),
              value: encodeURIComponent(file.binaryValue.substring(0, 8000)),
            }
          ];

          application.httpRequest(data, function (response) {
            if (response.isOK) {
              if (response.data && response.data.item) {
                var item = response.data.item;

              }
            }
            indexFileUpload++;
            if (indexFileUpload === amountFiles)
              self.uploadFilesCallback();
          }, function (response, status, headers, config) {
            indexFileUpload++;
            if (indexFileUpload === amountFiles)
              self.uploadFilesCallback();
          });          

        });
        
      },

      uploadFilesSelected: function() {
        var $imageGalleryFormElem = $(imageGalleryFormSelector);
        if ($imageGalleryFormElem.length === 0)
          return;

        var $inputFileDlgElem = $imageGalleryFormElem.find(inputFileDlgSelector);

        var $uploadInfoElem = $imageGalleryFormElem.find(uploadInfoSelector);

        var files = $inputFileDlgElem[0].files;
        if (files.length > 0) {
          self.showHideUploadInfo(true);
          self.handleFiles(files, self.uploadFiles);
        }
      },

      uploadFilesCallback: function() {
        self.showHideUploadInfo(false);
      },

      changeInputFileDlg: function() {
        self.uploadFilesSelected();
      },

      clickItem: function (event) {
        var $curElem = $(event.currentTarget);
        if ($curElem.hasClass("dvSelected") && (event && !event.notRemovePrevious)) {
          $curElem.removeClass("dvSelected");
        } else {
          if (!isMultipleSelect) {
            var $imageGalleryFormElem = $(imageGalleryFormSelector);
            if ($imageGalleryFormElem.length > 0) {
              $imageGalleryFormElem.find(".dvSelected").removeClass("dvSelected");
            }
          }
          $curElem.addClass("dvSelected");
        }
      },

      getSelectedItems: function () {
        var selectedItems = [];
        if (!mediaItems)
          return selectedItems;
        
        var $imageGalleryFormElem = $(imageGalleryFormSelector);
        if ($imageGalleryFormElem.length > 0) {
          var selectedElems = $imageGalleryFormElem.find(".dvSelected");
          _.each(selectedElems, function(elem) {
            var itemFound = _.findWhere(mediaItems, { id: parseInt($(elem).attr("itemId")) });
            if (itemFound)
              selectedItems.push(itemFound);
          });
        }

        return selectedItems;
      },

      clickOK: function (data, callback) {
        if (data && data.callback) {
          data.formCtrl = self;
          data.callback(data);
          if (callback)
            callback();
        }
      },

    };
    imgGalleryObj.constructor();
    return imgGalleryObj;

  };
});