require.config({
  paths: {
    EngineTree: "js/components/EngineTree/EngineTree",
    actionCtrl: "js/controllers/actionCtrl",
    modalFormCtrl: "Views/forms/modalForm/modalFormCtrl",    
    tabPanel: "js/components/TabPanel/tabPanel",
    panelFormCtrl: "Views/panels/panelForm/panelFormCtrl",
    panelTypes: "/SiteEngine/Client/Views/panels/panelTypes",

    richTextEditor: "js/components/RichTextEditor/RichTextEditor",
  },
});

define([
    "application",
    "CONST",
    "Utils",
    "EngineTree",
    "actionCtrl",
    "modalFormCtrl",
    "tabPanel",
    "panelFormCtrl",
    "panelTypes",
    "richTextEditor",
    ],
function (application, CONST, Utils, EngineTree, ActionCtrl, ModalFormCtrl, TabPanel, PanelFormCtrl, PanelTypes, RichTextEditor) {

  return function ($scope, $http, $window) {

    var self;

    var isLoadUsers = false;
    var isLoadRoles = false;
    var isLoadItems = false;

    var startCtrlObj = {
      constructor: function () {

        self = this;        

        application.initialize($scope, $http, $window);

        var session = application.getSession();
        if (!session || !session.isLogged) {

          var action = "pingSession";
          var data = {
            action: action,
          };

          self.isRequestProcess = true;
          application.httpRequest(data, function success(response) {
            if (response.isOK) {
              if (response.data && response.data.user && response.data.user.sessionID) {
                var user = response.data.user;
                application.setSession(user.sessionID, user.name, user.password);
                self.initializeComponents();
              }
            } else {
              $window.location.href = '#/login';
            }
          }, function error(response, status, headers) {
          });

        } else {
          self.initializeComponents();
        }

      },
      
      initializeComponents: function () {

        // loading
        Utils.setLoadingApplication(true);

        var engineTree = new EngineTree($("#engineTreeArea"));
        application.setEngineTree(engineTree);

        var actionCtrl = ActionCtrl($scope, $http);
        application.setActionCtrl(actionCtrl);

        var modalFormCtrl = new ModalFormCtrl($scope);
        application.setModalFormCtrl(modalFormCtrl);
        setTimeout(function() {
          //modalFormCtrl.showType(modalFormCtrl.FORM_TYPE().IMAGE_GALLERY, {});
        }, 300);


        var tabPanel = new TabPanel($("#tabPanelArea"));
        $(tabPanel).on(tabPanel.getEventClickButton(), function (event, actionType) {
          actionCtrl.process({ actionType: actionType });
        });

        //
        var richTextEditor = new RichTextEditor($scope);
        application.setRichTextEditorCtrl(richTextEditor);

        // users
        application.loadUsers(function(user) {
          isLoadUsers = true;
        });
        application.loadUserRoles(function(roles) {
          isLoadRoles = true;
        });
        application.loadItems(function (items) {
          isLoadItems = true;
        });

        //
        application.addUIComponent("startCtrl", self);
      },

      intervalUI: function (uiData) {
        if (isLoadUsers && isLoadRoles && isLoadItems) {
          var items = application.getItems();
          var engineTree = application.getEngineTree();
          if (!items || !engineTree)
            return;
          var treeGrid = engineTree.getTreeGrid();          
          if (treeGrid) {            
            treeGrid.populate(items);
            if (treeGrid.treeItems && treeGrid.treeItems.length > 0) {
              var trElem = treeGrid.treeItems[0].trElem;
              if (trElem) {
                treeGrid.openCloseNode(trElem);
                $(trElem).mousedown();
              }
            }
          }
          // loading - turn off
          Utils.setLoadingApplication(false);

          application.removeUIComponent("startCtrl");
        }
      },

    };
    startCtrlObj.constructor();
    return startCtrlObj;
  };

});
