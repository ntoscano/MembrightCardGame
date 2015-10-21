'use strict';

module.exports = function(app) {
    // inject:start
    require('./fromNow')(app);
    require('./htmlToText')(app);
    // inject:end
};
