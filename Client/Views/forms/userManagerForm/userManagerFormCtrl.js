define(["application", "CONST", "CommonTypes"], function (application, CONST, CommonTypes) {

  return function ($scope) {

    var self;
    var tbUserSelector = "#tbUsers";
    var userTemplateSelector = "#userTemplate";

    var $userManagerFormElem;
    var $tbUserElem;

    var userManagerObj = new CommonTypes.BaseFormElement();
    _.extend(userManagerObj, {
      constructor: function () {
        self = this;
        self.setBaseData({
          formTitle: "List Users",
          formPath: "/SiteEngine/Client/Views/forms/userManagerForm/userManagerForm.html",
          isButtonsFormHide: true,
        });

        $scope.newUserClick = self.newUserClick;
        $scope.editUserClick = self.editUserClick;
        $scope.removeUserClick = self.removeUserClick;


        application.addUIComponent("userManagerFormCtrl" + Date.now(), self);

        application.addUserManager(self);
      },

      IsButtonsFormHide: function () { return true; },

      update: function () {
        self.populate();
      },

      populate: function () {
        if ($tbUserElem) {
          var userList = application.getUsers();
          $tbUserElem.html("");

          // header
          var $userHeaderElem = $("#userHeaderTemplate");
          if ($userHeaderElem && $userHeaderElem.length > 0) {
            //var userTemplate = _.template($userHeaderElem.html());
            $tbUserElem.append($userHeaderElem.html());
          }
          //
          _.each(userList, function (user) {
            self.addUserRender($tbUserElem, user);
          });

          $tbUserElem.find("tr").click(self.rowClickEvent);
        }
      },

      show: function () {
        if (self.panelForm && self.panelForm.get$el()) {
          var $panel = self.panelForm.get$el();
          var $btnNewUser = $panel.find("#btnNewUser");
          $btnNewUser.click(self.newUserClick);
          var $btnEditUser = $panel.find("#btnEditUser");
          $btnEditUser.click(self.editUserClick);
          var $btnRemoveUser = $panel.find("#btnRemoveUser");
          $btnRemoveUser.click(self.removeUserClick);

          $userManagerFormElem = $panel.find(".userManagerForm");
          $tbUserElem = $userManagerFormElem.find(tbUserSelector);

          self.populate();
        }
      },

      intervalUI: function () {
        if ($userManagerFormElem && $userManagerFormElem.is(":visible")) {
          var $btnEditElem = $userManagerFormElem.find("#btnEdit");
          var $btnRemoveElem = $userManagerFormElem.find("#btnRemove");
          var $selectedElem = $tbUserElem.find(".selected");
          if ($selectedElem.length > 0) {
            $btnEditElem.removeAttr("disabled");
            $btnRemoveElem.removeAttr("disabled");
          } else {
            $btnEditElem.attr("disabled", "true");
            $btnRemoveElem.attr("disabled", "true");
          }
        }
      },

      rowClickEvent: function (event) {
        $tbUserElem.find(".selected").removeClass("selected");
        $(event.currentTarget).addClass("selected");
      },

      newUserClick: function ($event) {
        var modalFormCtrl = application.getModalFormCtrl();
        modalFormCtrl.setType(modalFormCtrl.FORM_TYPE().NEW_USER, {});
      },

      editUserClick: function ($event) {
        var $selectedElem = $tbUserElem.find(".selected");
        if ($selectedElem.attr("id")) {
          var users = application.getUsers();
          var idSel = $selectedElem.attr("id");
          var userSelected = _.findWhere(users, { id: parseInt(idSel) });
          if (userSelected) {
            var modalFormCtrl = application.getModalFormCtrl();
            modalFormCtrl.setType(modalFormCtrl.FORM_TYPE().NEW_USER, { user: userSelected });
          }
        }
      },

      removeUserClick: function ($event) {
        var $selectedElem = $tbUserElem.find(".selected");
        if ($selectedElem.attr("id")) {
          application.removeUser({ id: $selectedElem.attr("id") });
        }
      },

      addUserRender: function ($tbUserElem, user) {
        if (!$tbUserElem || !user)
          return;

        var $userTemplateElem = $(userTemplateSelector);
        if ($userTemplateElem && $userTemplateElem.length > 0) {
          var userTemplate = _.template($userTemplateElem.html());
          $tbUserElem.append(userTemplate({ user: user }));
        }
      },

      //clickOK: function (dataRequest) {

      //},      
    });
    userManagerObj.constructor();
    return userManagerObj;

  };


});