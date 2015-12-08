require(["application", "siteConst", "appCtrl"], function (application, siteConst, appCtrl) {

  var headerObj = {
    constructor: function () {

      console.log("Header: ", new Date(Date.now()));

      var items = application.getItems();

      var ulMenuElem = $(".dvMenu").find("ul");
      if (ulMenuElem.length > 0) {
        var headerItems = [];
        var headerMenuItem = _.findWhere(items, { id: siteConst.HEADER_MENU_ITEM_ID() });
        if (headerMenuItem && headerMenuItem.children) {
          _.each(headerMenuItem.children, function (child) {
            headerItems.push(child);
          });          
        }
        var headerTitleItem = _.findWhere(items, { id: siteConst.HEADER_TITLE_ITEM_ID() });
        if (headerTitleItem) {
          headerItems.push(headerTitleItem);
        }
        var searchPlaceholderItem = _.findWhere(items, { id: siteConst.SEARCH_PLACEHOLDER_ITEM_ID() });
        if (searchPlaceholderItem) {
          headerItems.push(searchPlaceholderItem);
        }

        var languagesItem = _.findWhere(items, { id: siteConst.LAUNGUAGES_ITEM_ID() });
        if (languagesItem) {
          _.each(languagesItem.children, function (child) {
            headerItems.push(child);
          });
        }        

        application.getItemGroupFields(headerItems, function (itemsGroup) {
          if (itemsGroup) {
            ulMenuElem.html("");
            var templMenuItem = _.template($("#templMenuItem").html());
            _.each(headerMenuItem.children, function (item) {
              if (itemsGroup[item.id] && itemsGroup[item.id].fields) {
                var pathField = _.findWhere(itemsGroup[item.id].fields, { name: "Path" })
                if(pathField)
                  item.pathField = pathField.value;
              }
              ulMenuElem.append(templMenuItem(item));
            });

            if (itemsGroup[headerTitleItem.id] && itemsGroup[headerTitleItem.id].fields) {
              var textField = _.findWhere(itemsGroup[headerTitleItem.id].fields, { name: "Text" })
              $(".dvTitle").find("span").html(textField.value);              
            }

            if (itemsGroup[searchPlaceholderItem.id] && itemsGroup[searchPlaceholderItem.id].fields) {
              var textField = _.findWhere(itemsGroup[searchPlaceholderItem.id].fields, { name: "Text" })
              $(".dvTop").find(".inputSearch").attr("placeholder", textField.value);
            }
            
            var languageMenuElem = $("#languageMenu");
            languageMenuElem.html("");
            var templLanguageItem = _.template($("#templLanguageItem").html());
            if (templLanguageItem) {
              _.each(languagesItem.children, function (item) {
                if (itemsGroup[item.id] && itemsGroup[item.id].fields) {
                  var nameField = _.findWhere(itemsGroup[item.id].fields, { name: "Name" })
                  if (nameField)
                    item.displayName = nameField.value;
                  var codeField = _.findWhere(itemsGroup[item.id].fields, { name: "Code" })
                  if (codeField)
                    item.code = codeField.value;
                }
                languageMenuElem.append(templLanguageItem(item));
              });
            }

          }

          //
          appCtrl.setLoadedComponent("header", true);
        });

        
      }

    },
  };
  headerObj.constructor();
  return headerObj;
});