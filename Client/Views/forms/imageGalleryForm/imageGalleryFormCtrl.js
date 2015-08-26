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

    var imageGalleryFormSelector = "#imageGalleryForm";
    var imgWrapperTemplateSelector = "#imgWrapperTemplate";

    var imgGalleryObj = {
      constructor: function() {
        self = this;
      },

      populate: function() {
        var $imageGalleryFormElem = $(imageGalleryFormSelector);
        if ($imageGalleryFormElem.length === 0)
          return;

        var $imgWrapperTemplateElem = $(imgWrapperTemplateSelector);

        var $tableElem = $imageGalleryFormElem.find("table");
        $tableElem.html("");

        var mediaItems = arItemsTest;

        var $imgWrapperTemplate = _.template($imgWrapperTemplateElem.html());

        var indexImgInRow = 0;
        $tableElem.append("<tr></tr>");
        var trLast = $tableElem.find("tr").last();
        _.each(mediaItems, function(item) {
          var html = $imgWrapperTemplate({item: item});
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