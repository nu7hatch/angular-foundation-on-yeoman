'use strict';

// Routing configuration.
app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    // Enable pushState in routes.
    $locationProvider.html5Mode(true).hashPrefix('');

    // Your application routes goes here.
    $routeProvider
        .when('/', {
            templateUrl: 'views/main.html',
            controller: 'MainCtrl',
            title: 'Hello Stranger!'
        })
        .otherwise({
            redirectTo: '/'
        });
}]);
