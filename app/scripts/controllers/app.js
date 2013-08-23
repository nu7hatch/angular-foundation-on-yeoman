'use strict';

function AppCtrl($scope, $rootScope, $route, $log, i18n) {
    var DEFAULT_LAYOUT = 'views/layouts/default.html';

    // Initialize I18n extension and load a dictionary for current locale.
    i18n.init();
    
    // Configure layout and templates.
    $rootScope.$on('$routeChangeStart', function (scope, next) {
        var route = next.$$route;
        
        $rootScope.templates = route.templates || {};
        $rootScope.layout = route.layout || DEFAULT_LAYOUT;

        $log.info('Layout set to "' + $rootScope.layout + '"');
    });
}

angular.module('app').controller('AppCtrl', ['$scope', '$rootScope', '$route', '$log', 'i18n', AppCtrl]);