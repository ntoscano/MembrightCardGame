'use strict';
var constantname = 'lodash';
var _ = require('lodash');
module.exports = function(app) {
    app.constant(app.name + '.' + constantname, _);
};