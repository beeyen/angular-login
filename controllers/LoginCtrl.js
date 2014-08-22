/*
    LoginCtrl.js
    Encapsulate the login API call.
    * If user already been authenticated, logout before calling login in again
    * If login success, broadcast login success event
    * If login fail, broadcast login fail event
    * Login success handler, send user to home/dashboard page
    * Login fail hander, set showError ("Invalid username/password") to true
*/
define(['config'], function(config) {
    'use strict';

    // LoginCtrl
    var LoginCtrl = ['$scope', '$rootScope', '$state', 'authService',
        function($scope, $rootScope, $state, authService) {
            var p,
                EVENTS = config['events'],
                AUTH_EVENTS = EVENTS.authEvents;
            $scope.showError = false;
            $scope.rememberme = false;
            $scope.credentials = {
                username: '552188836',
                password: 'NO-PASSWD'
            };

            function loginSuccess() {
                if (authService.previousState) {
                    $state.go(authService.previousState);
                } else {
                    $state.go('home');
                }
            }

            function logoutSuccess() {
                authService.previousState = $state.$current.name;
                $state.go('login');
            }

            function loginFailed() {
                $scope.showError = true;
            }
            // subscribe to login failed event
            $rootScope.$on(AUTH_EVENTS.notAuthenticated, loginFailed);
            // subscribe to login failed event
            $rootScope.$on(AUTH_EVENTS.loginFailed, loginFailed);
            // subscribe to login success event
            $rootScope.$on(AUTH_EVENTS.loginSuccess, loginSuccess);
            // subscribe to logout success event
            $rootScope.$on(AUTH_EVENTS.logoutSuccess, logoutSuccess);

            $scope.resetForm = function() {
                $scope.showError = false;
            };

            $scope.login = function(credentials, isValid) {
                if (isValid) {
                    $scope.credentials = credentials;
                    if (authService.isAuthenticated()) {
                        // logout and relogin
                        authService.logout();
                    }
                    p = authService.login($scope.credentials);
                    if (p) {
                        p.then(function() {
                            $rootScope.$emit(AUTH_EVENTS.loginSuccess);
                        }, function() {
                            $rootScope.$emit(AUTH_EVENTS.loginFailed);
                        });
                    } else {
                        $rootScope.$emit(EVENTS.serverError);
                    }
                } else {
                    $scope.resetForm();
                }
            };
        }
    ];
    return LoginCtrl;
});