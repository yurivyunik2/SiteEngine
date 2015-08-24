(function () {

  $(document).ready(function () {

    var $trDrag;
    var $trDragStart;

    var $line = $("#dragLine");

    var isDrag = false;

    $("tr").mousedown(function (event) {
      //var $tr = $(event.currentTarget);
      //$trDrag = $tr;

      //$line.css("display", "block");
      $line.css("position", "absolute");

      $trDragStart = $(event.currentTarget);
      isDrag = true;

      //$line.css("top", event.offsetY + "px");
      //$line.css("left", event.offsetX + "px");

      //$line.css("top", (event.pageY - 5) + "px");
      //$line.css("left", (event.pageX - 2) + "px");

    });

    $(window).mouseup(function (event) {
      //if ($trDrag) {
      //  $trDrag.css("position", "static");
      //}
      //$trDrag = null;
      
      $line.css("display", "none");
      isDrag = false;

      //$tr.css("top", "10px");
      //$tr.css("left", "100px");
    });


    $("tr").mousemove(function (event) {
      $trDrag = $(event.currentTarget);
      event.preventDefault();
    });

    $("table").mousemove(function (event) {
      //if ($trDrag) {
      
        //$line.css("top", event.offsetY + "px");
      //$line.css("left", event.offsetX + "px");
      //event.preventDefault();

      //if (isDrag && $trDrag) {
      //  //$line.css("top", (event.pageY - 5) + "px");
      //  //$line.css("left", (event.pageX - 2) + "px");
      //  $line.css("display", "block");
      //  $line.css("top", ($("table")[0].offsetTop + $trDrag[0].offsetTop + $trDrag[0].offsetHeight + 2) + "px");
      //  $line.css("left", ($("table")[0].offsetLeft + $trDrag[0].offsetLeft) + "px");
      //  $line.css("width", $trDrag[0].clientWidth + "px");        
      //}

      //}
      event.preventDefault();
    });

    $(window).mousemove(function (event) {

      if (isDrag && $trDrag && $trDragStart[0] != $trDrag[0]) {
        //$line.css("top", (event.pageY - 5) + "px");
        //$line.css("left", (event.pageX - 2) + "px");
        $line.css("display", "block");
        $line.css("top", ($("table")[0].offsetTop + $trDrag[0].offsetTop + $trDrag[0].offsetHeight + 2) + "px");
        $line.css("left", ($("table")[0].offsetLeft + $trDrag[0].offsetLeft) + "px");
        $line.css("width", $trDrag.find("td")[0].clientWidth + "px");
        //$line.css("width", $trDrag[0].clientWidth + "px");
      }

      //$("table").css("cursor", "pointer");
      event.preventDefault();
    });


  });

})();