﻿
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
        "Utils",
        "css!EngineTreeCss"
      ],
function (application, CONST, TreeGrid, MenuItem, InfoPanel, TooltipCustom, Utils) {

  // view
  return function (_$parentElem) {

    var self;
    var $parentElem;
    var treeGrid;
    var menuItem;

    var $dvTableElem;
    var $dvInfoPanelElem;

    //var resizeCursorInverval = 6;
    var resizeCursorInverval = 5;

    var isWidthCorrect = false;

    var engineTree = {
      srcEditImg: "./images/edit16_16.png",

      tooltip: undefined,

      isInfoPanelResize: false,

      infoPanel: undefined,

      $dvInfoPanelElem: null,

      hashInsertOptions: {},

      constructor: function() {

        $parentElem = _$parentElem;

        self = this;

        //
        this.tooltip = new TooltipCustom(false);

        // Menu for Item
        menuItem = new MenuItem();
        $(menuItem).on(menuItem.EVENT_CLICK_ITEM(), function(event, dataEvent) {
          var actionCtrl = application.getActionCtrl();
          actionCtrl.process(dataEvent);
        });
        application.setMenuItemEngineTree(menuItem);

        //
        this.renderControlPanel();

        //
        var $dvTableElem = $parentElem.find(".dvTable");
        treeGrid = new TreeGrid($dvTableElem, true);
        //treeGrid.setOpenCloseNodeEvent(self.treeGridOpenCloseNodeEventHandler);

        //
        var $dvMainContentElem = $parentElem.find("#dvMainContent");
        this.infoPanel = new InfoPanel($dvMainContentElem, self);

        //
        this.defineComponentEvents();

        // add to UI components
        application.addUIComponent("engineTree", self);
      },

      getTreeGrid: function() { return treeGrid; },

      selectCurrentItem: function() {
        if (treeGrid) {
          treeGrid.selectCurrentItem();
        }
      },

      isAvailableElements: function () {
        // dvTable
        if (!$dvTableElem || $dvTableElem.length === 0) {
          $dvTableElem = $parentElem.find(".dvTable");
          if ($dvTableElem.length > 0) {
            $dvTableElem.mousedown(self.mouseDownElement);
          }
        }
        // dvInfoPanel
        if (!$dvInfoPanelElem || $dvInfoPanelElem.length === 0) {
          $dvInfoPanelElem = $parentElem.find(".dvInfoPanel");
          if ($dvInfoPanelElem.length > 0) {
            $dvInfoPanelElem.mousedown(self.mouseDownElement);
          }
        }

        return (($dvTableElem.length === 0 || $dvTableElem[0].clientWidth === 0) || $dvInfoPanelElem.length === 0) ? false : true;
      },

      intervalUI: function (uiData) {
        if (!uiData)
          return;        
        //if (treeGrid && treeGrid.intervalUI) {
        //  treeGrid.intervalUI(uiData);
        //}
        if (!isWidthCorrect && self.isAvailableElements()) {
          isWidthCorrect = true;
          self.resizePanels(1);
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
        // mousedown
        $parentElem.mousedown(self.mouseDownWindow);

        // window - mouseup
        $(window).mouseup(self.mouseUpWindow);

        //$(window).mousemove(self.mouseMoveWindow);
        window.onmousemove = self.mouseMoveWindow;

        $(window).resize(function(event) {
          self.resizePanels(1);
          self.resizePanels(-1);
        });

        // menu disabling
        document.oncontextmenu = function () {
          return false;
        };
      },

      mouseDownElement: function (event) {
        var edgePoint = this.offsetLeft;
        if (edgePoint === 0)
          edgePoint += this.clientWidth;
        if (event.pageX >= (edgePoint - resizeCursorInverval) && event.pageX <= (edgePoint + resizeCursorInverval)) {
          self.isInfoPanelResize = true;
        } else {
          self.isInfoPanelResize = false;
        }
      },

      mouseDownWindow: function(event) {
        if (event.which !== CONST.RIGHT_MOUSE_KEY()) { // if it's not right click
          if (event.target && menuItem.hasElem(event.target)) {
            event.target.click(event);
          } else {
            menuItem.hide();
          }
        }
      },

      mouseUpWindow: function(event) {
        self.isInfoPanelResize = false;
      },

      mouseMoveWindow: function (event) {
        if (!self.isAvailableElements())
          return;

        var leftEdge = ($dvTableElem[0].offsetLeft + $dvTableElem[0].offsetWidth - resizeCursorInverval);
        var rightEdge = ($dvInfoPanelElem[0].offsetLeft + resizeCursorInverval);
        if (event.pageX >= leftEdge && event.pageX <= rightEdge) {
          $dvTableElem.css("cursor", "w-resize");
          $dvTableElem.css("cursor", "w-resize");
          $dvInfoPanelElem.css("cursor", "w-resize");
        }
        else {
          $dvTableElem.css("cursor", "default");
          $dvTableElem.css("cursor", "default");
          $dvInfoPanelElem.css("cursor", "default");
        } 
        
        if (self.isInfoPanelResize && treeGrid) {
          self.resizePanels(event.pageX);
        }

        // for preventing of the handling of the events on other elements
        Utils.cancelEvent(event);
      },

      resizePanels: function (newTableWidth) {
        if (!self.isAvailableElements())
          return;

        var minWidthTable = parseInt($dvTableElem.css("min-width"));
        var minWidthInfoPanel = parseInt($dvInfoPanelElem.css("min-width"));

        if (newTableWidth <= 1)
          newTableWidth = minWidthTable + 1;

        var newInfoPanelWidth = window.innerWidth - newTableWidth;


        if (minWidthTable < newTableWidth && newInfoPanelWidth > minWidthInfoPanel) {
          $dvTableElem.css("width", newTableWidth + "px");
          $dvInfoPanelElem.css("width", newInfoPanelWidth + "px");
        }
      },

      // renderControlPanel
      renderControlPanel: function () {
        var html =
          '<div id="dvMainContent" class="dvContent scrollCustom" >' +
            '<div class="dvTable scrollCustom" ></div>' +
            '<div class="dvInfoPanel scrollCustom" ></div>' + 
        '</div>';

        $parentElem.append(html);
      },     

    };

    engineTree.constructor();
    return engineTree;

  };


});