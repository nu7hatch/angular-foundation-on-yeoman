'use strict';

angular.module('homeApp', [])
    .config(function($routeProvider, $locationProvider) {
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
    })
    .run(function($rootScope) {
        // Enable page title binding with the routing options.
        $rootScope.$on('$routeChangeSuccess', function(ev, current) {
            $rootScope.windowTitle = current.$route.title;
        });
    });
