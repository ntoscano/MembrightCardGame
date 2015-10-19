'use strict';
/*eslint consistent-this:[0] */
var angular = require('angular-mocks');
var app = require('../')('main');
var servicename = 'membrightResources';
var testData = require('./data.test.js');
describe(app.name, function() {

    describe('Services', function() {

        describe(servicename, function() {
            var $injector, apiConfig;

            beforeEach(function() {
                angular.mock.module(app.name);
            });

            beforeEach(inject(function(_$injector_) {
                $injector = _$injector_;
                apiConfig = $injector.get(app.name + '.config');
                this.service = $injector.get(app.name + '.' + servicename);
            }));

            it('should be defined', function() {
                expect(this.service).toBeDefined();
            });

            describe('setup functions', function () {
                var $httpBackend;

                beforeEach(function () {
                    this.service = $injector.get(app.name + '.' + servicename);
                    $httpBackend = $injector.get('$httpBackend');
                });

                afterEach(function () {
                    $httpBackend.verifyNoOutstandingRequest();
                    $httpBackend.verifyNoOutstandingExpectation();
                });

                it('should load data from server', function () {
                    testData.runSync($injector, $httpBackend, apiConfig);

                    expect(this.service.data).toBeDefined();
                    expect(this.service.data.decks.length).toBe(3);
                    expect(this.service.data.decks[0].id).toBe(180);
                    expect(this.service.data.cardStatusByDeck[180].length).toBe(18);
                });
            });

        });
    });
});