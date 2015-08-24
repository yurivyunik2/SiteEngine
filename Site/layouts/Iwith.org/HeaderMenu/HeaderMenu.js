
require(["application", "siteConst"], function (application, siteConst) {
  var headerMenuObj = function () {
    var self;

    var obj = {
      
      constructor: function () {
        var items = application.getItems();
        var headerMenuItem = _.findWhere(items, { id: siteConst.HEADER_MENU_ITEM_ID() });

        var mainMenuElem = $("#mainMenu");
        mainMenuElem.html("");

        var organizationMenuItem;
        if (headerMenuItem) {
          var templMenuItem = _.template($("#templMenuItem").html());
          _.each(headerMenuItem.children, function (child) {
            if (child.id == siteConst.ORGANIZATION_MENU_ITEM_ID()) {
              organizationMenuItem = child;
            }
            mainMenuElem.append(templMenuItem(child));
          });
        }

        if (organizationMenuItem && organizationMenuItem.children && organizationMenuItem.children.length > 0) {
          var menuItemContentElem = $("#menuItemContent");
          //menuItemContentElem.html("");
          var infoItem = organizationMenuItem.children[0];
          var data = { action: "getItemFields", id: infoItem.id, templateId: infoItem.templateId };

          application.httpRequest(data, function (responseData) {
            //var responseData = JSON.parse(response);            
            if (responseData.isOK) {
              infoItem.fields = responseData.data;
              var templmenuItemContent = _.template($("#templOrganizationContent").html());
              menuItemContentElem.append(templmenuItemContent({ title: infoItem.fields[0].value, content: infoItem.fields[1].value, imgPath: infoItem.fields[2].value }));
            } else {
              //responseData.error
            }
            
          }, function () {

          });
        }

      },
    };
    obj.constructor();
    return obj;
  };

  return headerMenuObj();
});
