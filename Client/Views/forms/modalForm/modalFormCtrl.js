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
    
    var FormType = {
      CREATE_TEMPLATE: {
        form_id: "createTemplateForm",
        form_path: "/SiteEngine/Client/Views/forms/createTemplateForm/createTemplateForm.html",
        form_ctrl: new CreateTemplateFormCtrl($scope),
      },
      CREATE_ITEM: {
        form_id: "createItemForm",
        form_path: "/SiteEngine/Client/Views/forms/createItemForm/createItemForm.html",
        form_ctrl: new CreateItemFormCtrl($scope),
      },
      INSERT_OPTIONS: {
        form_path: "/SiteEngine/Client/Views/forms/insertOptionsForm/insertOptionsForm.html",
        form_ctrl: new InsertOptionsForm($scope),
      },
      LAYOUT: {
        form_path: "/SiteEngine/Client/Views/forms/layoutForm/layoutForm.html",
        form_ctrl: new LayoutFormCtrl($scope),
      },
      USER_MANAGER: {
        form_path: "/SiteEngine/Client/Views/forms/userManagerForm/userManagerForm.html",
        form_ctrl: new UserManagerFormCtrl($scope),
        isButtonsFormHide: true,
      },
      NEW_USER: {
        form_path: "/SiteEngine/Client/Views/forms/newUserForm/newUserForm.html",
        form_ctrl: new NewUserFormCtrl($scope),
      },

      IMAGE_GALLERY: {
        form_path: "/SiteEngine/Client/Views/forms/imageGalleryForm/imageGalleryForm.html",
        form_ctrl: new ImageGalleryFormCtrl($scope),
      },

      UNKNOWN_FORM: {
        form_path: "/SiteEngine/Client/Views/forms/unknownForm/unknownForm.html",
      },
    };

    var self;

    var isLoadDivInclude = false;
    var dataForm;
    var formSelector = "#modalFormPanel";
    var buttonsFormSelector = ".dvButtonsForm";

    var modalFormCtrl = {

      curType: null,

      constructor: function () {
        self = this;
        $scope.clickOk = this.clickOk;
        $scope.clickCancel = this.clickCancel;

        $scope.loadDivInclude = self.loadDivInclude;
        $scope.loadModalForm = self.loadModalForm;

        application.addUIComponent("modalFormCtrl", self);
      },

      get$Elem: function () {
        return $(formSelector);
      },

      initialize: function () {
        $scope.isError = false;
        $scope.errorMessage = "unknown error";
      },

      FORM_TYPE: function() { return FormType; },

      intervalUI: function (uiData) {
        if (uiData && uiData.keyDownEventLast) {
          var event = uiData.keyDownEventLast;
          var isProcessed = false;
          var innerCtrl;
          if (self.curType)
            innerCtrl = self.curType.form_ctrl;
          if (innerCtrl && innerCtrl.keyDownEventFunc) {
            isProcessed = innerCtrl.keyDownEventFunc(event);
          }
          if (!isProcessed) {
            if (event && event.which == CONST.ENTER_KEY()) {
              self.clickOk();
            }
          }
        }
      },

      loadModalForm: function () {

        //$("body").append($("#modalFormTemplate").html());
        
        $(formSelector).find(".dvContentForm").draggable();
        //$(formSelector).find(".dvContentForm").resizable();
      },

      loadDivInclude: function () {
        isLoadDivInclude = true;
        self.showAfterLoad();
        
        if (self.curType && self.curType.form_id) {
          var $formElem = $(formSelector).find("#" + self.curType.form_id);
          var stMinWidth = $formElem.css("min-width");
          var minWidth = parseInt(stMinWidth);
          minWidth += $formElem[0].offsetLeft * 2;
          $(formSelector).find(".dvContentForm").css("min-width", minWidth + "px");
        }
      },

      showType: function (formType, data) {
        self.curType = formType;
        if (self.curType && self.curType.form_ctrl) {
          self.curType.form_ctrl.modalForm = self;
        }
        self.dataForm = data;
        self.show(data);
      },

      show: function (data) {
        dataForm = data;

        //
        self.initialize();

        if (self.curType) {
          $scope.form_path = this.curType.form_path;          
        }
        else
          $scope.form_path = FormType.UNKNOWN_FORM.form_path;

        if (isLoadDivInclude) {
          self.showAfterLoad();
        } else {
          if (self.curType) {
            var $buttonsFormElem = $(formSelector).find(buttonsFormSelector);
            (self.curType.isButtonsFormHide) ? $buttonsFormElem.hide() : $buttonsFormElem.show();
             
            if (self.curType.form_ctrl && self.curType.form_ctrl.show)
              self.curType.form_ctrl.show(dataForm);
          }
        }

        $scope.$apply();
      },

      showAfterLoad: function () {
        $scope.isShowModalForm = true;        
        $scope.$apply();

        if (self.curType) {
          var $buttonsFormElem = $(formSelector).find(buttonsFormSelector);
          (self.curType.isButtonsFormHide) ? $buttonsFormElem.hide() : $buttonsFormElem.show();

          if (self.curType.form_ctrl && self.curType.form_ctrl.show)
            self.curType.form_ctrl.show(dataForm);
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
        if (self.curType && self.curType.form_ctrl) {
          var form_ctrl = self.curType.form_ctrl;
          if (form_ctrl.isValidate) {
            var error = { message: "" };
            var isValidate = form_ctrl.isValidate(error);
            if (!isValidate) {
              if (error.message && error.message != "")
                $scope.errorMessage = error.message;
              else
                $scope.errorMessage = "Unknown error";
              $scope.isError = true;
              $scope.$apply();
              return;
            }
          }

          self.curType.form_ctrl.clickOK(self.dataForm, self.clickOkCallback);
        } else {
          self.curType = null;
          self.show();
        }
      },
      clickOkCallback: function() {
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