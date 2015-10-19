'use strict';
var servicename = 'spacingService';

define(function(require, exports, module){
    module.exports = function(app) {

        var dependencies = ['main.ngLib.lodash', 'main.ngLib.moment'];

        function service(_, moment) {
            //TODO: move constants to config
            var p = 0.3;
            var order = 3.3;
            var targetGain = 0.3;
            var maxStrengthIncrease = 2;

            /**
             * Updates UserCardStatus data; to be called from process response
             *
             * @param now
             * @param lastReview
             * @param currentData
             * @param lifetimeData
             * @returns {*}
             */
            var getNextReviewDate = function(now, lastReview, currentData, lifetimeData) {
                if (!lastReview) { // new card
                    currentData.strength = 0;
                    lifetimeData.strength = 0;
                    return moment.utc(now);
                }
                var strengthGain, newStrength, reviewDelta;

                strengthGain = getPotentialStrengthGain(now, lastReview, currentData.strength);
                newStrength = currentData.strength + strengthGain;

                if (newStrength >= 2 && lifetimeData.strength > newStrength) { // Relearning
                    newStrength += 1/3 * (lifetimeData.strength - newStrength)
                }
                reviewDelta = getBaseTargetDeltaHours(newStrength);

                // Set Data
                currentData.strength = newStrength;
                lifetimeData.strength = _.max([currentData.strength, lifetimeData.strength]);

                return moment.utc(now).add(reviewDelta, 'h');
            };

            var getBaseTargetDeltaHours = function (strength, targetTrigger) {
                if (_.isUndefined(targetTrigger)) { targetTrigger = 1 - targetGain; }
                var hours = (-1) * Math.pow(strength, order) * Math.log(targetTrigger) / p;
                return hours;
            };

            /**
             * Used to compute increase in strength, using a curve using the current strength,
             * computing the increase
             *
             * @param now
             * @param lastReview
             * @param strength
             * @returns gain {float}
             */
            var getPotentialGain = function (now, lastReview, strength) {
                if (strength === 0) { return targetGain; }

                var t = now.diff(lastReview, 'minutes') / 60; // float, hours
                t = _.max([0.03, t]); //TODO: review this design choice

                var sigma = _.max([0.2, strength]);
                var likely = Math.exp(-1 * p  * t / Math.pow(sigma, order));

                return 1 - likely;
            };

            /**
             * Computes the gain then uses the target gain to scale gain up to a unit of strength.
             *
             * If the review is done at the reviewBy time, the increase in strength should be equal to 1.
             *
             * @param now
             * @param reviewBy
             * @param lastReview
             * @param strength
             * @returns {*}
             */
            var getPotentialStrengthGain = function (now, lastReview, strength) {
                var gain = getPotentialGain(now, lastReview, strength);
                var strengthIncrease = gain / targetGain;
                return _.min([strengthIncrease, maxStrengthIncrease]);
            };

            return {
                getNextReviewDate: getNextReviewDate,
                _getBaseTargetDeltaHours: getBaseTargetDeltaHours,
                _getPotentialGain: getPotentialGain,
                _getPotentialStrengthGain: getPotentialStrengthGain
            };

        }
        service.$inject = dependencies;
        app.factory(app.name + '.' + servicename, service);
    };
});

