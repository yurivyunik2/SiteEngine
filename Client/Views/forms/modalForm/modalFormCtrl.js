require.config({
  paths: {
    createTemplateFormCtrl: "Views/forms/createTemplateForm/createTemplateFormCtrl",
    createItemFormCtrl: "Views/forms/createItemForm/createItemFormCtrl",
    insertOptionsForm: "Views/forms/insertOptionsForm/insertOptionsForm",
    selectTemplateFormCtrl: "Views/forms/selectTemplateForm/selectTemplateFormCtrl",
    selectTreeItemFormCtrl: "Views/forms/selectTreeItemForm/selectTreeItemFormCtrl",
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
        "selectTreeItemFormCtrl",
        "layoutFormCtrl",
        "userManagerFormCtrl",
        "newUserFormCtrl",
        "imageGalleryFormCtrl",
        "notificationModalFormCtrl"
        ],
function (application, CONST, CreateTemplateFormCtrl, CreateItemFormCtrl, InsertOptionsForm, SelectTemplateFormCtrl, SelectTreeItemFormCtrl, LayoutFormCtrl, UserManagerFormCtrl, NewUserFormCtrl, ImageGalleryFormCtrl, NotificationModalFormCtrl) {

  return function ($scope) {

    var self;
    var $el;
    var currentCtrl;
    var dataCtrl;

    var $dvContentForm;
    var heightContentForm = 0;

    var createTemplateFormCtrl;
    var createItemFormCtrl;
    var insertOptionsForm;
    var selectTemplateFormCtrl;
    var selectTreeItemFormCtrl;
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
      SELECT_TREE_ITEM: {
        getControl: function () { return selectTreeItemFormCtrl; }
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
    var isShowFunction = false;

    var modalFormCtrl = {
      curType: null,
      FORM_TYPE: function () { return FormType; },
      get$el: function () {
        if (!$el || $el.length === 0) {
          $el = $("#modalFormPanel");
        }
        return $el;
      },

      get$parentCtrl: function() {
        return self.get$el().find(".dvCtrlContent");
      },

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

      loadFormControls: function () {
        var $parentContentElem = self.get$parentCtrl();
        createTemplateFormCtrl = new CreateTemplateFormCtrl($scope);
        createItemFormCtrl = new CreateItemFormCtrl($scope);
        insertOptionsForm = new InsertOptionsForm($parentContentElem, $scope);
        selectTemplateFormCtrl = new SelectTemplateFormCtrl($scope);
        selectTreeItemFormCtrl = new SelectTreeItemFormCtrl($scope);
        layoutFormCtrl = new LayoutFormCtrl($parentContentElem, $scope);
        userManagerFormCtrl = new UserManagerFormCtrl($scope);
        newUserFormCtrl = new NewUserFormCtrl($scope, self);
        imageGalleryFormCtrl = new ImageGalleryFormCtrl($scope);
        notificationModalFormCtrl = new NotificationModalFormCtrl($scope);
      },

      intervalUI: function (uiData) {
        if (!uiData || !$scope.isShowModalForm)
          return;

        //var curHeight = $dvContentForm.height();
        //if (curHeight !== heightContentForm) {
        //  heightContentForm = curHeight;
        //  var top = 0;
        //  if (curHeight > window.innerHeight / 2) {
        //    top = window.innerHeight / 2 - curHeight / 2;
        //  } else {
        //    top = 0.3 * window.innerHeight;
        //  }
        //  $dvContentForm.parent().css("top", top + "px");
        //}

        var event;
        if (uiData.keyDownEventLast) {
          event = uiData.keyDownEventLast;
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

        if (uiData.keyUpEventLast) {
          event = uiData.keyUpEventLast;
          if (currentCtrl && currentCtrl.keyUpEventFunc) {
            currentCtrl.keyUpEventFunc(event);
          }
        }

        if (uiData.mouseDownEventLast) {
          event = uiData.mouseDownEventLast;
          if (currentCtrl && currentCtrl.keyDownEventFunc) {
            currentCtrl.mouseDownEventFunc(event);
          }
        }

      },

      loadFormFinished: function () {
        //self.get$el().find(".dvContentForm").draggable();
        //self.get$el().find(".dvHeaderForm").draggable();        
        //self.get$el().find(".dvContentForm").resizable();
        $dvContentForm = self.get$el().find(".dvContentForm");
      },

      loadFormCtrlFinished: function () {
        isCtrlLoaded = true;
        if (!isShowFunction)
          self.showControl(dataCtrl);
        
      },

      setType: function (formType, data) {
        if (!formType || !formType.getControl())
          return;
        //
        self.initialize();

        dataCtrl = data;
        if (currentCtrl !== formType.getControl()) {
          isCtrlLoaded = false;
          data.isEventsSubscribe = true;
        } else {
          data.isEventsSubscribe = false;
        }
        currentCtrl = formType.getControl();
        self.show(data);
      },

      show: function (data) {
        if (!currentCtrl)
          return;

        isShowFunction = true;
        heightContentForm = 0;

        if (currentCtrl.setDataCtrl)
          currentCtrl.setDataCtrl(data);

        var formTitle = currentCtrl.getFormTitle();
        var spTitle = self.get$el().find(".dvTitle span");
        spTitle.html(formTitle ? formTitle : "");

        var $parentContentElem = self.get$parentCtrl();
        $parentContentElem.html("");

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

        isShowFunction = false;
      },

      showControl: function (data) {
        $scope.isShowModalForm = true;        
        try {
          $scope.$apply();
        } catch (ex) { }

        if (currentCtrl) {
          var $buttonsFormElem = self.get$el().find(".dvButtonsForm");
          (currentCtrl.isButtonsFormHide && currentCtrl.isButtonsFormHide()) ? $buttonsFormElem.hide() : $buttonsFormElem.show();

          if (currentCtrl.show)
            currentCtrl.show(data);

          if (currentCtrl.get$el()) {
            var $formElem = currentCtrl.get$el();
            var stMinWidth = $formElem.css("min-width");
            var minWidth = parseInt(stMinWidth);
            minWidth += $formElem[0].offsetLeft * 2;
            self.get$el().find(".dvContentForm").css("min-width", minWidth + "px");
          }

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

      clickOkCallback: function (dataResponse) {
        if (dataCtrl && dataCtrl.callback)
          dataCtrl.callback(dataResponse);
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