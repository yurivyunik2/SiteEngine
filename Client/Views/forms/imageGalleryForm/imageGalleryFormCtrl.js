define(["application", "CONST", "Utils", "CommonTypes"], function (application, CONST, Utils, CommonTypes) {

  return function ($scope) {

    var self;

    var countImgInRow = 4;
    var mediaItems;

    var mediaClientImagesPath = "/SiteEngine/Client/images/media/";

    var imageGalleryFormSelector = "#imageGalleryForm";
    var imgWrapperTemplateSelector = "#imgWrapperTemplate";
    var loadingTemplateSelector = "#loadingTemplate";
    var noDataTemplateSelector = "#noDataTemplate";
    

    var dvUploadInformationSelector = ".dvUploadInformation";
    var inputFileDlgSelector = "#inputFileDlg";
    var btnUploadFilesSelector = "#btnUploadFiles";
    var uploadInfoSelector = "#uploadInfo";
    var uploadInfoMessageSelector = "#uploadInfoMessage";    
    var uploadSliderInnerSelector = "#sliderInner";
    

    var isMultipleSelect = false;

    // UPLOADING
    var amountUploadFiles = 0;
    var indexFileUpload = 0;
    var uploadErrors = [];

    var imgGalleryObj = new CommonTypes.BaseElement();
    _.extend(imgGalleryObj, {
      constructor: function () {
        self = this;
        self.setBaseData({
          formPath: "/SiteEngine/Client/Views/forms/imageGalleryForm/imageGalleryForm.html",
        });

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

      populate: function () {
        var $imageGalleryFormElem = $(imageGalleryFormSelector);
        if ($imageGalleryFormElem.length === 0)
          return;

        mediaItems = application.getMediaItems();

        var mediaItemsCount = mediaItems.length;
        if (mediaItemsCount > 0) {
          //
          self.setLoading();

          var indexRequest = 0;
          _.each(mediaItems, function(item) {
            application.getItemFields(item, function() {
              indexRequest++;
              if (item && item.fields) {
                var fieldBlob = _.findWhere(item.fields, { fieldId: CONST.BLOB_MEDIA_FIELDS_ID() });
                if (fieldBlob && !Utils.isValueNull(fieldBlob.value)) {
                  item.src = "data:image;base64," + fieldBlob.value;
                  item.isBlob = true;
                } else {
                  var fieldSrc = _.findWhere(item.fields, { fieldId: CONST.SRC_MEDIA_FIELDS_ID() });
                  if (fieldSrc && fieldSrc.value && fieldSrc.value !== "") {
                    item.src = fieldSrc.value;
                  }
                }
                self.defineTypeItem(item);
              }
              if (mediaItemsCount === indexRequest) {
                self.renderMediaItems(mediaItems);
              }
            });

          });
        } else {
          self.showNoData();
        }

      },

      setLoading: function () {
        var $imageGalleryFormElem = $(imageGalleryFormSelector);
        if ($imageGalleryFormElem.length === 0)
          return;

        var $loadingTemplateElem = $(loadingTemplateSelector);

        var $tableElem = $imageGalleryFormElem.find("table");
        $tableElem.html($loadingTemplateElem.html());
      },

      showNoData: function() {
        var $imageGalleryFormElem = $(imageGalleryFormSelector);
        if ($imageGalleryFormElem.length === 0)
          return;

        var $noDataTemplateElem = $(noDataTemplateSelector);

        var $tableElem = $imageGalleryFormElem.find("table");
        $tableElem.html($noDataTemplateElem.html());
      },

      defineTypeItem: function (item) {
        if (!item)
          return;

        if (!item.src || item.src === "") {
          item.imgSrc = mediaClientImagesPath + "unknown.png";
          return;
        }

        var ext;
        if (item.isBlob && item.name && item.name !== "") {
          ext = item.name.substr(item.name.lastIndexOf('.') + 1);
        } else {
          ext = item.src.substr(item.src.lastIndexOf('.') + 1);
        }
        ext = ext.toLowerCase();
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
        self.setDataCtrl(data);
        isMultipleSelect = (data && data.isMultipleSelect) ? true : false;

        self.populate();

        var $imageGalleryFormElem = $(imageGalleryFormSelector);
        if ($imageGalleryFormElem.length > 0) {
          $(inputFileDlgSelector).change(self.uploadFilesSelected);

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
        var $uploadSliderInnerElem = $imageGalleryFormElem.find(uploadSliderInnerSelector);
        var $uploadInfoMessageElem = $imageGalleryFormElem.find(uploadInfoMessageSelector);
        if (isShow) {
          $dvUploadInformationElem.css("display", "table-cell");
          $uploadSliderInnerElem.width("0%");
          $uploadInfoMessageElem.html("Uploading: 0/" + amountUploadFiles);
        }
        else
          $dvUploadInformationElem.css("display", "none");
      },

      uploadFilesSelected: function () {
        var $imageGalleryFormElem = $(imageGalleryFormSelector);
        if ($imageGalleryFormElem.length === 0)
          return;

        var $inputFileDlgElem = $imageGalleryFormElem.find(inputFileDlgSelector);

        var $uploadInfoElem = $imageGalleryFormElem.find(uploadInfoSelector);

        var files = $inputFileDlgElem[0].files;
        if (files.length > 0) {
          amountUploadFiles = files.length;
          indexFileUpload = 0;
          uploadErrors = [];

          self.showHideUploadInfo(true);
          _.each(files, function (file) {
            self.handleFile(file, self.uploadFiles);
          });

        }
      },

      uploadFilesFinish: function () {
        self.showHideUploadInfo(false);
        self.populate();
      },

      uploadFileCallback: function (response, error) {
        var $imageGalleryFormElem = $(imageGalleryFormSelector);
        if ($imageGalleryFormElem.length === 0 || amountUploadFiles === 0)
          return;

        var $uploadInfoMessageElem = $imageGalleryFormElem.find(uploadInfoMessageSelector);
        var $uploadSliderInnerElem = $imageGalleryFormElem.find(uploadSliderInnerSelector);


        //
        indexFileUpload++;
        $uploadInfoMessageElem.html("Uploading: " + indexFileUpload + "/" + amountUploadFiles);
        var widthPercent = (indexFileUpload / amountUploadFiles) * 100;
        $uploadSliderInnerElem.width(widthPercent + "%");
        if (response) {
          if (!response.error) {
            if (response.data && response.data.item) {
              application.addItem(response.data.item);
            }
          } else if (response.error) {
            uploadErrors.push(response.error);
          } else {
            uploadErrors.push("Error unknown!");
          }
        } else if (error) {
          uploadErrors.push(error);
        } else {
          uploadErrors.push("Error unknown!");
        }

        if (indexFileUpload === amountUploadFiles)
          self.uploadFilesFinish();
      },

      readFile: function (file, callback) {
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

      handleFile: function (file, callback) {
        if (file) {
          self.readFile(file, function (file, binaryValue) {
            //indexFile++;
            file.binaryValue = binaryValue;
            //hashBinaryFileValues[file.name + file.lastModified] = file;
            //if (indexFile === amountFiles) {
            //  self.uploadFile(hashBinaryFileValues);
            //}
            self.uploadFile(file);
          });
        }
      },

      uploadFile: function (file) {
        if (!file || !file.binaryValue)
          return;

        var curlang = Utils.getLanguageCurrent();
        var langCode = "";
        if (curlang)
          langCode = curlang.code;

        var action = "createItem";
        var data = {
          action: action,
          item: {
            name: file.name,
            parentId: CONST.MEDIA_ROOT_ID(),
            templateId: CONST.MEDIA_ITEM_TEMPLATE_ID(),
          },
          lang: langCode
        };

        //amountUploadFiles = fileKeys.length;
        //indexFileUpload = 0;
        //uploadErrors = [];


        //var binaryValue = file.binaryValue;
        //var arBinaryValues = [];
        ////var index = 0;
        //var len = 1000;
        //for (var i = 0; i < binaryValue.length;) {
        //  var sub = binaryValue.substring(i, i + len);
        //  arBinaryValues.push(sub);
        //  i += len;
        //}

        //data.item.name = file.name;
        data.item.fields = [
          {
            fieldId: CONST.SRC_MEDIA_FIELDS_ID(),
            //value: CONST.UPLOAD_MEDIA_PATH() + data.item.name,
            value: encodeURIComponent(file.binaryValue),
          },
          //{
          //  fieldId: CONST.BLOB_MEDIA_FIELDS_ID(),
          //  value: encodeURIComponent(file.binaryValue),
          //}
        ];

        application.httpRequest(data, function (response) {
          //if (!response.error) {
          //  if (response.data && response.data.item) {
          //    var item = response.data.item;

          //  }
          //}
          self.uploadFileCallback(response);
        }, function (response, status, headers, config) {
          self.uploadFileCallback(null, "Error unknown!");
        });

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
          _.each(selectedElems, function (elem) {
            var itemFound = _.findWhere(mediaItems, { id: parseInt($(elem).attr("itemId")) });
            if (itemFound)
              selectedItems.push(itemFound);
          });
        }

        return selectedItems;
      },

      clickOK: function (callback) {
        var dataCtrl = self.getDataCtrl();
        if (dataCtrl && dataCtrl.callback) {
          dataCtrl.formCtrl = self;
          dataCtrl.callback(dataCtrl);
        }
        if (callback)
          callback();
      },

    });
    imgGalleryObj.constructor();
    return imgGalleryObj;

  };
});