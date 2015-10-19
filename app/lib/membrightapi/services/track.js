'use strict';
var servicename = 'track';
define(function(require, exports, module){
    module.exports = function(app) {

        var dependencies = [];

        function service() {
            var isInitialized = false;
            var init = function() {
                isInitialized = true;
            };
            return {
                // initialization
                init: init,

                $get: ['main.ngLib.jQuery', 'main.ngLib.lodash',
                    function($, _) {
                        return function (event, properties, redirect) {
                            var url;
                            if (!_.isObject(properties)) { properties = {}; }
                            properties.event = event;
                            if (typeof redirect == 'string') {
                                properties.redirect = redirect;
                                url = '/stats/track?' + $.param(properties);
                                top.location.assign(url);
                            } else {
                                url = '/stats/track?' + $.param(properties);
                                $.get(url);
                            }
                        };
                    }
                ]
            };

        }
        service.$inject = dependencies;

        app.provider(app.name + '.' + servicename, service);
    };
});

