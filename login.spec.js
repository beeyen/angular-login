define(['modules/login/login'], function() {
    'use strict';

    describe('login module', function() {
        var state, $state, $rootScope, $injector, authServiceMock;

        beforeEach(function() {
            module('ui.router');
            module('dl.login', function($provide) {
                $provide.value('authService', authServiceMock = {
                    previousState: null,
                    login: function(credentials) {
                        return true;
                    },
                    logout: function() {
                        return true;
                    },
                    isAuthenticated: function() {
                        return true;
                    }
                });
            });
        });

        beforeEach(inject(function(_$rootScope_, $controller, _$injector_) {
            $rootScope = _$rootScope_;
            $injector = _$injector_;
            $state = $injector.get('$state');
        }));

        it('expect login controller should exist', inject(function($rootScope, $controller) {
            expect($controller).toBeDefined();
        }));

        it('expect login state resolve to login URL', function() {
            state = 'login';
            expect($state.href(state)).toEqual('#/login');
        });

        it('expect logout state resolve to login URL', function() {
            state = 'logout';
            expect($state.href(state)).toEqual('#/login');
        });

        it('expect logout state resolve in autherService.logout', function() {
            state = 'logout';
            var config = $state.get(state);
            authServiceMock.logout = jasmine.createSpy('logout').andReturn('logout');
            $injector.invoke(config.resolve.logout);
            expect(authServiceMock.logout).toHaveBeenCalled();
        });
    });
});