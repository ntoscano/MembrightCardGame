'use strict';
module.exports = function(app) {
    // inject:start
    require('./config')(app);
    // inject:end
};
