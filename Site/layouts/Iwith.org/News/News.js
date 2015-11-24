
require(["application", "siteConst"], function (application, siteConst) {

  var newsObj = {
    constructor: function () {
      console.log("News: ", new Date(Date.now()));

      var items = application.getItems();

      var dvNewsListElem = $(".dvNewsList");
      if (dvNewsListElem.length > 0) {
        var newsList = [];
        var newsListItem = _.findWhere(items, { id: siteConst.NEWS_ITEM_ID() });
        if (newsListItem && newsListItem.children) {
          _.each(newsListItem.children, function (child) {
            newsList.push(child);
          });
        }

        application.getItemGroupFields(newsList, function (itemsGroup) {
          if (itemsGroup) {
            dvNewsListElem.html("");
            var templNewsItem = _.template($("#templNewsItem").html());
            _.each(newsListItem.children, function (item) {
              if (itemsGroup[item.id] && itemsGroup[item.id].fields) {
                var imageField = _.findWhere(itemsGroup[item.id].fields, { name: "Image" })
                if (imageField)
                  item.srcImage = imageField.value;
                var titleField = _.findWhere(itemsGroup[item.id].fields, { name: "Title" })
                if (titleField)
                  item.title = titleField.value;
                var contentField = _.findWhere(itemsGroup[item.id].fields, { name: "Content" })
                if (contentField)
                  item.content = contentField.value;
              }
              dvNewsListElem.append(templNewsItem(item));
            });
          }
        });

      }

    },
  };
  newsObj.constructor();
  return newsObj;
});