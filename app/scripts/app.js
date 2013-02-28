'use strict';

angular.module('homeApp', [])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {templateUrl: 'views/main.html', controller: 'MainCtrl'})
            .otherwise({redirectTo: '/'});
    });
