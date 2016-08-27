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

    var contentSource;
    var itemsChanged = [];

    var isContentRendered = false;
    var isIncludeContentLoaded = false;
    var isEditSiteMode = false;

    var actionCtrl;
    var editContentCtrl;

    var siteRendering = {
      constructor: function () {
        self = this;

        actionCtrl = ActionCtrl(_$scope, _$http);

        editContentCtrl = new PanelFormCtrl(_$scope, PanelFormCtrl.PANEL_TYPE().EDIT_CONTENT);

        //
        self.isEditSite();

        //setInterval(self.uiTick, 100);
        application.addUIComponent("siteRendering", self);

        $("#btn_save").click(function (event) {
          self.saveItems();
          event.preventDefault();
        });

        $("#selLanguage").change(function(event) {
          SiteInitialization.bindItemFields();
          isContentRendered = false;
        });
      },

      intervalUI: function (uiData) {
        if (SiteInitialization.isItemsBound() && contentSource && !isContentRendered) {
          isContentRendered = true;          
          self.renderContent(contentSource);
        }

        if (isIncludeContentLoaded) {
          isIncludeContentLoaded = false;
          self.bindObjMouseEvent();
        }

        if (uiData && uiData.mouseDownEventLast) {
          self.mouseDownEventFunc(uiData.mouseDownEventLast);
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

      afterRender: function () {
        _$scope.cancelEdit = self.cancelEdit;
        _$scope.editItem = self.editItem;
        _$scope.saveItem = self.saveItem;
      },

      isEditSite: function() {
        // enabling "edit" mode if the param is in query string
        var urlParams = self.getUrlVars();
        for (var i = 0; i < urlParams.length; i++) {
          if (urlParams[i] === "isEdit") {
            isEditSiteMode = true;
            break;
          }
        }

        if (isEditSiteMode) {
          $(".editModePanel").css("display", "block");
        }
      },

      mouseDownEventFunc: function (event) {
        if (editContentCtrl && editContentCtrl.get$el()) {
          var $el = editContentCtrl.get$el();
          if ($el.length > 0) {
            var eventX = event.clientX;
            var eventY = event.clientY;
            var rectBound = $el[0].getBoundingClientRect();
            if (eventX < rectBound.left || eventX > (rectBound.left + rectBound.width) ||
              eventY < rectBound.top || eventY > (rectBound.top + rectBound.height)) {
              editContentCtrl.hide();
            }
          }          
        }
      },

      bindObjMouseEvent: function () {
        if (!isEditSiteMode)
          return;

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
        var $contentSource = $("<html></html").html(contentSource);
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

      // Read a page's GET URL variables and return them as an associative array.
      getUrlVars: function () {
        var vars = [], hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for (var i = 0; i < hashes.length; i++) {
          hash = hashes[i].split('=');
          vars.push(hash[0]);
          vars[hash[0]] = hash[1];
        }
        return vars;
      },

    };
    siteRendering.constructor();
    return siteRendering;
  };
  return SiteRendering();
});