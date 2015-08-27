define(["application", "CONST"], function (application, CONST) {

  return function ($scope) {

    var arItemsTest = [
      { name: "name1", src: "./images/gallery256.png" },
      { name: "name2", src: "./images/gallery256.png" },
      { name: "name3", src: "./images/gallery256.png" },
      { name: "name4", src: "./images/gallery256.png" },
      { name: "name5", src: "./images/gallery256.png" },
      { name: "name6", src: "./images/gallery256.png" },
      //{ name: "name7", src: "./images/gallery256.png" },      
    ];

    var self;

    var countImgInRow = 4;

    var mediaClientImagesPath = "/SiteEngine/Client/images/media/";

    var imageGalleryFormSelector = "#imageGalleryForm";
    var imgWrapperTemplateSelector = "#imgWrapperTemplate";
    var loadingTemplateSelector = "#loadingTemplate";
    

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
      },

      populate: function() {
        var $imageGalleryFormElem = $(imageGalleryFormSelector);
        if ($imageGalleryFormElem.length === 0)
          return;
        
        //
        self.setLoading();        

        var mediaItems = application.getMediaItems();

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
            break;
          }
          //DOC
          case "doc": {
            item.imgSrc = mediaClientImagesPath + "doc_file.png";
            break;
          }
          //AUDIO
          case "mp3":
          case "wav": {
            item.imgSrc = mediaClientImagesPath + "audio_file.png";
            break;
          }
          //VIDEO
          case "mpg":
          case "mpeg": {
            item.imgSrc = mediaClientImagesPath + "movie_file.png";
            break;
          }

          default: {
            item.imgSrc = mediaClientImagesPath + "text_file.gif";
            break;
          }

        }

        //mediaClientImagesPath
      },

      show: function () {
        self.populate();
      },

      clickItem: function (event) {
        var $curElem = $(event.currentTarget);
        if ($curElem.hasClass("dvSelected")) {
          $curElem.removeClass("dvSelected");
        } else {
          $curElem.addClass("dvSelected");
        }
      },

      clickOK: function (dataRequest) {        

      },
    };
    imgGalleryObj.constructor();
    return imgGalleryObj;

  };
});