require.config({
  paths: {
    createTemplateFormCtrl: "Views/forms/createTemplateForm/createTemplateFormCtrl",
    createItemFormCtrl: "Views/forms/createItemForm/createItemFormCtrl",
    insertOptionsForm: "Views/forms/insertOptionsForm/insertOptionsForm",
    layoutFormCtrl: "Views/forms/layoutForm/layoutFormCtrl",
    userManagerFormCtrl: "Views/forms/userManagerForm/userManagerFormCtrl",
    newUserFormCtrl: "Views/forms/newUserForm/newUserFormCtrl",
    imageGalleryFormCtrl: "Views/forms/imageGalleryForm/imageGalleryFormCtrl",
  },
});


define(["application", "CONST",
        "createTemplateFormCtrl",
        "createItemFormCtrl",
        "insertOptionsForm",
        "layoutFormCtrl",
        "userManagerFormCtrl",
        "newUserFormCtrl",
        "imageGalleryFormCtrl",
        ],
function (application, CONST, CreateTemplateFormCtrl, CreateItemFormCtrl, InsertOptionsForm, LayoutFormCtrl, UserManagerFormCtrl, NewUserFormCtrl, ImageGalleryFormCtrl) {

  return function ($scope) {

    var self;
    var currentCtrl;
    var dataCtrl;

    var createTemplateFormCtrl;
    var createItemFormCtrl;
    var insertOptionsForm;
    var layoutFormCtrl;
    var userManagerFormCtrl;
    var newUserFormCtrl;
    var imageGalleryFormCtrl;

    var FormType = {
      CREATE_TEMPLATE: {
        getControl: function() { return createTemplateFormCtrl; }
      },
      CREATE_ITEM: {
        form_id: "createItemForm",
        form_path: "/SiteEngine/Client/Views/forms/createItemForm/createItemForm.html",
        formCtrl: new CreateItemFormCtrl($scope),
      },
      INSERT_OPTIONS: {
        form_path: "/SiteEngine/Client/Views/forms/insertOptionsForm/insertOptionsForm.html",
        formCtrl: new InsertOptionsForm($scope),
      },
      LAYOUT: {
        form_path: "/SiteEngine/Client/Views/forms/layoutForm/layoutForm.html",
        formCtrl: new LayoutFormCtrl($scope),
      },
      USER_MANAGER: {
        form_path: "/SiteEngine/Client/Views/forms/userManagerForm/userManagerForm.html",
        formCtrl: new UserManagerFormCtrl($scope),
        isButtonsFormHide: true,
      },
      NEW_USER: {
        form_path: "/SiteEngine/Client/Views/forms/newUserForm/newUserForm.html",
        formCtrl: new NewUserFormCtrl($scope),
      },

      IMAGE_GALLERY: {
        form_path: "/SiteEngine/Client/Views/forms/imageGalleryForm/imageGalleryForm.html",
        formCtrl: new ImageGalleryFormCtrl($scope),
      },

      UNKNOWN_FORM: {
        form_path: "/SiteEngine/Client/Views/forms/unknownForm/unknownForm.html",
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

        $scope.loadFinishedFormCtrl = self.loadFinishedFormCtrl;
        $scope.loadModalForm = self.loadModalForm;

        self.initialize();

        application.addUIComponent("modalFormCtrl", self);
      },

      initialize: function () {
        $scope.isError = false;
        $scope.errorMessage = "unknown error";
      },

      loadFormControls: function() {
        createTemplateFormCtrl = new CreateTemplateFormCtrl($scope);
      },

      intervalUI: function (uiData) {
        if (uiData && uiData.keyDownEventLast) {
          var event = uiData.keyDownEventLast;
          var isProcessed = false;
          //var innerCtrl;
          //if (self.curType)
          //  innerCtrl = self.curType.formCtrl;
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

      loadModalForm: function () {
        $(formSelector).find(".dvContentForm").draggable();
        //$(formSelector).find(".dvContentForm").resizable();
      },

      loadFinishedFormCtrl: function () {
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

        $scope.formPath = currentCtrl.getFormPath();
        try {
          $scope.$apply();
        } catch (ex) { }

        if (isCtrlLoaded)
          self.showControl(data);
      },

      showControl: function () {
        $scope.isShowModalForm = true;        
        try {
          $scope.$apply();
        } catch (ex) { }

        if (currentCtrl) {
          var $buttonsFormElem = $(formSelector).find(buttonsFormSelector);
          (currentCtrl.IsButtonsFormHide && currentCtrl.IsButtonsFormHide()) ? $buttonsFormElem.hide() : $buttonsFormElem.show();

          if (currentCtrl.show)
            currentCtrl.show(dataForm);
        }

        // yvy: it's not needed now
        //var $form = $(formSelector);
        //var $dvContentForm = $form.find(".dvContentForm");
        //var $dvButtonsForm = $form.find(".dvButtonsForm");
        //var $dvIncludePart = $form.find(".dvIncludePart");
        //$dvContentForm.height($dvButtonsForm[0].offsetHeight + $dvIncludePart[0].offsetHeight);
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