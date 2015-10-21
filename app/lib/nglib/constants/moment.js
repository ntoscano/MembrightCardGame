'use strict';
var constantname = 'moment';
var moment = require('moment');

module.exports = function(app) {
    app.constant(app.name + '.' + constantname, moment);
};
