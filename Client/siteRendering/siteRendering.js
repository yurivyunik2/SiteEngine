define(["CONST", "Utils", "application", "actionCtrl", "SiteInitialization"], function (CONST, Utils, application, ActionCtrl, SiteInitialization) {

  var SiteRendering = function () {

    var self;
    var curEditItem = {};

    var itemsChanged = [];

    var v_actionCtrl;
    var v_isContentRendered = false;
    var v_contentSource;
    var v_isIncludeContentLoaded = false;

    var siteRendering = {
      constructor: function () {
        self = this;

        v_actionCtrl = ActionCtrl(_$scope, _$http);

        setInterval(self.uiTick, 100);
      },

      uiTick: function() {
        if (SiteInitialization.isItemsBound() && v_contentSource && !v_isContentRendered) {
          v_isContentRendered = true;
          self.renderContent(v_contentSource);
        }

        if (v_isIncludeContentLoaded) {
          v_isIncludeContentLoaded = false;
          self.bindObjMouseEvent();
        }

        //$("#btn_save").attr("disabled", "true");
      },

      renderContent: function (v_contentSource) {
        try {
          var contentFn = _$compile(v_contentSource);
          var contentElems = contentFn(_$scope);

          $("#wrapperContent").html(contentElems);
          _$scope.$apply();

          //
          self.afterRender();

          var lastDateTimeIncludeContent = Date.now();
          _$scope.$on('$includeContentLoaded', function (event, a, b, c) {
            v_isIncludeContentLoaded = true;
            lastDateTimeIncludeContent = Date.now();
          });

        }
        catch (ex) {
        }
      },
      render: function (_contentSource) {
        v_contentSource = _contentSource;
      },

      bindObjMouseEvent: function() {
        $("[bindobj]").unbind("mouseover");
        $("[bindobj]").mouseover(function (ev) {
          curEditItem.bindObj = $(ev.currentTarget).attr("bindobj");
          curEditItem.bindField = $(ev.currentTarget).attr("bindfield");

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
          var style = self.getStyle(ev.currentTarget);
          $("#editCtrl").find("textarea").css("font-size", style.getPropertyValue("font-size"));
          $("#editCtrl").find("textarea").css("font-weight", style.getPropertyValue("font-weight"));
          if (style.getPropertyValue("color") == 'rgb(255, 255, 255)') {
            $("#editCtrl").find("textarea").css("color", "black");
          } else
            $("#editCtrl").find("textarea").css("color", style.getPropertyValue("color"));
        });
      },

      afterRender: function () {
        _$scope.cancelEdit = self.cancelEdit;
        _$scope.editItem = self.editItem;
        _$scope.saveItem = self.saveItem;
      },
      cancelEdit: function () {
        $("#editCtrl").hide();
      },
      editItem: function (ev) {
        if (curEditItem && curEditItem.bindObj && curEditItem.bindField) {
          ev = ev || window.event;
          if (_$scope[curEditItem.bindObj]) {
            var item = _$scope[curEditItem.bindObj];
            if (item[curEditItem.bindField] && item.fields && curEditItem.bindField) {
              var field = _.findWhere(item.fields, { name: curEditItem.bindField });
              if (field) {
                field.value = $("#editCtrl").find("textarea").val();
                _$scope[curEditItem.bindObj][curEditItem.bindField] = field.value;

                itemsChanged.push(item);
              }
            }
          }
          $("#editCtrl").hide();
        }

      },
      saveItem: function () {
        if (itemsChanged.length > 0) {
          _.each(itemsChanged, function(item) {
            v_actionCtrl.saveItem({ item: item }, function (data) {
              if (data && data.item) {
                itemsChanged = _.without(itemsChanged, {id: data.item.id});
              }
            });
          });
        }
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