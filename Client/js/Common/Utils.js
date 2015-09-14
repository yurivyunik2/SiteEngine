define([], function () {
  function Utils() {
    return {

      setLoadingApplication: function (isLoad) {
        var $loadingAppElem = $("#loadingApp");
        var $viewAppElem = $("#viewApp");
        if (isLoad) {
          $loadingAppElem.css("display", "block");
          $viewAppElem.css("display", "none");
        } else {
          $loadingAppElem.css("display", "none");
          $viewAppElem.css("display", "block");
        }
      },

    };
  };
  return (new Utils());
});