define(['config', 'angular', 'modules/login/controllers/LoginCtrl'],
    function(config, angular, LoginCtrl) {
        'use strict';
        //login module
        var module = angular.module('dl.login', [])
            .config(['$stateProvider',
                function($stateProvider) {
                    $stateProvider.state('login', {
                        url: '/login',
                        views: {
                            'main': {
                                controller: 'LoginCtrl',
                                templateUrl: 'app/modules/login/login-form.html'
                            }
                        },
                        data: {
                            pageTitle: 'Login',
                            authorizedRoles: [config['userRole'].all],
                            authenticate: false
                        }
                    }).state('logout', {
                        url: '/login',
                        data: {
                            navigation: {
                                enabled: true,
                                title: 'Logout',
                                scope: 'right'
                            },
                            authorizedRoles: [config['userRole'].all],
                            authenticate: false
                        },
                        resolve: {
                            logout: function(authService) {
                                authService.logout();
                            }
                        }

                    });
                }
            ])
            .controller('LoginCtrl', LoginCtrl);

        return module;
    });