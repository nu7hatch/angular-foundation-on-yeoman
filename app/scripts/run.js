'use strict';

app.run(function($rootScope, $log) {
    // Configure callbacks for routing changes.
    $rootScope.$on('$routeChangeSuccess', function(ev, current) {
        $rootScope.windowTitle = current.$route.title;
        $log.info('Page title set to "' + $rootScope.windowTitle + '"');
    });
    
    // Other application initializers goes here...
}).$inject = ['$rootScope', '$log'];
