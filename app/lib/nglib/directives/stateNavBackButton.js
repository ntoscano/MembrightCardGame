'use strict';
 /*eslint consistent-this:[2,  "stateNavBackButtonCtrl"] */
var directivename = 'stateNavBackButton';

module.exports = function(app) {
    /*eslint-disable consistent-this */

    // directive
    var directiveDeps = ['$ionicHistory', '$ionicViewSwitcher', '$state'];
    var directive = function($ionicHistory, $ionicViewSwitcher, $state) {
        return {
            restrict: 'AE',
            priority: 10,
            compile: function(tElement, tAttrs) {
                tAttrs.$set('ngClick', 'customStateBack()');

                return function(scope) {
                    scope.customStateBack = function() {
                        //TODO: enable some support for back that is not just to the parent state
                        if (false && $ionicHistory.backView()) {
                            $ionicHistory.goBack();
                        } else if (!!$state.$current.parent.navigable) {
                            $ionicHistory.nextViewOptions({
                                disableBack: true,
                                historyRoot: false
                            });
                            $ionicViewSwitcher.nextDirection('back');

                            $state.go('^');
                        }
                    };
                };
            }
        };
    };
    directive.$inject = directiveDeps;

    app.directive(directivename, directive);
};


