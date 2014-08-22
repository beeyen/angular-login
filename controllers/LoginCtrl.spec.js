define(['config', 'modules/login/login'], function(config) {
    'use strict';

    describe('login controller', function() {
        var scope,
            LoginCtrl,
            stateMock,
            authServiceMock,
            sessionMock,
            gatewayid,
            $q,
            $rootScope, $injector,
            credentials = {
                username: '552188836',
                password: 'NO-PASSWD'
            };

        beforeEach(function() {
            module('ui.router');
            module('dl.login');
        });

        beforeEach(inject(function(_$rootScope_, $controller, _$injector_, _$q_) {
            $rootScope = _$rootScope_;
            scope = $rootScope.$new();
            $injector = _$injector_;
            $q = _$q_;
            sessionMock = {
                create: function(gatewayGUID) {
                    gatewayid = gatewayGUID;
                    return true;
                },
                destroy: function() {
                    gatewayid = null;
                    return true;
                }
            };
            //a mock auth service object
            authServiceMock = {
                previousState: 'xxx',
                login: function(credentials) {
                    return $q.defer.promise;
                },
                logout: function() {
                    return true;
                },
                isAuthenticated: function() {
                    return true;
                }
            };

            stateMock = {
                get: function() {
                    return [{
                        name: 'login'
                    }, {
                        name: 'login',
                        data: {
                            navigation: {
                                enabled: true,
                                title: 'login',
                                authenticate: false
                            },
                        }
                    }];
                },
                is: function(path) {
                    return true;
                },
                go: function(path) {
                    return true;
                },
                $current: {
                    name: 'login'
                }
            };

            LoginCtrl = $controller('LoginCtrl', {
                $scope: scope,
                authService: authServiceMock,
                $state: stateMock
            });
        }));

        it('should exist', function() {
            expect(LoginCtrl).toBeDefined();
        });

        it('expect default scope attribute to be set correctly', function() {
            expect(scope.showError).toEqual(false);
            expect(scope.credentials).toEqual({
                username: '552188836',
                password: 'NO-PASSWD'
            });
        });

        it('expect showError to be false when form is reset', function() {
            // set showError to true;
            scope.showError = true;
            // call resetForm
            scope.resetForm();
            expect(scope.showError).toEqual(false);
        });

        it('expect login call to success and login success message broadcast', function() {
            // mocking Session
            //sessionMock.create('abc');
            var deferredSuccess = $q.defer();
            var result = {
                authToken: '559f07f28ab448fbc68c6e1',
                requestToken: '1b39ca4a31b7fb3e0d7ca6e080c6efe3',
                gateways: [{
                    id: 'D3CD8C7DD5394CC387C8C5EEAA2440FE'
                }]
            };
            spyOn(authServiceMock, 'login').andReturn(deferredSuccess.promise);
            spyOn(authServiceMock, 'logout').andReturn(true);
            spyOn(authServiceMock, 'isAuthenticated').andReturn(false);
            spyOn($rootScope, '$emit');
            scope.login(credentials, true);
            scope.resetForm();
            spyOn(scope, 'login').andCallThrough();
            deferredSuccess.resolve(result);
            scope.$digest();
            expect(authServiceMock.logout).not.toHaveBeenCalled();
        });

        it('expect login call to fail and login fail message broadcast', function() {
            // mocking Session
            sessionMock.create('abc');
            var deferredSuccess = $q.defer();
            var result = {
                authToken: '559f07f28ab448fbc68c6e1',
                requestToken: '1b39ca4a31b7fb3e0d7ca6e080c6efe3',
                gateways: [{
                    id: 'D3CD8C7DD5394CC387C8C5EEAA2440FE'
                }]
            };
            spyOn(authServiceMock, 'login').andReturn(deferredSuccess.promise);
            spyOn(authServiceMock, 'logout').andReturn(true);

            spyOn($rootScope, '$emit');
            scope.login(credentials, true);
            spyOn(scope, 'login').andCallThrough();
            deferredSuccess.reject();
            scope.$digest();
            expect($rootScope.$emit).toHaveBeenCalledWith(config['events']['authEvents'].loginFailed);
            sessionMock.destroy();
        });

        it('expect login call to fail and login failed message broadcast', function() {
            // mocking Session
            sessionMock.create('abc');
            var deferredSuccess = $q.defer();
            var result = {
                authToken: '559f07f28ab448fbc68c6e1',
                requestToken: '1b39ca4a31b7fb3e0d7ca6e080c6efe3',
                gateways: [{
                    id: 'D3CD8C7DD5394CC387C8C5EEAA2440FE'
                }]
            };
            spyOn(authServiceMock, 'login').andReturn(null);
            spyOn(authServiceMock, 'logout').andReturn(true);

            spyOn($rootScope, '$emit');
            scope.login(credentials, true);
            spyOn(scope, 'login').andCallThrough();
            deferredSuccess.reject();
            scope.$digest();
            expect($rootScope.$emit).toHaveBeenCalledWith(config['events'].serverError);
            sessionMock.destroy();
        });

        it('expect login call to success and login success message broadcast', function() {
            // mocking Session
            sessionMock.create('abc');
            var deferredSuccess = $q.defer();
            var result = {
                authToken: '559f07f28ab448fbc68c6e1',
                requestToken: '1b39ca4a31b7fb3e0d7ca6e080c6efe3',
                gateways: [{
                    id: 'D3CD8C7DD5394CC387C8C5EEAA2440FE'
                }]
            };
            spyOn(authServiceMock, 'login').andReturn(deferredSuccess.promise);
            spyOn(authServiceMock, 'logout').andReturn(true);

            spyOn($rootScope, '$emit');
            scope.login(credentials, true);
            scope.resetForm();
            spyOn(scope, 'login').andCallThrough();
            deferredSuccess.resolve(result);
            scope.$digest();
            expect(authServiceMock.login).toHaveBeenCalled();
            expect(authServiceMock.logout).toHaveBeenCalled();
            expect($rootScope.$emit).toHaveBeenCalledWith(config['events']['authEvents'].loginSuccess);
            sessionMock.destroy();
        });

        it('expect showError to be true when login failed', function() {
            spyOn(scope, '$on');
            scope.$emit('auth-login-failed');
            expect(scope.showError).toBe(true);
        });

        it('expect showError to be false when form is not valid', function() {
            scope.showError = true;
            spyOn(authServiceMock, 'login').andReturn(null);
            scope.login(credentials, false);
            spyOn(scope, 'login').andCallThrough();
            spyOn(scope, 'resetForm').andCallThrough();
            expect(scope.showError).toEqual(false);
        });

        it('expect state to be somestate', function() {
            spyOn(scope, '$on');
            // need to return true!!!! in order for if statement to be true
            spyOn(stateMock, 'go');
            scope.$emit('auth-login-success');
            expect(stateMock.go).toHaveBeenCalledWith(authServiceMock.previousState);
        });

        it('expect state to be home', function() {
            authServiceMock.previousState = null;
            spyOn(scope, '$on');
            spyOn(stateMock, 'go');
            scope.$emit('auth-login-success');
            expect(stateMock.go).toHaveBeenCalledWith('home');
        });

        it('expect state to be login', function() {
            spyOn(scope, '$on');
            spyOn(stateMock, 'go');
            scope.$emit('auth-logout-success');
            expect(stateMock.go).toHaveBeenCalledWith('login');
        });

    });
});