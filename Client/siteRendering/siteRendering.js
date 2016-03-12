define(["CONST", "Utils", "application", "SiteInitialization"], function (CONST, Utils, application, SiteInitialization) {

  var SiteRendering = function () {
    var siteRendering = {
      constructor: function () {

      },
      render: function (contentSource) {
        var v_this = this;
        var _$scope = application.get$scope();
        var intervalWait = setInterval(function () {
          if (SiteInitialization.isItemsBound()) {
            clearInterval(intervalWait);

            try {
              var contentFn = _$compile(contentSource);
              var contentElems = contentFn(_$scope);

              $("#wrapperContent").html(contentElems);
              _$scope.$apply();

              //
              v_this.afterRender();

              var isIncludeContentLoaded = false;
              var lastDateTimeIncludeContent = Date.now();
              _$scope.$on('$includeContentLoaded', function (event, a, b, c) {
                isIncludeContentLoaded = true;
                lastDateTimeIncludeContent = Date.now();
              });

              setInterval(function () {
                if (isIncludeContentLoaded) {
                  isIncludeContentLoaded = false;
                  $("[bindobj]").unbind("mouseover");
                  $("[bindobj]").mouseover(function (ev) {

                    var bodyRect = document.body.getBoundingClientRect();
                    var elemRect = ev.currentTarget.getBoundingClientRect();
                    var offsetLeft = elemRect.left - bodyRect.left;
                    var offsetTop = elemRect.top - bodyRect.top;

                    var padding = 15;
                    $("#editCtrl").css("display", "inline-block");
                    $("#editCtrl").css("left", (offsetLeft - padding / 2) + 'px');
                    $("#editCtrl").css("top", (offsetTop - padding / 2) + 'px');
                    $("#editCtrl").css("width", (ev.currentTarget.offsetWidth + padding) + 'px');
                    //$("#editCtrl").css("height", (ev.currentTarget.offsetHeight + padding) + 'px');

                    //$("#editCtrl").find("textarea").css("width", (ev.currentTarget.offsetWidth + padding) + 'px');
                    $("#editCtrl").find("textarea").css("height", (ev.currentTarget.offsetHeight + padding) + 'px');
                    //$("#editCtrl").find("textarea").html($(ev.currentTarget).html());
                    var v_content = $(ev.currentTarget).html().trim();
                    $("#editCtrl").find("textarea").val(v_content);
                    var style = v_this.getStyle(ev.currentTarget);
                    $("#editCtrl").find("textarea").css("font-size", style.getPropertyValue("font-size"));
                    $("#editCtrl").find("textarea").css("font-weight", style.getPropertyValue("font-weight"));
                    if (style.getPropertyValue("color") == 'rgb(255, 255, 255)') {
                      $("#editCtrl").find("textarea").css("color", "black");
                    } else
                      $("#editCtrl").find("textarea").css("color", style.getPropertyValue("color"));
                  });
                }
              }, 500);

            }
            catch (ex) {
            }
          }
        }, 10);

      },
      afterRender: function () {
        var _$scope = application.get$scope();
        _$scope.cancelEdit = this.cancelEdit;
        _$scope.editItem = this.editItem;
      },
      cancelEdit: function () {
        $("#editCtrl").hide();
      },
      editItem: function (ev) {
        ev = ev || window.event;

      },

      getStyle: function (elem) {
        return window.getComputedStyle ? getComputedStyle(elem, "") : elem.currentStyle;
      },

      loadIncludeFile: function (includePath, callback) {
        $.get(includePath).success(function (data, status, headers) {
          if (callback)
            callback(includePath, data);
        });
      },
      loadContent: function () {
        var $contentSource = $("<html></html").html(contentSource)
        var $arInclude = $contentSource.find("[ng-include]");
        var hashFile = {};
        var indexLoad = 0;
        var countLoad = $arInclude.length;
        _.each($arInclude, function (include) {
          var includePath = $(include).attr("ng-include");
          includePath = includePath.replace("'", "").replace("'", "");
          hashFile[includePath] = include;
          $(include).removeAttr("ng-include");

          loadIncludeFile(includePath, function (path, data) { 
            if (hashFile[path]) {
              $(hashFile[path]).html(data);
              indexLoad++;
            }
            if (indexLoad == countLoad) {
              //var contentFn = _$compile(contentSource);
              var contentFn = _$compile($contentSource.html());
              var contentElems = contentFn(_$scope);

              $("#wrapperContent").html(contentElems);
              _$scope.$apply();
            }              
          });
        });
      },

    };
    siteRendering.constructor();
    return siteRendering;
  };
  return SiteRendering();
});