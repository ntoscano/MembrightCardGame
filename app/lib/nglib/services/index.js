'use strict';


module.exports = function(app) {
    // inject:start
    require('./facebookConnectPlugin')(app);
    require('./fb')(app);
    // inject:end
};


