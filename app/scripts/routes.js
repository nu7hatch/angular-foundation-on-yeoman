'use strict';

// Routing configuration.
app.config(function($routeProvider, $locationProvider) {
    // Enable pushState in routes.
    $locationProvider.html5Mode(true).hashPrefix('');

    // Your application routes goes here.
    $routeProvider
        .when('/', {
            templates: { main: 'views/main.html' },
            title: 'Hello Stranger!'
        })
        .otherwise({
            redirectTo: '/'
        });
}).$inject = ['$routeProvider', '$locationProvider'];
