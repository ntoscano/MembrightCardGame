'use strict';

var modulename = 'ngLib';

module.exports = function(namespace) {

    var fullname = namespace + '.' + modulename;


    var app = angular.module(fullname, ['ionic']);
    // inject:folders start
    require('./constants')(app);
    require('./directives')(app);
    require('./filters')(app);
    require('./services')(app);
    // inject:folders end

    return app;
};
