'use strict';
/*eslint consistent-this:[0] */
var angular = require('angular-mocks');
var app = require('../')('main');
var servicename = 'track';
describe(app.name, function() {

    describe('Services', function() {

        describe(servicename, function() {

            beforeEach(function() {
                angular.mock.module(app.name);
            });

            beforeEach(angular.mock.module([app.name + '.' + servicename + 'Provider', function(serviceNameProvider) {
                // Configure the provider
                serviceNameProvider.init();
            }]));

            beforeEach(inject(function($injector) {
                this.service = $injector.get(app.name + '.' + servicename);
            }));

            it('should be defined', function() {
                expect(this.service).toBeDefined();
            });

            it('should be function', function() {
                expect(typeof this.service).toBe('function');
            });

        });
    });
});