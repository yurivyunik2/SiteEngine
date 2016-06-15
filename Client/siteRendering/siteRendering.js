require.config({
  paths: {
    panelFormCtrl: "/SiteEngine/Client/Views/panels/panelForm/panelFormCtrl"
  },
});

define(["CONST", "Utils", "application", "actionCtrl", "SiteInitialization", "panelFormCtrl"],
        function (CONST, Utils, application, ActionCtrl, SiteInitialization, PanelFormCtrl) {

  var SiteRendering = function () {

    var self;
    var curEditItem = {};

    var itemsChanged = [];

    var actionCtrl;
    var isContentRendered = false;
    var contentSource;
    var isIncludeContentLoaded = false;
    var editContentCtrl;

    var siteRendering = {
      constructor: function () {
        self = this;

        actionCtrl = ActionCtrl(_$scope, _$http);

        editContentCtrl = new PanelFormCtrl(_$scope, PanelFormCtrl.PANEL_TYPE().EDIT_CONTENT);

        setInterval(self.uiTick, 100);

        $("#btn_save").click(function (event) {
          self.saveItems();
          event.preventDefault();
        });
      },

      uiTick: function() {
        if (SiteInitialization.isItemsBound() && contentSource && !isContentRendered) {
          isContentRendered = true;
          self.renderContent(contentSource);
        }

        if (isIncludeContentLoaded) {
          isIncludeContentLoaded = false;
          self.bindObjMouseEvent();
        }

        //$("#btn_save").attr("disabled", "true");
      },

      renderContent: function (contentSource) {
        try {
          var contentFn = _$compile(contentSource);
          var contentElems = contentFn(_$scope);

          $("#wrapperContent").html(contentElems);
          _$scope.$apply();

          //
          self.afterRender();

          var lastDateTimeIncludeContent = Date.now();
          _$scope.$on('$includeContentLoaded', function (event, a, b, c) {
            isIncludeContentLoaded = true;
            lastDateTimeIncludeContent = Date.now();
          });

        }
        catch (ex) {
        }
      },
      render: function (_contentSource) {
        contentSource = _contentSource;
      },

      bindObjMouseEvent: function () {
        $("[bindobj]").unbind("mouseover");
        $("[bindobj]").mouseover(function (ev) {
          curEditItem.htmlElemTarget = ev.currentTarget;
          curEditItem.bindObj = $(ev.currentTarget).attr("bindobj");
          curEditItem.bindField = $(ev.currentTarget).attr("bindfield");

          var bodyRect = document.body.getBoundingClientRect();
          var elemRect = ev.currentTarget.getBoundingClientRect();
          var offsetLeft = elemRect.left - bodyRect.left;
          var offsetTop = elemRect.top - bodyRect.top;
          
          editContentCtrl.show({ editItem: curEditItem, top: offsetTop, left: offsetLeft, callback: self.callbackEdit });
        });
      },

      callbackEdit: function (data) {
        if (!data || !data.editItem)
          return;

        var item = _$scope[data.editItem.bindObj];
        if (item[data.editItem.bindField] && item.fields && data.editItem.bindField) {
          if (!_.find(itemsChanged, { id: item.id }))
            itemsChanged.push(item);
        }
      },

      afterRender: function () {
        _$scope.cancelEdit = self.cancelEdit;
        _$scope.editItem = self.editItem;
        _$scope.saveItem = self.saveItem;
      },
      
      saveItems: function () {
        if (itemsChanged.length > 0) {
          _.each(itemsChanged, function(item) {
            actionCtrl.saveItem({ item: item }, function (data) {
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