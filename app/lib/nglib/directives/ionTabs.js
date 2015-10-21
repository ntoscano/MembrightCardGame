'use strict';
/*eslint consistent-this:[2,  "ionTabsCtrl"] */
var directivename = 'ionTabs';

module.exports = function(app) {
    function getTabRootState(state) {
        var isRootState;

        if (state.parent.self.abstract) {
            isRootState = state.self.name;
        } else {
            isRootState = false;
        }

        return  isRootState || getTabRootState(state.parent);
    }

    function isTabRootState(state) {
        return state.self.name === getTabRootState(state);
    }
    /*eslint-disable consistent-this */

    // directive
    var directiveDeps = ['$rootScope', '$ionicHistory', '$ionicViewSwitcher', '$state'];
    var directive = function($rootScope, $ionicHistory, $ionicViewSwitcher, $state) {
        return {
            restrict: 'E',
            require: 'ionTabs',
            link: function(scope, element, attr, ctrl) {
                var selectTab = ctrl.select;

                ctrl.select = function(tab, shouldEmitEvent) {
                    var selectedTab = ctrl.selectedTab();

                    if (arguments.length === 1) {
                        shouldEmitEvent = !!(tab.navViewName || tab.uiSref);
                    }

                    if (selectedTab && selectedTab.$historyId == tab.$historyId && !isTabRootState($state.$current)) {
                        if (shouldEmitEvent) {
                            $ionicHistory.nextViewOptions({
                                disableBack: true,
                                historyRoot: false
                            });
                            $ionicViewSwitcher.nextDirection('back');
                            $state.go(getTabRootState($state.$current));
                        }
                    } else if (selectedTab && selectedTab.$historyId == tab.$historyId && isTabRootState($state.$current)) {
                        return;
                    } else {
                        selectTab.apply(this, arguments);
                    }
                };
            }
        };
    };
    directive.$inject = directiveDeps;

    app.directive(directivename, directive);
};
