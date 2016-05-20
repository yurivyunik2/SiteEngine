define(["application", "CONST", "Utils", "CommonTypes"], function (application, CONST, Utils, CommonTypes) {

  return function ($scope) {
    var self;

    var isInitializedEventsSubscribe = false;
    var countImgInRow = 5;

    var allMediaItems = [];
    var allFolderItemsHash = {};
    var selectedFolderItem;

    var mediaClientImagesPath = "/SiteEngine/Client/images/media/";

    var isShowNewFolder = false;

    var $imageGalleryFormElem;
    var $dvBtnDeleteElem;
    var $dvNewFolderElem;    

    var isMultipleSelect = false;

    // UPLOADING
    var amountUploadFiles = 0;
    var indexFileUpload = 0;
    var uploadErrors = [];

    var imgGalleryObj = new CommonTypes.BaseFormElement();
    _.extend(imgGalleryObj, {
      constructor: function () {
        self = this;
        self.setBaseData({
          formPath: "/SiteEngine/Client/Views/forms/imageGalleryForm/imageGalleryForm.html",
        });

      },

      keyDownEventFunc: function (event) {
        if (!event)
          return false;

        switch (event.which) {
          case CONST.ESCAPE_KEY():
            {
              self.showHideNewFolderElem(false);
              return true;
            }
          case CONST.ENTER_KEY():
            {
              if (isShowNewFolder) {
                self.createNewFolder();
              }
              return true;
            }
        }

        return false;
      },

      mouseDownEventFunc: function (event) {
        var rectBound;
        var eventX = event.clientX;
        var eventY = event.clientY;
        if (isShowNewFolder) {
          rectBound = $dvNewFolderElem[0].getBoundingClientRect();
          if (eventX < rectBound.left || eventX > (rectBound.left + rectBound.width) ||
            eventY < rectBound.top || eventY > (rectBound.top + rectBound.height)) {
            self.showHideNewFolderElem(false);
          }
        }

        // img-remove folder
        var $dvFolderElem = $(event.target).parents(".dvFolder");
        if ($dvFolderElem.length > 0) {
          var $imgRemoveElem = $dvFolderElem.find(".imgRemove");
          if ($imgRemoveElem.length > 0) {
            rectBound = $imgRemoveElem[0].getBoundingClientRect();
            if (eventX >= rectBound.left && eventX <= (rectBound.left + rectBound.width) &&
              eventY >= rectBound.top && eventY <= (rectBound.top + rectBound.height)) {

              var idFolder = $dvFolderElem[0].id;
              var folderItem = allFolderItemsHash[idFolder];
              if (folderItem) {
                self.deleteFolder(folderItem);
              }              
            }
          }
        }
      },

      initializeEventsSubscribe: function() {
        $imageGalleryFormElem.find("#inputFileDlg").change(self.uploadFilesSelected);

        var $btnUploadFilesElem = $imageGalleryFormElem.find("#btnUploadFiles");
        $btnUploadFilesElem.click(function () {
          var $inputFileDlgElem = $imageGalleryFormElem.find("#inputFileDlg");
          //$inputFileDlgElem[0].files = [];
          $inputFileDlgElem[0].files.length = 0;
          $inputFileDlgElem[0].value = "";
          $inputFileDlgElem.click();
        });
        var $btnAddFolderElem = $imageGalleryFormElem.find("#btnAddFolder");
        $btnAddFolderElem.click(function () {
          self.showHideNewFolderElem(true);
        });

        $dvBtnDeleteElem.click(self.deleteImages);        
      },

      renderMediaItems: function (items) {
        if ($imageGalleryFormElem.length === 0)
          return;

        var $imgWrapperTemplateElem = $imageGalleryFormElem.find("#imgWrapperTemplate");

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
          if (!isMultipleSelect) {
            var modalFormCtrl = application.getModalFormCtrl();
            modalFormCtrl.clickOk();
          }          
        });
      },

      renderFolders: function (notSelect) {
        allFolderItemsHash = {};
        _.each(allMediaItems, function (item) {
          if (item.templateId === CONST.FOLDER_TEMPLATE_ID()) {
            allFolderItemsHash[item.id] = item;
          }
        });

        var $dvFoldersElem = $imageGalleryFormElem.find(".dvFolders");
        $dvFoldersElem.empty();
        var html = "<div id='allMediaItem' class='dvFolder'><span>All Media</span></div>";
        html += "<div class='dvListFolders'></div>";
        $dvFoldersElem.append(html);

        var $dvListFoldersElem = $dvFoldersElem.find(".dvListFolders");
        $dvListFoldersElem.empty();

        var itemKeys = _.keys(allFolderItemsHash);
        for (var i = 0; i < itemKeys.length; i++) {
          var folderItem = allFolderItemsHash[itemKeys[i]];
          html = "<div id='" + folderItem.id + "' class='dvFolder'>";
          var $folder = $(html);
          $folder.append("<span>" + folderItem.name + "</span>");
          $folder.append("<img class='imgRemove' src='/SiteEngine/Client/images/remove.png'>");

          $dvListFoldersElem.append($folder);
        }
        $dvFoldersElem.find(".dvFolder").click(function (event) {
          var folderItem = allFolderItemsHash[event.currentTarget.id];
          self.selectFolder(folderItem);
        });

        //
        if (!notSelect) {
          self.selectFolder(selectedFolderItem);
        }        
      },

      selectFolder: function (folderItem) {

        selectedFolderItem = (folderItem && allFolderItemsHash[folderItem.id]) ? folderItem : null;

        var $dvFoldersElem = $imageGalleryFormElem.find(".dvFolders");
        $dvFoldersElem.find(".selected").removeClass("selected");
        if (selectedFolderItem) {
          $dvFoldersElem.find("#" + selectedFolderItem.id).addClass("selected");
        } else {
          $dvFoldersElem.find("#allMediaItem").addClass("selected");
        }
        
        //var mediaItems = application.getMediaItems();
        var itemsFolder = [];
        if (selectedFolderItem) {
          if (selectedFolderItem.children)
            itemsFolder = folderItem.children;
        } else {
          itemsFolder = allMediaItems;
        }

        self.populateItems(itemsFolder);
      },

      populateItems: function (items) {
        if ($imageGalleryFormElem.length === 0)
          return;

        var mediaItems = [];
        _.each(items, function (item) {
          if (item.templateId === CONST.MEDIA_ITEM_TEMPLATE_ID()) {
            mediaItems.push(item);
          }
        });

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

        //
        self.uploadButtonsState();
      },

      setLoading: function () {
        if ($imageGalleryFormElem.length === 0)
          return;

        var $loadingTemplateElem = $imageGalleryFormElem.find("#loadingTemplate");

        var $tableElem = $imageGalleryFormElem.find("table");
        $tableElem.html($loadingTemplateElem.html());
      },

      showNoData: function() {
        if ($imageGalleryFormElem.length === 0)
          return;

        var $noDataTemplateElem = $imageGalleryFormElem.find("#noDataTemplate");

        var $tableElem = $imageGalleryFormElem.find("table");
        $tableElem.html($noDataTemplateElem.html());
      },

      showHideNewFolderElem: function (isShow) {
        isShowNewFolder = isShow;
        if (isShow) {
          $dvNewFolderElem.css("display", "block");
          $dvNewFolderElem.find("input").val("");
          $dvNewFolderElem.find("input").focus();
        } else
          $dvNewFolderElem.css("display", "none");
      },

      createNewFolder: function () {
        var $inputNewFolderElem = $dvNewFolderElem.find("input");
        var newFolderName = $inputNewFolderElem.val();
        if (!newFolderName)
          return;

        var curlang = Utils.getLanguageCurrent();
        var langCode = "";
        if (curlang)
          langCode = curlang.code;

        var action = "createItem";
        var data = {
          action: action,
          item: {
            name: newFolderName,
            parentId: CONST.MEDIA_ROOT_ID(),
            templateId: CONST.FOLDER_TEMPLATE_ID(),
          },
          lang: langCode
        };

        application.httpRequest(data, function (response) {
          if (response) {
            if (!response.error) {
              if (response.data && response.data.item) {
                application.addItem(response.data.item);
                allMediaItems.push(response.data.item);
                self.renderFolders();
              }
            } else {
              
            }
          }
          self.showHideNewFolderElem(false);
        }, function (response, status, headers, config) {
          self.showHideNewFolderElem(false);
        });

      },

      deleteFolder: function (foderItem) {
        if (!foderItem)
          return;

        var deleteFolderCallback = function (item) {
          allMediaItems = _.without(allMediaItems, _.findWhere(allMediaItems, { id: item.id }));
          var isNotSelect = false;
          if (selectedFolderItem && item.id !== selectedFolderItem.id)
            isNotSelect = true;
          self.renderFolders(isNotSelect);
        };

        var actionCtrl = application.getActionCtrl();
        if (actionCtrl) {
          var data = {
            actionType: "deleteItem",
            item: foderItem,
            callback: deleteFolderCallback,
          };
          actionCtrl.deleteItem(data);
        }
      },

      deleteImages: function () {
        var selectedItems = self.getSelectedItems();
        if (!selectedItems || selectedItems.length === 0)
          return;

        var amountSelectedItems = selectedItems.length;
        var indexDeletedItem = 0;
        var deleteItemCallback = function (item) {
          indexDeletedItem++;
          var removeItemFound = _.findWhere(allMediaItems, { id: item.id });
          if (removeItemFound) {
            allMediaItems = _.without(allMediaItems, removeItemFound);
          }
          if (indexDeletedItem === amountSelectedItems) {
            self.selectFolder(selectedFolderItem);
          }
        };

        var actionCtrl = application.getActionCtrl();
        if (actionCtrl) {
          _.each(selectedItems, function (item) {
            var data = {
              actionType: "deleteItem",
              item: item,
              callback: deleteItemCallback,
            };
            actionCtrl.deleteItem(data);
          });
        }
        
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
        if (!$imageGalleryFormElem || $imageGalleryFormElem.length === 0) {
          $imageGalleryFormElem = $("#imageGalleryForm");
          isInitializedEventsSubscribe = false;
        }        
        if ($imageGalleryFormElem.length === 0)
          return;

        $dvNewFolderElem = $imageGalleryFormElem.find(".dvNewFolder");
        $dvBtnDeleteElem = $imageGalleryFormElem.find(".dvBtnDelete");

        self.setDataCtrl(data);
        isMultipleSelect = (data && data.isMultipleSelect) ? true : false;

        if (!isInitializedEventsSubscribe) {
          isInitializedEventsSubscribe = true;
          self.initializeEventsSubscribe();
        }

        allMediaItems = application.getMediaItems();
        //self.populate();        
        self.renderFolders();        
      },

      showHideUploadInfo: function (isShow) {
        if ($imageGalleryFormElem.length === 0)
          return;

        var $dvUploadInformationElem = $imageGalleryFormElem.find(".dvUploadInformation");
        var $uploadSliderInnerElem = $imageGalleryFormElem.find("#sliderInner");
        var $uploadInfoMessageElem = $imageGalleryFormElem.find("#uploadInfoMessage");
        if (isShow) {
          $dvUploadInformationElem.css("display", "table-cell");
          $uploadSliderInnerElem.width("0%");
          $uploadInfoMessageElem.html("Uploading: 0/" + amountUploadFiles);
        }
        else
          $dvUploadInformationElem.css("display", "none");
      },

      uploadFilesSelected: function () {
        if ($imageGalleryFormElem.length === 0)
          return;

        var $inputFileDlgElem = $imageGalleryFormElem.find("#inputFileDlg");

        var $uploadInfoElem = $imageGalleryFormElem.find("#uploadInfo");

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

      uploadFileCallback: function (response, error) {
        if ($imageGalleryFormElem.length === 0 || amountUploadFiles === 0)
          return;

        var $uploadInfoMessageElem = $imageGalleryFormElem.find("#uploadInfoMessage");
        var $uploadSliderInnerElem = $imageGalleryFormElem.find("#sliderInner");


        //
        indexFileUpload++;
        $uploadInfoMessageElem.html("Uploading: " + indexFileUpload + "/" + amountUploadFiles);
        var widthPercent = (indexFileUpload / amountUploadFiles) * 100;
        $uploadSliderInnerElem.width(widthPercent + "%");
        if (response) {
          if (!response.error) {
            if (response.data && response.data.item) {
              application.addItem(response.data.item);
              allMediaItems.push(response.data.item);
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

      uploadFilesFinish: function () {
        self.showHideUploadInfo(false);
        self.selectFolder(selectedFolderItem);
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

        var parentId = CONST.MEDIA_ROOT_ID();
        if (selectedFolderItem) {
          parentId = selectedFolderItem.id;
        }

        var action = "createItem";
        var data = {
          action: action,
          item: {
            name: file.name,
            parentId: parentId,
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
            if ($imageGalleryFormElem.length > 0) {
              $imageGalleryFormElem.find(".dvSelected").removeClass("dvSelected");
            }
          }
          $curElem.addClass("dvSelected");
        }

        //
        self.uploadButtonsState();
      },

      uploadButtonsState: function() {
        var deleteDisplay = $imageGalleryFormElem.find(".dvSelected").length > 0 ? "block" : "none";
        $dvBtnDeleteElem.css("display", deleteDisplay);
      },

      getSelectedItems: function () {
        var selectedItems = [];
        if (!allMediaItems)
          return selectedItems;

        if ($imageGalleryFormElem.length > 0) {
          var selectedElems = $imageGalleryFormElem.find(".dvSelected");
          _.each(selectedElems, function (elem) {
            var itemFound = _.findWhere(allMediaItems, { id: parseInt($(elem).attr("itemId")) });
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