'use strict';

angular.module('app').run([
    '$rootScope', '$window', '$log', 'i18n', function ($rootScope, $window, $log, i18n) {
        // Configure callbacks for routing changes.
        $rootScope.$on('$routeChangeSuccess', function(ev, current) {
            $rootScope.windowTitle = current.$$route.title;
            $log.info('Page title set to "' + $rootScope.windowTitle + '"');
        });
    
        // Other application initializers goes here...
    }
]);