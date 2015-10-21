'use strict';
var filtername = 'fromNow';

module.exports = function(app) {

    var deps = ['main.ngLib.moment'];

    function filter(moment) {
        return function(item) {
            return (item && item.fromNow) ? item.fromNow() : moment.utc(item).fromNow();
        };
    }

    filter.$inject = deps;
    app.filter(filtername, filter);
};

