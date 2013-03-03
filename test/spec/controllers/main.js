'use strict';

describe('Controller: MainCtrl', function() {
    // load the controller's module
    beforeEach(module('app'));

    var MainCtrl, scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function($controller) {
        scope = {};
        MainCtrl = $controller('MainCtrl', {$scope: scope});
    }));

    it('should attach a list of awesomeThings to the scope', function() {
        expect(scope.awesomeThings.length).toBe(4);
    });

    it('should attach a user name', function() {
        expect(scope.userName).toBe('bro');
    });
});
