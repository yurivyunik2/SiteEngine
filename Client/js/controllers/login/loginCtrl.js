require.config({
  paths: {
    loginCSS: "js/controllers/login/login",
  },
});

define(["application", "CONST", "Utils", "css!loginCSS"], function (application, CONST, Utils) {

  return function ($scope, $http, $window) {

    var self;

    var loginCtrlObj = {
      constructor: function () {
        self = this;

        // loading - turn off
        Utils.setLoadingApplication(false);

        application.initialize($scope, $http, $window);

        $scope.userName = "";
        if ($window.localStorage && $window.localStorage.lastLoginSiteEngine)
          $scope.userName = $window.localStorage.lastLoginSiteEngine;
        
        $scope.userPassword = "";
        $scope.error = "";
        $scope.rememberMe = false;

        $scope.clickLogin = self.clickLogin;
        
        // add to UI components
        application.addUIComponent("loginCtrl", self);
      },
      
      intervalUI: function (uiData) {
        if (!uiData || !uiData.keyDownEventLast)
          return;

        if (uiData.keyDownEventLast.which === CONST.ENTER_KEY()) {
          //console.log("interval");
          //self.clickLogin();          
        }
      },

      clickLogin: function ($event) {
        if (!$scope.userName || !$scope.userPassword) {
          $scope.error = "You need to fill all fields!";
          try {
            $scope.$apply();
          } catch (ex) {
          }          
          return;
        }

        if ($window.localStorage && $scope.rememberMe)
          $window.localStorage.lastLoginSiteEngine = $scope.userName;

        var action = "login";
        var data = {
          action: action,
          user: {
            name: $scope.userName,
            password: $scope.userPassword,
          },
        };

        self.isRequestProcess = true;

        application.httpRequest(data, function success(response) {
          if (!response.error) {
            self.isRequestProcess = false;

            //
            if (response.data && response.data.user && response.data.user.sessionID) {
              var user = response.data.user;
              application.setSession(user.sessionID, user.name, user.password);
              $window.location.href = '#/Views/start';
            } else {
              $scope.error = "User's session doesn't exist!";
            }
          } else {
            if (!response.error || response.error === "")
              $scope.error = "UNKNOWN ERROR";
            else
              $scope.error = response.error;
          }
        }, function error(response, status, headers) {

        });

      },
      
    };
    loginCtrlObj.constructor();
    return loginCtrlObj;
  };

});
