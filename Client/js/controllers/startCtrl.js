require.config({
  paths: {
    EngineTree: "js/components/EngineTree/EngineTree",
    actionCtrl: "js/controllers/actionCtrl",
    modalFormCtrl: "Views/forms/modalForm/modalFormCtrl",    
    tabPanel: "js/components/TabPanel/tabPanel",
    panelFormCtrl: "Views/panels/panelForm/panelFormCtrl",
    panelTypes: "/SiteEngine/Client/Views/panels/panelTypes",
  },
});

define([
    "application",
    "CONST",
    "EngineTree",
    "actionCtrl",
    "modalFormCtrl",
    "tabPanel",
    "panelFormCtrl",
    "panelTypes",
    ],
function (application, CONST, EngineTree, ActionCtrl, ModalFormCtrl, TabPanel, PanelFormCtrl, PanelTypes) {

  return function ($scope, $http, $window) {

    var self;

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
        var engineTree = new EngineTree($("#engineTreeArea"));
        application.setEngineTree(engineTree);

        var actionCtrl = ActionCtrl($scope, $http);
        application.setActionCtrl(actionCtrl);

        var modalFormCtrl = new ModalFormCtrl($scope);
        application.setModalFormCtrl(modalFormCtrl);
        //modalFormCtrl.showType(modalFormCtrl.FORM_TYPE().NEW_USER, {});


        var tabPanel = new TabPanel($("#tabPanelArea"));
        $(tabPanel).on(tabPanel.getEventClickButton(), function (event, actionType) {
          actionCtrl.process({ actionType: actionType });
        });

        // users
        application.loadUsers();
        application.loadUserRoles();

        //
        engineTree.refresh(true, function () {
          var treeGrid = engineTree.getTreeGrid();
          if (treeGrid.treeItems && treeGrid.treeItems.length > 0) {
            var trElem = treeGrid.treeItems[0].trElem;
            treeGrid.openCloseNode(trElem);
            $(trElem).mousedown();
          }
        });
      },
      
    };
    startCtrlObj.constructor();
    return startCtrlObj;
  };

  //return function startCtrl($scope, $http, $window) {


  //};

});
