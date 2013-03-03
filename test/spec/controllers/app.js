'use strict';

describe('Controller: AppCtrl', function() {
    beforeEach(module('app'));

    var AppCtrl, scope, i18n;

    beforeEach(inject(function($controller, $rootScope, $route) {
        i18n = {init: jasmine.createSpy()};
        scope = $rootScope.$new();
        AppCtrl = $controller('AppCtrl', {'$scope': scope, 'i18n': i18n});
    }));

    it('should initialize i18n module', function() {
        expect(i18n.init).toHaveBeenCalled();
    });
    
    it('should set current templates', function() {
        var mockRouteData = {templates: {main: 'main.html', side: 'side.html'}}
          , nextRoute = {'$route': mockRouteData};

        scope.$emit('$routeChangeStart', nextRoute, undefined);
        expect(scope.templates.main).toBe('main.html');
        expect(scope.templates.side).toBe('side.html');
    });

    it('should set current layout', function() {
        var mockRouteData = {templates: {main: 'main.html'}, layout: 'layout.html'}
          , nextRoute = {'$route': mockRouteData};

        scope.$emit('$routeChangeStart', nextRoute, undefined);
        expect(scope.layout).toBe('layout.html');
    });

    it('should set default layout if route doesn\'t specify one', function() {
        var mockRouteData = {templates: {main: 'main.html'}}
          , nextRoute = {'$route': mockRouteData};

        scope.$emit('$routeChangeStart', nextRoute, undefined);
        expect(scope.layout).toBe('views/layouts/default.html');
    });
});
