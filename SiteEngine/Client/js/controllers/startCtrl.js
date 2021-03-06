﻿require.config({
  paths: {
    EngineTree: "js/components/EngineTree/EngineTree",
    actionCtrl: "js/controllers/actionCtrl",
    modalFormCtrl: "/SiteEngine/Client/Views/forms/modalForm/modalFormCtrl",
    tabPanel: "js/components/TabPanel/tabPanel",
    panelFormCtrl: "/SiteEngine/Client/Views/panels/panelForm/panelFormCtrl",

    componentMgr: "js/components/ComponentMgr",
    //richTextEditor: "js/components/RichTextEditor/RichTextEditor",
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
    "componentMgr",
    //"richTextEditor",
    ],
function (application, CONST, Utils, EngineTree, ActionCtrl, ModalFormCtrl, TabPanel, PanelFormCtrl, ComponentMgr) {

  return function ($scope, $http, $window) {
    if (!window.location.hash || window.location.hash.indexOf(CONST.APPLICATION_START_VIEW()) < 0)
      return null;

    var self;

    var startCtrlObj = {
      constructor: function () {

        self = this;        

        application.initialize($scope, $http, $window);

        var session = application.getSession();
        //if (!session || !session.isLogged) {
        var action = "pingSession";
        var data = {
          action: action,
          sessionID: (session ? session.id : '')
        };

        self.isRequestProcess = true;
        application.httpRequest(data, function success(response) {
          if (!response.error) {
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
        
      },
      
      initializeComponents: function () {
        var engineTree = new EngineTree($("#engineTreeArea"));
        application.setEngineTree(engineTree);
        
        var actionCtrl = ActionCtrl($scope, $http);
        application.setActionCtrl(actionCtrl);
        
        var modalFormCtrl = new ModalFormCtrl($scope);
        application.setModalFormCtrl(modalFormCtrl);
        //setTimeout(function() {
        //  modalFormCtrl.setType(modalFormCtrl.FORM_TYPE().LAYOUT, { item: application.getEngineTree().getTreeGrid().selectedItem });
        //}, 800);


        var tabPanel = new TabPanel($("#tabPanelArea"));
        $(tabPanel).on(CONST.EVENT_CLICK_BUTTON(), function (event, actionType) {
          actionCtrl.process({ actionType: actionType });
        });

        ////
        //var richTextEditor = new RichTextEditor($scope);
        //application.setRichTextEditorCtrl(richTextEditor);

        //
        var componentMgr = new ComponentMgr($scope);
        application.setComponentMgr(componentMgr);


        // load application
        application.loadApplication();
      },

    };
    startCtrlObj.constructor();
    return startCtrlObj;
  };

});
