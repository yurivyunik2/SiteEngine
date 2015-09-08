define(["application", "CONST"], function (application, CONST) {
  //
  // TabPanel
  //
  function TabPanel($parentElem, items) {

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

    var EVENT_CLICK_BUTTON = "CLICK_BUTTON";

    var btnNewVersionSelector = "#btnNewVersion";
    var selVersionSelector = "#selVersion";
    var imgRemoveVersionSelector = "#imgRemoveVersion";
    
    var logoutLinkSelector = "#logoutLink";
    var userNameSelector = "#userName";
    
    

    var dvVersionSelector = ".dvVersion";

    var tabPanelObj = {

      items: null,

      dvTabPanelID: "dvTabPanel",
      ulTabsID: "ulTabs",

      $parentElem: null,

      $panelElem: null,

      activeItem: null,

      constructor: function () {
        self = this;

        application.setTabPanel(self);

        this.items = items;
        this.items = testItems;

        self.$parentElem = $($parentElem);

        var $template = $("<div></div>");
        $template.load(pathTemplate, function () {
          var $liTabs = $template.find("#liTabs");
          var liTabsTemplate = _.template($liTabs.html());
          var content = liTabsTemplate({ items: testItems });

          var $ulTabs = $template.find("#" + self.ulTabsID);
          $ulTabs.html(content);

          self.$parentElem.append($template.html());

          self.$panelElem = self.$parentElem.find("#" + self.dvTabPanelID);

          $ulTabs = self.$parentElem.find("#" + self.ulTabsID);
          var $arLI = $ulTabs.find("li");
          $arLI.bind("click", { self: self }, self.tabChanged);
          $($arLI[0]).click();
          
          var $selLanguageElem = self.$parentElem.find(CONST.LANGUAGE_SELECTOR());
          $selLanguageElem.change(self.languageChanged);

          var $selVersionElem = self.$parentElem.find(selVersionSelector);
          $selVersionElem.change(self.versionChanged);
          
          var $btnNewVersionElem = self.$parentElem.find(btnNewVersionSelector);
          $btnNewVersionElem.click(self.newVersionClick);
          
          var $imgRemoveVersionElem = self.$parentElem.find(imgRemoveVersionSelector);
          $imgRemoveVersionElem.click(self.deleteVersionClick);

          var $logoutLinkElem = self.$parentElem.find(logoutLinkSelector);
          $logoutLinkElem.click(self.logoutClick);


          var session = application.getSession();
          if (session && session.isLogged) {
            var $userNameElem = self.$parentElem.find(userNameSelector);
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

      tabChanged: function (event) {
        if (!event || !event.data || !event.data.self)
          return;
        $liActive = $(event.currentTarget);
        var activeItems = _.where(self.items, { id: $liActive.attr("id") });
        if (activeItems.length > 0)
          self.activeItem = activeItems[0];
        self.populateTab();
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
      
      populateVersions: function () {
        var treeGrid;
        var engineTree = application.getEngineTree();
        if (engineTree) {
          treeGrid = engineTree.getTreeGrid();
        }

        if (treeGrid && treeGrid.selectedItem) {
          var $selVersionElem = self.$parentElem.find(selVersionSelector);
          var $dvVersionElem = self.$parentElem.find(dvVersionSelector);

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

      deleteVersionClick: function (event) {
        var treeGrid;
        var engineTree = application.getEngineTree();
        if (engineTree) {
          treeGrid = engineTree.getTreeGrid();
        }
        if (treeGrid && treeGrid.selectedItem) {
          var $selVersionElem = self.$parentElem.find(selVersionSelector);
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

      newVersionClick: function (event) {
        var treeGrid;
        var engineTree = application.getEngineTree();
        if (engineTree) {
          treeGrid = engineTree.getTreeGrid();
        }
        if (treeGrid && treeGrid.selectedItem) {
          var $selVersionElem = self.$parentElem.find(selVersionSelector);

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

      populateTab: function () {
        if (!this.activeItem)
          return;

        var arButtons = [];
        _.each(buttonsAlways, function (button) {
          arButtons.push(button);
        });
        var buttons = this.activeItem.buttons;
        _.each(buttons, function (button) {
          arButtons.push(button);
        });

        //var btnHTML = "<a href='#' class='button-ribbon' ></a>";
        //var btnHtmlTempl = _.template("<a href='index.html#/Views/start' id='<%= button.id %>' action='<%= button.action %>' class='button-ribbon' ><%= button.name %></a>");
        var btnHtmlTempl = _.template("<a href='index.html#/Views/start' id='<%= button.id %>' action='<%= button.action %>' class='button-ribbon' ><%= button.name %></a>");

        var $dvContent = this.$panelElem.find("#dvTabContent");
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
      


    };

    tabPanelObj.constructor();
    return tabPanelObj;
  };

  return TabPanel;
});

