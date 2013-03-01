'use strict';

app.controller('AppCtrl', [
    '$scope', '$rootScope', '$route', '$log',
    function($scope, $rootScope, $route, $log) {
        var DEFAULT_LAYOUT = 'views/layouts/default.html';

        // Configure layout and templates.
        $rootScope.$on('$routeChangeStart', function(scope, next, current) {
            var route = next.$route;
            
            $rootScope.templates = route.templates || {};
            $rootScope.layout = route.layout || DEFAULT_LAYOUT;

            $log.info('Layout set to "' + $rootScope.layout + '"');
        });
        
    }]);