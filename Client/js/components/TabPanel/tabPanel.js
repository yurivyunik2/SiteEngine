define(["application", "CONST"], function (application, CONST) {
  //
  // TabPanel
  //
  function TabPanel($parentElem, _panelItems) {

    var pathTemplate = "js/components/TabPanel/TabPanel.html";

    var buttonsAlways = [
      {
        id: "btn_save",
        action: CONST.SAVE_ITEM_ACTION(),
        name: "Save",
        icon: "",
      }
    ];

    var testItems = [
      {
        id: "tab_publish",
        name: "PUBLISH", active: true,
        buttons: [
          { id: "btn_preview", action: "previewItem", name: "Preview", icon: "" }
        ],
      },
      {
        id: "tab_configure",
        name: "CONFIGURE",
        buttons: [
          { id: "btn_assign", action: "assignItem", name: "Assign", icon: "" }
        ],

      },
      {
        id: "tab_presentation",
        name: "PRESENTATION",
        buttons: [
          { id: "btn_details", action: "detailsItem", name: "Details", icon: "" }
        ],
      },
      {
        id: "tab_users",
        name: "USERS",
        buttons: [
          { id: "btn_listUsers", action:"listUsers", name: "List Users", icon: "" }
        ],
      }

    ];

    // self
    var self;
    var panelItems;
    var $parentElem;

    var EVENT_CLICK_BUTTON = "CLICK_BUTTON";

    var activeItem;

    var btnNewVersionSelector = "#btnNewVersion";
    var selVersionSelector = "#selVersion";
    var imgRemoveVersionSelector = "#imgRemoveVersion";    
    var logoutLinkSelector = "#logoutLink";
    var userNameSelector = "#userName";    

    var dvVersionSelector = ".dvVersion";
    var dvTabPanelID = "dvTabPanel";
    var ulTabsID = "ulTabs";

    var $panelElem;

    var tabPanelObj = {
      constructor: function () {
        self = this;

        application.setTabPanel(self);

        panelItems = _panelItems;
        panelItems = testItems;

        $parentElem = $($parentElem);

        var $template = $("<div></div>");
        $template.load(pathTemplate, function () {

          // creating Tabs
          var $liTabs = $template.find("#liTabs");
          var liTabsTemplate = _.template($liTabs.html());
          var content = liTabsTemplate({ panelItems: testItems });

          var $ulTabs = $template.find("#" + ulTabsID);
          $ulTabs.html(content);

          $parentElem.append($template.html());

          $panelElem = $parentElem.find("#" + dvTabPanelID);

          // tabChanged event
          $ulTabs = $parentElem.find("#" + ulTabsID);
          var $arLI = $ulTabs.find("li");
          $arLI.bind("click", { self: self }, self.tabChanged);
          $($arLI[0]).click();
          
          // languageChanged
          var $selLanguageElem = $parentElem.find(CONST.LANGUAGE_SELECTOR());
          $selLanguageElem.change(self.languageChanged);

          // versionChanged
          var $selVersionElem = $parentElem.find(selVersionSelector);
          $selVersionElem.change(self.versionChanged);
          
          // newVersionClick
          var $btnNewVersionElem = $parentElem.find(btnNewVersionSelector);
          $btnNewVersionElem.click(self.newVersionClick);
          
          // deleteVersionClick
          var $imgRemoveVersionElem = $parentElem.find(imgRemoveVersionSelector);
          $imgRemoveVersionElem.click(self.deleteVersionClick);

          // logoutClick
          var $logoutLinkElem = $parentElem.find(logoutLinkSelector);
          $logoutLinkElem.click(self.logoutClick);

          // session
          var session = application.getSession();
          if (session && session.isLogged) {
            var $userNameElem = $parentElem.find(userNameSelector);
            $userNameElem.html(session.login);
          }          
        });

        //
        application.addUIComponent("tabPanel", self);
      },

      intervalUI: function (uiData) {
        if (!uiData || !uiData.keyDownEventLast)
          return;
        
        self.keyDownEventFunc(uiData.keyDownEventLast);
      },

      populateTab: function () {
        if (!activeItem)
          return;

        var arButtons = [];
        _.each(buttonsAlways, function (button) {
          arButtons.push(button);
        });
        var buttons = activeItem.buttons;
        _.each(buttons, function (button) {
          arButtons.push(button);
        });

        //var btnHTML = "<a href='#' class='button-ribbon' ></a>";
        //var btnHtmlTempl = _.template("<a href='index.html#/Views/start' id='<%= button.id %>' action='<%= button.action %>' class='button-ribbon' ><%= button.name %></a>");
        var btnHtmlTempl = _.template("<a href='index.html#/Views/start' id='<%= button.id %>' action='<%= button.action %>' class='button-ribbon' ><%= button.name %></a>");

        var $dvContent = $panelElem.find("#dvTabContent");
        $dvContent.html("");
        _.each(arButtons, function (button) {
          var html = btnHtmlTempl({ button: button });
          var btnElem = $(html);
          $dvContent.append(btnElem);
        });
        $dvContent.find(".button-ribbon").click(function (event) {
          var $curTarget = $(event.currentTarget);
          var action = $curTarget.attr("action");
          if (action && action != "")
            $(self).trigger(EVENT_CLICK_BUTTON, action);
        });
      },

      tabChanged: function (event) {
        if (!event || !event.data || !event.data.self)
          return;
        var $liActive = $(event.currentTarget);
        var activeItems = _.where(panelItems, { id: $liActive.attr("id") });
        if (activeItems.length > 0)
          activeItem = activeItems[0];
        self.populateTab();
      },

      treeGridItemSelected: function () {
        self.languageChanged();
      },

      keyDownEventFunc: function (event) {
        if (!event)
          return;        

        // CTRL+S
        if (CONST.IS_CTRL_S_KEY(event)) {
          console.log('Ctrl+S!');
          $(self).trigger(EVENT_CLICK_BUTTON, CONST.SAVE_ITEM_ACTION());
        }
      },

      getEventClickButton: function () {
        return EVENT_CLICK_BUTTON;
      },

      logoutClick: function (event) {
        var action = "logout";
        var data = {
          action: action,
        };
        application.httpRequest(data, function (response) {
          //$scope.isShowModalForm = false;
          if (response.isOK) {
            window.location.href = '#/login';
          }
        }, function (response, status, headers, config) {
        });
      },

      languageChanged: function (event) {
        var treeGrid;
        var engineTree = application.getEngineTree();
        if (engineTree) {
          treeGrid = engineTree.getTreeGrid();
        }
        if (treeGrid && treeGrid.selectedItem) {
          self.populateVersions();
          engineTree.infoPanel.populateInfoPanel(treeGrid.selectedItem);
        }
      },
      
      //
      // VERSIONS
      //

      // populateVersions
      populateVersions: function () {
        var treeGrid;
        var engineTree = application.getEngineTree();
        if (engineTree) {
          treeGrid = engineTree.getTreeGrid();
        }
        if (treeGrid && treeGrid.selectedItem) {
          var $selVersionElem = $parentElem.find(selVersionSelector);
          var $dvVersionElem = $parentElem.find(dvVersionSelector);

          var selItem = treeGrid.selectedItem;
          var fields = selItem.fields;
          var curLangguage = application.getLanguageCurrent();
          if (fields && curLangguage) {
            var fieldsLang = _.where(fields, { itemId: selItem.id, lang: curLangguage.code });
            var dvVersionDisplay = "none";
            if (fieldsLang && fieldsLang.length > 0)
              dvVersionDisplay = "inline-block";
            $dvVersionElem.css("display", dvVersionDisplay);

            var versions = [];
            _.each(fieldsLang, function(field) {
              if (field.version && versions.indexOf(field.version) < 0)
                versions.push(field.version);
            });
            versions.sort();
            $selVersionElem[0].options.length = 0; // clear out existing items
            _.each(versions, function(version) {
              $selVersionElem[0].options.add(new Option(version, version));
            });
            $selVersionElem[0].value = versions[versions.length - 1];
          } else {
            $selVersionElem[0].options.length = 0; // clear out existing items
            //$dvVersionElem.hide();
            $dvVersionElem.css("display", "none");
          }
        }
      },

      // versionChanged
      versionChanged: function (event) {
        var treeGrid;
        var engineTree = application.getEngineTree();
        if (engineTree) {
          treeGrid = engineTree.getTreeGrid();
        }
        if (treeGrid && treeGrid.selectedItem) {
          engineTree.infoPanel.populateInfoPanel(treeGrid.selectedItem);
        }
      },

      // deleteVersionClick
      deleteVersionClick: function (event) {
        var treeGrid;
        var engineTree = application.getEngineTree();
        if (engineTree) {
          treeGrid = engineTree.getTreeGrid();
        }
        if (treeGrid && treeGrid.selectedItem) {
          var $selVersionElem = $parentElem.find(selVersionSelector);
          var curVersion = $selVersionElem.val();

          var selItem = treeGrid.selectedItem;
          //var fields = selItem.fields;
          var curLangguage = application.getLanguageCurrent();
          if (curLangguage && curVersion) {
            var action = "deleteVersion";
            var data = {
              action: action,
              item: {
                id: selItem.id,
                templateId: selItem.templateId,
              },
              lang: curLangguage.code,
              version: curVersion,
            };
            application.httpRequest(data, function (response) {
              //$scope.isShowModalForm = false;
              if (response.isOK) {                
                if (treeGrid && treeGrid.selectedItem) {
                  $(treeGrid.selectedItem.trElem).mousedown();
                }                
              }
            }, function (response, status, headers, config) {

            });
          }

        }
      },

      // newVersionClick
      newVersionClick: function (event) {
        var treeGrid;
        var engineTree = application.getEngineTree();
        if (engineTree) {
          treeGrid = engineTree.getTreeGrid();
        }
        if (treeGrid && treeGrid.selectedItem) {
          var $selVersionElem = $parentElem.find(selVersionSelector);

          var selItem = treeGrid.selectedItem;
          //var fields = selItem.fields;
          var curLangguage = application.getLanguageCurrent();
          if (curLangguage) {            
            var action = "newVersionCreate";
            var data = {
              action: action,
              item: {
                id: selItem.id,
                templateId: selItem.templateId,
              },
              lang: curLangguage.code
              //fields: $scope.selTemplate.fields
            };
            application.httpRequest(data, function (response) {
              //$scope.isShowModalForm = false;
              if (response.isOK) {
                if (response.data) {
                  if (treeGrid && treeGrid.selectedItem) {
                    $(treeGrid.selectedItem.trElem).mousedown();
                  }
                }
              }
            }, function (response, status, headers, config) {
              
            });
          }
          
        }
      },

    };

    tabPanelObj.constructor();
    return tabPanelObj;
  };

  return TabPanel;
});

