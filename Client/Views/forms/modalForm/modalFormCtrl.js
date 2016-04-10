require.config({
  paths: {
    createTemplateFormCtrl: "Views/forms/createTemplateForm/createTemplateFormCtrl",
    createItemFormCtrl: "Views/forms/createItemForm/createItemFormCtrl",
    insertOptionsForm: "Views/forms/insertOptionsForm/insertOptionsForm",
    selectTemplateFormCtrl: "Views/forms/selectTemplateForm/selectTemplateFormCtrl",
    layoutFormCtrl: "Views/forms/layoutForm/layoutFormCtrl",
    userManagerFormCtrl: "Views/forms/userManagerForm/userManagerFormCtrl",
    newUserFormCtrl: "Views/forms/newUserForm/newUserFormCtrl",
    imageGalleryFormCtrl: "Views/forms/imageGalleryForm/imageGalleryFormCtrl",
    notificationModalFormCtrl: "Views/forms/notificationModalForm/notificationModalFormCtrl",
  },
});


define(["application", "CONST",
        "createTemplateFormCtrl",
        "createItemFormCtrl",
        "insertOptionsForm",
        "selectTemplateFormCtrl",
        "layoutFormCtrl",
        "userManagerFormCtrl",
        "newUserFormCtrl",
        "imageGalleryFormCtrl",
        "notificationModalFormCtrl"
        ],
function (application, CONST, CreateTemplateFormCtrl, CreateItemFormCtrl, InsertOptionsForm, SelectTemplateFormCtrl, LayoutFormCtrl, UserManagerFormCtrl, NewUserFormCtrl, ImageGalleryFormCtrl, NotificationModalFormCtrl) {

  return function ($scope) {

    var self;
    var currentCtrl;
    var dataCtrl;

    var createTemplateFormCtrl;
    var createItemFormCtrl;
    var insertOptionsForm;
    var selectTemplateFormCtrl;
    var layoutFormCtrl;
    var userManagerFormCtrl;
    var newUserFormCtrl;
    var imageGalleryFormCtrl;
    var notificationModalFormCtrl;

    var FormType = {
      CREATE_TEMPLATE: {
        getControl: function() { return createTemplateFormCtrl; }
      },
      CREATE_ITEM: {
        getControl: function() { return createItemFormCtrl; }
      },
      ASSIGN_TEMPLATE: {
        getControl: function () { return insertOptionsForm; }
      },
      SELECT_TEMPLATE: {
        getControl: function () { return selectTemplateFormCtrl; }
      },
      LAYOUT: {
        getControl: function() { return layoutFormCtrl; }      
      },
      USER_MANAGER: {
        getControl: function () { return userManagerFormCtrl; }
      },
      NEW_USER: {
        getControl: function () { return newUserFormCtrl; }
      },

      IMAGE_GALLERY: {
        getControl: function () { return imageGalleryFormCtrl; }
      },

      NOTIFICATION_MODAL: {
        getControl: function () { return notificationModalFormCtrl; }
      },
    };

    var isCtrlLoaded = false;    
    var formSelector = "#modalFormPanel";
    var buttonsFormSelector = ".dvButtonsForm";

    var modalFormCtrl = {
      curType: null,
      FORM_TYPE: function () { return FormType; },
      get$Elem: function () { return $(formSelector); },

      constructor: function () {
        self = this;
        $scope.clickOk = this.clickOk;
        $scope.clickCancel = this.clickCancel;

        $scope.loadFormCtrlFinished = self.loadFormCtrlFinished;
        $scope.loadFormFinished = self.loadFormFinished;

        self.initialize();

        application.addUIComponent("modalFormCtrl", self);
      },

      initialize: function () {
        $scope.isError = false;
        $scope.errorMessage = "unknown error";
      },

      loadFormControls: function() {
        createTemplateFormCtrl = new CreateTemplateFormCtrl($scope);
        createItemFormCtrl = new CreateItemFormCtrl($scope);
        insertOptionsForm = new InsertOptionsForm($scope);
        selectTemplateFormCtrl = new SelectTemplateFormCtrl($scope);
        layoutFormCtrl = new LayoutFormCtrl($scope);
        userManagerFormCtrl = new UserManagerFormCtrl($scope);
        newUserFormCtrl = new NewUserFormCtrl($scope, self);
        imageGalleryFormCtrl = new ImageGalleryFormCtrl($scope);
        notificationModalFormCtrl = new NotificationModalFormCtrl($scope);
      },

      intervalUI: function (uiData) {
        if ($scope.isShowModalForm && uiData && uiData.keyDownEventLast) {
          var event = uiData.keyDownEventLast;
          var isProcessed = false;
          if (currentCtrl && currentCtrl.keyDownEventFunc) {
            isProcessed = currentCtrl.keyDownEventFunc(event);
          }
          if (!isProcessed) {
            if (event && event.which === CONST.ENTER_KEY()) {
              self.clickOk();
            }
          }
        }
      },

      loadFormFinished: function () {
        $(formSelector).find(".dvContentForm").draggable();
        //$(formSelector).find(".dvContentForm").resizable();
      },

      loadFormCtrlFinished: function () {
        isCtrlLoaded = true;
        self.showControl(dataCtrl);
        
        if (currentCtrl && currentCtrl.getFormId()) {
          var $formElem = $(formSelector).find("#" + currentCtrl.getFormId());
          var stMinWidth = $formElem.css("min-width");
          var minWidth = parseInt(stMinWidth);
          minWidth += $formElem[0].offsetLeft * 2;
          $(formSelector).find(".dvContentForm").css("min-width", minWidth + "px");
        }
      },

      setType: function (formType, data) {
        if (!formType || !formType.getControl())
          return;
        //
        self.initialize();

        dataCtrl = data;
        if (currentCtrl !== formType.getControl()) {
          isCtrlLoaded = false;
        }
        currentCtrl = formType.getControl();
        self.show(data);
      },

      show: function (data) {
        if (!currentCtrl)
          return;

        if (currentCtrl.setDataCtrl)
          currentCtrl.setDataCtrl(data);

        $scope.formPath = currentCtrl.getFormPath();
        if ($scope.formPath) {
          try {
            $scope.$apply();
          } catch (ex) {
          }
        } else {
          isCtrlLoaded = true;
        }

        if (isCtrlLoaded)
          self.showControl(data);
      },

      showControl: function (data) {
        $scope.isShowModalForm = true;        
        try {
          $scope.$apply();
        } catch (ex) { }

        if (currentCtrl) {
          var $buttonsFormElem = $(formSelector).find(buttonsFormSelector);
          (currentCtrl.isButtonsFormHide && currentCtrl.isButtonsFormHide()) ? $buttonsFormElem.hide() : $buttonsFormElem.show();

          if (currentCtrl.show)
            currentCtrl.show(data);
        }
      },

      hide: function () {
        $scope.isShowModalForm = false;
        try {
          $scope.$apply();
        } catch (ex) {
        }        
      },

      // NEXT-click, sending request to the server
      clickOk: function ($event) {
        if (currentCtrl) {          
          if (currentCtrl.isValidate) {
            var error = { message: "" };
            var isValidate = currentCtrl.isValidate(error);
            if (!isValidate) {
              if (error.message && error.message !== "")
                $scope.errorMessage = error.message;
              else
                $scope.errorMessage = "Unknown error";
              $scope.isError = true;
              try {
                $scope.$apply();
              } catch (ex) { }
              return;
            }
          }

          currentCtrl.clickOK(self.clickOkCallback);
        } else {
          self.curType = null;
          self.show();
        }
      },

      clickOkCallback: function () {
        self.hide();
      },

      clickCancel: function ($event) {
        self.hide();
      },
    };
    
    modalFormCtrl.constructor();
    return modalFormCtrl;
  };

});