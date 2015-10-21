'use strict';
var servicename = 'fb';

module.exports = function(app) {

    var dependencies = ['$window'];

    function service($window) {
        var get = function() {
            return $window.FB;
        };

        return {
            get: get
        };

    }
    service.$inject = dependencies;
    app.factory(app.name + '.' + servicename, service);
};
