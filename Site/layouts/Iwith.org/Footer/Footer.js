
require(["application", "siteConst"], function (application, siteConst) {
  var footerObj = function () {
    var self;

    var obj = {

      constructor: function () {
        var items = application.getItems();
        
        var footerItem = _.findWhere(items, { id: siteConst.FOOTER_ITEM_ID() });

        var footerElem = $("#footer");

        var dvLinksElem = footerElem.find(".dvLinks");
        dvLinksElem.html("");
        
        if (footerItem && footerItem.children) {

          var renderLinks = function () {
            var linksTemplateElem = _.template($("#linksTemplate").html());
            var html = linksTemplateElem({ items: footerItem.children });
            dvLinksElem.append(html);
          };

          var childrenCount = footerItem.children.length;
          var indexRequest = 0;
          _.each(footerItem.children, function (child) {
            var data = { action: "getItemFields", id: child.id, templateId: child.templateId };
            application.httpRequest(data, function (responseData) {
              indexRequest++;
              if (responseData.isOK) {
                child.fields = responseData.data;
              } else {
                //responseData.error
              }

              if (childrenCount == indexRequest) {
                renderLinks();
              }
            }, function () {
              indexRequest++;
              if (childrenCount == indexRequest) {
                renderLinks();
              }
            });
            
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

  return footerObj();
});
