
require.config({
  paths: {
    menuItem: "js/components/MenuItem/MenuItem",
    tooltipCustom: "js/components/TooltipCustom/TooltipCustom",
    TreeGrid: "js/components/TreeGrid/TreeGrid",
    infoPanel: "js/components/TreeGrid/InfoPanel",
    application: "js/application",
    EngineTreeCss: "js/components/EngineTree/EngineTree",
  },
});

define(["application",
        "CONST",
        "TreeGrid",
        "menuItem",
        "infoPanel",
        "tooltipCustom",
        "css!EngineTreeCss"
      ],
function (application, CONST, TreeGrid, MenuItem, InfoPanel, TooltipCustom) {

  var templates;

  // view
  return function (_$parentElem) {

    var self;
    var $parentElem;
    var treeGrid;
    var menuItem;

    var EngineTree = {
      srcEditImg: "./images/edit16_16.png",

      tooltip: undefined,      

      isInfoPanelResize: false,
      
      prevInfoPanelResizeX: -1,
      infoPanel: undefined,

      $dvInfoPanelElem: null,

      hashInsertOptions: {},

      initialize: function() {

        $parentElem = _$parentElem;

        self = this;

        //
        this.tooltip = new TooltipCustom(false);

        // Menu for Item
        menuItem = new MenuItem();
        $(menuItem).on(menuItem.EVENT_CLICK_ITEM(), function (event, dataEvent) {
          var actionCtrl = application.getActionCtrl();
          actionCtrl.process(dataEvent);
        });
        application.setMenuItemEngineTree(menuItem);

        //
        this.renderControlPanel();
        
        //
        var $dvTableElem = $parentElem.find(".dvTable");
        treeGrid = new TreeGrid($dvTableElem);
        treeGrid.setOpenCloseNodeEvent(self.treeGridOpenCloseNodeEventHandler);

        //
        var $dvMainContentElem = $parentElem.find("#dvMainContent");
        this.infoPanel = new InfoPanel($dvMainContentElem, self);

        //
        this.defineComponentEvents();

        //
        application.correctHeightWindow();
        
        // add to UI components
        application.addUIComponent("engineTree", self);
      },
      
      getTreeGrid: function () { return treeGrid; },

      treeGridOpenCloseNodeEventHandler: function (item) {
        if (item && item.isOpened && self.infoPanel)
          self.infoPanel.resizeInfoPanel();
      },

      intervalUI: function (uiData) {
        if (!uiData)
          return;        
        if (treeGrid && treeGrid.intervalUI) {
          treeGrid.intervalUI(uiData);
        }
      },

      populate: function (items) {
        if (treeGrid) {
          treeGrid.populate(items);
        }
      },

      refresh: function (isLoad, callback) {
        if (application) {
          if (isLoad) {
            application.loadItems(function (items) {
              self.populate(items);
              if (callback)
                callback();
            });
          } else {
            self.populate(application.getItems());
            if (callback)
              callback();
          }
        }
      },

      // addInsertOptions
      addInsertOptions: function (item) {
        if (!item)
          return;

        //var self = this;

        var insertOptionsField;
        _.each(item.fields, function (field) {
          if (CONST.INSERT_OPTIONS_FIELD_ID() === field.fieldId) {
            insertOptionsField = field;
          }
        });

        var arInsertItems = [];
        if (insertOptionsField && insertOptionsField.value && insertOptionsField.value !== "") {
          var arTemplates = insertOptionsField.value.split("|");

          var initItems = application.getItems();
          _.each(initItems, function (item) {
            if (arTemplates.indexOf(item.id.toString()) >= 0) {
              self.hashInsertOptions[item.id] = item;
              arInsertItems.push(item);
            }
          });

        }
        if (menuItem)
          menuItem.updateInsertOptions(arInsertItems);
      },

      // initializing of events
      defineComponentEvents: function () {
        var self = this;

        // mousedown
        $parentElem.mousedown(function (event) {
          if (event.which !== CONST.RIGHT_MOUSE_KEY()) { // if it's not right click
            if (event.target && menuItem.hasElem(event.target)) {
              event.target.click(event);
            } else {
              menuItem.hide();
            }
          }
        });

        // window - mouseup
        $(window).mouseup(function (event) {
          self.isInfoPanelResize = false;
        });

        $(window).mousemove(function (event) {
          //var dvInfoPanelElem = $parentElem.find(".dvInfoPanel");
          //console.log("event.pageX=" + event.pageX);
          //console.log("dvInfoPanelElem[0].offsetLeft=" + dvInfoPanelElem[0].offsetLeft);
          //if (event.pageX >= (dvInfoPanelElem[0].offsetLeft - 5) && event.pageX <= (dvInfoPanelElem[0].offsetLeft + 5)) {
          if (event.pageX <= (self.$dvInfoPanelElem[0].offsetLeft + 5)) {
            self.$dvInfoPanelElem.css("cursor", "w-resize");
          }
          else {
            self.$dvInfoPanelElem.css("cursor", "default");
          }

          //console.log("mousemove: isInArea=" + isInArea);
          //console.log("mousemove: event.pageX=" + event.pageX);
          //console.log("mousemove: (dvInfoPanelElem[0].offsetLeft + 5)=" + (dvInfoPanelElem[0].offsetLeft + 5));

          if (self.isInfoPanelResize && self.prevInfoPanelResizeX >= 0 && treeGrid) {
            var diff = event.pageX - self.prevInfoPanelResizeX;
            treeGrid.resize(diff);

            self.infoPanel.resizeInfoPanel();
          }
          self.prevInfoPanelResizeX = event.pageX;          

          // for not-selecting html-elements
          event.preventDefault();
        });

        // menu disabling
        document.oncontextmenu = function () {
          return false;
        };

      },

      // renderControlPanel
      renderControlPanel: function () {
        var html =
          '<div id="dvMainContent" class="dvContent scrollCustom" >' +
            '<div class="dvTable scrollCustom" ></div>' +
            '<div class="dvInfoPanel scrollCustom" ></div>' + 
        '</div>';

        $parentElem.append(html);

        // dvInfoPanel
        self.$dvInfoPanelElem = $parentElem.find(".dvInfoPanel");

        self.$dvInfoPanelElem.mousedown(function (event) {
          //if (event.pageX < (this.offsetLeft + 5)) {          
          if (event.pageX > (this.offsetLeft - 5) && event.pageX < (this.offsetLeft + 5)) {
            self.isInfoPanelResize = true;
          } else {
            self.isInfoPanelResize = false;
          }
        });
      },     

    };

    EngineTree.initialize();
    return EngineTree;

  };


});