'use strict';

app.controller('AppCtrl', function($scope, $rootScope, $route, $log, i18n) {
    var DEFAULT_LAYOUT = 'views/layouts/default.html';

    // Configure layout and templates.
    $rootScope.$on('$routeChangeStart', function(scope, next, current) {
        var route = next.$route;
        
        $rootScope.templates = route.templates || {};
        $rootScope.layout = route.layout || DEFAULT_LAYOUT;

        $log.info('Layout set to "' + $rootScope.layout + '"');
    });
}).$inject = ['$scope', '$rootScope', '$route', '$log', 'i18n'];