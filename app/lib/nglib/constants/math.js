'use strict';
var constantname = 'math';
module.exports = function(app) {
    app.constant(app.name + '.' + constantname, window.Math);
};
