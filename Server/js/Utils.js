
//exports.Utils = function () {
//  var _ = require('underscore');
//  var querystring = require('querystring');
  
//  return {
//    // hadling of the POST request
//    processPost: function (request, response, callback) {
//      var queryData = "";
//      if (typeof callback !== 'function') return null;

//      if (request.method == 'POST') {
//        request.on('data', function (data) {
//          queryData += data;
//          //if (queryData.length > 1e6) {
//          //  queryData = "";
//          //  response.writeHead(413, { 'Content-Type': 'text/plain' }).end();
//          //  request.connection.destroy();
//          //}
//        });
//        request.on('end', function () {
//          //var test = "{\"action\":\"createItem\"}";          
//          request.post = querystring.parse(queryData);
//          var postKey = _.keys(request.post);
//          var dataRequest = 0;
//          try {
//            dataRequest = JSON.parse(postKey[0]);
//          } catch (ex) {
//          }          
//          callback();
//        });

//      } else {
//        response.writeHead(405, { 'Content-Type': 'text/plain' });
//        response.end();
//      }
//    },

//    setChildItems: function (allItems, data) {
//      if (!allItems || !data || !data.parentItem)
//        return;
      
//      var parentItem = data.parentItem;
//      var self = this;
//      for (var i = 0; i < allItems.length; i++) {
//        var item = allItems[i];
//        if (item.parent === parentItem.id) {
//          if (!parentItem.childs)
//            parentItem.childs = [];

//          if(data.countChilds || data.countChilds === 0)
//            data.countChilds++;
//          parentItem.childs.push(item);

//          data.parentItem = item;
//          self.setChildItems(allItems, data);
//        }
//      }
//    },

//  };
//};
