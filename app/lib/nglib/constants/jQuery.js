'use strict';
var constantname = 'jQuery';
var jQuery = require('jquery');

module.exports = function(app) {
    app.constant(app.name + '.' + constantname, jQuery);
};
