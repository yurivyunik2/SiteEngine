define([], function () {
  return function HeaderRow(treeGrid, parentElem) {

    this.render = function () {
      var html =
        "<tr class='trHeader'>" +
          "<th class='thColumn thFirstColumn'>" +
            "<div class='dvThContent' unselectable='on' >" +
            "<span>NAME</span>" +
            "<img class='imgSort' style='visibility:visible;float: right;margin-right: 3px;' src='" + treeGrid.getSortImgSrc('name') + "'>" +
            "</div>" +
          "</th>" + 
        "</tr>";

      // appending of the elem
      parentElem.html("");
      parentElem.append(html);
      var trElem = parentElem.children().last();

      //trElem.append(html);
      var thElem = trElem.children().last();

      var imgSort = thElem.find(".imgSort");
      imgSort.mousedown([treeGrid], treeGrid.sortHandler);
    };

  };
});


