'use strict';

module.exports = function(app) {
    // inject:start
    require('./membrightAuth')(app);
    require('./membrightResources')(app);
    require('./playService')(app);
    require('./resourceHandler')(app);
    require('./spacingService')(app);
    require('./track')(app);
    // inject:end
};
