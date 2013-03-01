'use strict';

// Enable page title binding with the routing options.
app.run(['$rootScope', 'i18n', function($rootScope, i18n) {
    $rootScope.$on('$routeChangeSuccess', function(ev, current) {
        $rootScope.windowTitle = current.$route.title;
    });
}]);
