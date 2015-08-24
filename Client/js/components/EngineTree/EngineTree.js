
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

    var treeGrid;

    var EngineTree = {
      srcEditImg: "./images/edit16_16.png",

      treeGrid: undefined,

      tooltip: undefined,

      menuItem: undefined,

      isInfoPanelResize: false,
      prevInfoPanelResizeX: -1,

      isResizingPanel: false,

      infoPanel: undefined,

      $parentElem: null,
      
      initialize: function() {

        $parentElem = _$parentElem;

        self = this;

        //
        this.tooltip = new TooltipCustom(false);

        //
        this.menuItem = new MenuItem();
        $(this.menuItem).on(this.menuItem.EVENT_CLICK_ITEM(), function (event, dataEvent) {
          var actionCtrl = application.getActionCtrl();
          actionCtrl.process(dataEvent);
        });

        //
        this.renderControlPanel();
        
        //
        var $dvTableElem = $parentElem.find(".dvTable");
        treeGrid = new TreeGrid($dvTableElem);

        //
        var $dvMainContentElem = $parentElem.find("#dvMainContent");
        this.infoPanel = new InfoPanel($dvMainContentElem, treeGrid);

        treeGrid.setParameters({
          parent: this,
          tooltip: this.tooltip,
          infoPanel: this.infoPanel,
          menuItem: this.menuItem,
          isCheckBoxElem: true,
        });

        //
        this.defineComponentEvents();

        //
        application.correctHeightWindow();
        
        // add to UI components
        application.addUIComponent("engineTree", self);
      },
      
      getTreeGrid: function () { return treeGrid; },

      intervalUI: function (uiData) {
        if (!uiData || !uiData.keyDownEventLast)
          return;        
        if (treeGrid) {
          treeGrid.keyDownEventFunc(uiData.keyDownEventLast);
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

      // initializing of events
      defineComponentEvents: function () {
        var self = this;

        // mousedown
        $parentElem.mousedown(function (event) {
          if (event.which != 3) { // if it's not right click
            if (event.target && self.menuItem.hasElem(event.target)) {
              event.target.click(event);
            } else {
              self.menuItem.hide();              
            }
          }
        });

        // window - mouseup
        $(window).mouseup(function (event) {
          self.isInfoPanelResize = false;
          self.isResizingPanel = false;
        });

        $(window).mousemove(function (event) {

          var dvInfoPanelElem = $parentElem.find(".dvInfoPanel");
          //console.log("event.pageX=" + event.pageX);
          //console.log("dvInfoPanelElem[0].offsetLeft=" + dvInfoPanelElem[0].offsetLeft);
          //if (event.pageX >= (dvInfoPanelElem[0].offsetLeft - 5) && event.pageX <= (dvInfoPanelElem[0].offsetLeft + 5)) {
          if (event.pageX <= (dvInfoPanelElem[0].offsetLeft + 5)) {
            dvInfoPanelElem.css("cursor", "w-resize");
          }
          else {
            dvInfoPanelElem.css("cursor", "default");
          }

          //console.log("mousemove: isInArea=" + isInArea);
          //console.log("mousemove: event.pageX=" + event.pageX);
          //console.log("mousemove: (dvInfoPanelElem[0].offsetLeft + 5)=" + (dvInfoPanelElem[0].offsetLeft + 5));
          
          if (self.isInfoPanelResize && self.prevInfoPanelResizeX >= 0) {
            var dvTableMainElem = $parentElem.find(".dvTableMain");
            var newWidth = dvTableMainElem[0].clientWidth + (event.pageX - self.prevInfoPanelResizeX);
            dvTableMainElem.css("width", newWidth + "px");

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
        var dvInfoPanelElem = $parentElem.find(".dvInfoPanel");
        dvInfoPanelElem.mousedown(function (event) {
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