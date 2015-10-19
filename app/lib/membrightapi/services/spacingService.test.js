'use strict';
/*eslint consistent-this:[0] */
var angular = require('angular-mocks');
var app = require('../')('main');
var servicename = 'spacingService';
describe(app.name, function() {

    describe('Services', function() {

        describe(servicename, function() {
            var moment, now;

            beforeEach(function() {
                angular.mock.module(app.name);
            });

            beforeEach(inject(['$injector', 'main.ngLib.moment', function($injector, _moment_) {
                this.service = $injector.get(app.name + '.' + servicename);
                moment = _moment_;
                now = moment.utc();
            }]));

            it('should be defined', function() {
                expect(this.service).toBeDefined();
            });

            it('should return now for new cards', function () {
                expect(this.service.getNextReviewDate(now, null, {}, {}).diff(now)).toBe(0);
            });

            it('should have a predictable curve', function () {
                var i = 0; var last = 1; var sum = 0;
                while(i++ < 15) {
                    var deltaH = this.service._getBaseTargetDeltaHours(i, 0.7);
                    sum += deltaH;
                    //dump(i, Math.floor(deltaH), Math.floor(deltaH / 24), Math.floor(100 * ((deltaH - last) / last)) + '%', Math.floor(sum/24), Math.floor(100*deltaH/sum) + '%');
                    last = deltaH;
                }
            });

            it('strength gain of 1 near target review date', function () {
                var i = 0;
                var reviewBy = moment.utc(now);
                var lastReview = moment.utc(now).subtract(1, 'h');
                var strength = 0;
                while(i++ < 15) {

                    var deltaS = this.service._getPotentialStrengthGain(now, lastReview, strength);
                    strength += deltaS;

                    var deltaH = this.service._getBaseTargetDeltaHours(strength);
                    lastReview = moment.utc(now);
                    now.add(deltaH, 'h');
                    reviewBy.add(deltaH, 'h');

                    expect(strength).toBeCloseTo(i, 1);
                }
            });

            it('strength gain < 1 when cramming', function () {
                var i = 0;
                var reviewBy = moment.utc(now);
                var lastReview = moment.utc(now).subtract(1, 'h');
                var strength = 0;
                var start = moment.utc();
                while(i++ < 15) {

                    var deltaS = this.service._getPotentialStrengthGain(now, lastReview, strength);
                    strength += deltaS;

                    var deltaH = this.service._getBaseTargetDeltaHours(strength);
                    reviewBy.add(deltaH, 'h');
                    //dump(i, strength, deltaS, deltaH / 24, now.diff(lastReview, 'd'), now.diff(start, 'd'));

                    lastReview = moment.utc(now);
                    now.add(deltaH / 4, 'h');

                    if (i > 1) { expect(deltaS).toBeLessThan(.3); }
                }
            });

            it('strength gain > 1 when behind', function () {
                var i = 0;
                var reviewBy = moment.utc(now);
                var lastReview = moment.utc(now).subtract(1, 'h');
                var strength = 0;
                var start = moment.utc();
                while(i++ < 15) {

                    var deltaS = this.service._getPotentialStrengthGain(now, lastReview, strength);
                    strength += deltaS;

                    var deltaH = this.service._getBaseTargetDeltaHours(strength);
                    reviewBy.add(deltaH, 'h');
                    //dump(i, strength, deltaS, deltaH / 24, now.diff(lastReview, 'd'), now.diff(start, 'd'));

                    lastReview = moment.utc(now);
                    now.add(deltaH * 2, 'h');

                    if (i > 1) {
                        expect(deltaS).toBeGreaterThan(1);
                        expect(deltaS).toBeLessThan(2.1);
                    }
                }
            });

            it('smooth getNextReviewDate', function () {
                var i = 0;
                var reviewBy = moment.utc(now);
                var lastReview;
                var strength = 0;
                var start = moment.utc();

                var currentData = {};
                var lifetimeData = {};

                while(i++ < 15) {

                    var nextDate = this.service.getNextReviewDate(now, lastReview, currentData, lifetimeData);
                    expect(currentData.strength).toBeCloseTo(i - 1);

                    //dump(currentData);
                    //dump(lifetimeData);
                    //dump(nextDate.format());
                    //dump(nextDate.diff(start, 'h'), 'h', nextDate.diff(start, 'd'), 'd'); // 0, 1, 1, 1, 1, 2, 2, 2, 2

                    lastReview = now;
                    now = nextDate;
                }
            });

            it('relearning getNextReviewDate', function () {
                var i = 0;
                var reviewBy = moment.utc(now);
                var lastReview = moment.utc(now);
                var strength = 0;
                var start = moment.utc();

                var currentData = {strength: 0};
                var lifetimeData = {strength: 12};

                while(i++ < 15) {

                    var nextDate = this.service.getNextReviewDate(now, lastReview, currentData, lifetimeData);
                    //expect(currentData.strength).toBeCloseTo(i - 1);

                    //dump(currentData);
                    //dump(lifetimeData);
                    //dump(nextDate.format());
                    //dump(nextDate.diff(start, 'h'), 'h', nextDate.diff(start, 'd'), 'd');

                    lastReview = now;
                    now = nextDate;
                }
            });

        });
    });
});