'use strict';

app.controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
        'Zurb Foundation',
        'AngularJS',
        'Testacular'
    ];

    $scope.userName = "bro";

    $scope.addThing = function() {
        $scope.awesomeThings.push($scope.thingName);
        $scope.thingName = '';
    };
});