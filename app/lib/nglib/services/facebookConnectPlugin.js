'use strict';
var servicename = 'facebookConnectPlugin';

module.exports = function(app) {

    var dependencies = ['$window'];

    function service($window) {
        var get = function() {
            return $window.facebookConnectPlugin;
        };

        return {
            get: get
        };

    }
    service.$inject = dependencies;
    app.factory(app.name + '.' + servicename, service);
};
