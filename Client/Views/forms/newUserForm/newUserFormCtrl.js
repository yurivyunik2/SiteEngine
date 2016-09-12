define(["application", "CONST", "CommonTypes"], function (application, CONST, CommonTypes) {

  return function ($scope, parentModalForm) {

    var self;

    var userEdited;

    var userNameSelector = "#userName";
    var fullNameSelector = "#fullName";
    var roleSelector = "#role";
    var emailSelector = "#email";
    var passwordSelector = "#password";
    var confirmPasswordSelector = "#confirmPassword";
    var commentSelector = "#comment";
    var languageSelector = "#language";

    var newUserFormObj = new CommonTypes.BaseFormElement();
    _.extend(newUserFormObj, {
      modalForm: null,

      constructor: function () {
        self = this;
        self.setBaseData({
          formTitle: "Create New User",
          formPath: "/SiteEngine/Client/Views/forms/newUserForm/newUserForm.html",
        });

        self.modalForm = parentModalForm;
      },

      show: function (data) {
        if (!self.modalForm)
          return;

        userEdited = null;
        if (data && data.user)
          userEdited = data.user;

        self.setUserData();
      },

      setUserData: function () {
        var $modalFormElem = self.modalForm.get$el();

        var $roleSelectElem = $modalFormElem.find(roleSelector).find("select");
        var userRoleList = application.getUserRoles();
        $roleSelectElem.html("");
        if ($roleSelectElem.length > 0 && userRoleList && userRoleList.length > 0) {
          _.each(userRoleList, function (role) {
            $roleSelectElem.append("<option value='" + role.id + "'>" + role.name + "</option>");
          });
          $roleSelectElem.val(userRoleList[0].id);
        }

        if (userEdited) {
          var $userNameElem = $modalFormElem.find(userNameSelector);
          var $input = $userNameElem.find("input");
          $input.val(userEdited.name);

          var $fullNameElem = $modalFormElem.find(fullNameSelector);
          $input = $fullNameElem.find("input");
          $input.val(userEdited.fullName);

          var $roleElem = $modalFormElem.find(roleSelector);
          $input = $roleElem.find("select");
          $input.val(userEdited.role);

          var $emailElem = $modalFormElem.find(emailSelector);
          $input = $emailElem.find("input");
          $input.val(userEdited.email);

          //var $passwordElem = $modalFormElem.find(passwordSelector);
          //$input = $passwordElem.find("input");
          //$input.val(userEdited.password);
          //var $confirmPasswordElem = $modalFormElem.find(confirmPasswordSelector);
          //var $inputConfirm = $confirmPasswordElem.find("input");
          //$inputConfirm.val(userEdited.confirmPassword);

          var $commentElem = $modalFormElem.find(commentSelector);
          $input = $commentElem.find("input");
          $input.val(userEdited.comment);

          var $languageElem = $modalFormElem.find(languageSelector);
          $input = $languageElem.find("input");
          $input.val(userEdited.language);
        } else {
          $modalFormElem.find("input").val("");
        }
      },

      getUserData: function () {
        var newUser = {};

        if (!self.modalForm)
          return newUser;

        var $modalFormElem = self.modalForm.get$el();

        var $userNameElem = $modalFormElem.find(userNameSelector);
        var $input = $userNameElem.find("input");
        newUser.name = $input.val();

        var $fullNameElem = $modalFormElem.find(fullNameSelector);
        $input = $fullNameElem.find("input");
        newUser.fullName = $input.val();

        var $roleElem = $modalFormElem.find(roleSelector);
        $input = $roleElem.find("select");
        newUser.role = $input.val();
        if ($input.find("option:selected"))
          newUser.roleName = $input.find("option:selected").text();

        var $emailElem = $modalFormElem.find(emailSelector);
        $input = $emailElem.find("input");
        newUser.email = $input.val();

        var $passwordElem = $modalFormElem.find(passwordSelector);
        $input = $passwordElem.find("input");
        newUser.password = $input.val();
        var $confirmPasswordElem = $modalFormElem.find(confirmPasswordSelector);
        var $inputConfirm = $confirmPasswordElem.find("input");
        newUser.confirmPassword = $inputConfirm.val();

        var $commentElem = $modalFormElem.find(commentSelector);
        $input = $commentElem.find("input");
        newUser.comment = $input.val();

        var $languageElem = $modalFormElem.find(languageSelector);
        $input = $languageElem.find("input");
        newUser.language = $input.val();

        return newUser;
      },

      isValidate: function (error) {
        if (!self.modalForm)
          return false;

        var newUser = self.getUserData();

        if (!newUser.name || newUser.name === "") {
          error.message = "User name is empty!";
          return false;
        }

        if (!newUser.fullName || newUser.fullName === "") {
          error.message = "Full name is empty!";
          return false;
        }

        if (!newUser.email || newUser.email === "") {
          error.message = "Email is empty!";
          return false;
        }
        var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
        var isEmailCorrect = re.test(newUser.email);
        if (!isEmailCorrect) {
          error.message = "Email isn't correct!";
          return false;
        }


        if (!userEdited && (!newUser.password || newUser.password === "")) {
          error.message = "Password is empty!";
          return false;
        }
        if (newUser.password !== newUser.confirmPassword) {
          error.message = "Password doesn't concur with Confirm password!";
          return false;
        }

        return true;
      },

      clickOK: function (callback) {

        var user = self.getUserData();

        var action;
        if (userEdited) {
          user.id = userEdited.id;
          action = "editUser";
        }
        else {
          action = "newUser";
        }
        var data = {
          action: action,
          user: user,
        };

        application.httpRequest(data, function (response) {          
          if (!response.error) {
            if (response.data && response.data.user) {
              if (response.data.action === "newUser")
                application.newUser(response.data.user);
              else {
                application.updateUser(response.data.user);
              }
            }
          }
          if (callback)
            callback();
        }, function (response, status, headers, config) {
          if (callback)
            callback();
        });

      },
    });
    newUserFormObj.constructor();
    return newUserFormObj;

  };
});