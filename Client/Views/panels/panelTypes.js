require.config({
  paths: {
    userManagerFormCtrl: "/SiteEngine/Client/Views/forms/userManagerForm/userManagerFormCtrl",
  },
});

define(["application", "CONST",
        "userManagerFormCtrl",
       ],
function (application, CONST, UserManagerFormCtrl) {

  return function ($scope) {

    return {
      USER_MANAGER: {
        path: "/SiteEngine/Client/Views/forms/userManagerForm/userManagerForm.html",
        ctrl: new UserManagerFormCtrl($scope),
        isButtonsFormHide: true,
      },
      UNKNOWN_FORM: {
        path: "/SiteEngine/Client/Views/forms/unknownForm/unknownForm.html",
      },      
    };
  };

});