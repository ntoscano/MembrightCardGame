'use strict';


module.exports = function(app) {
    // inject:start
    require('./ionTabs')(app);
    require('./stateNavBackButton')(app);
    // inject:end
};
