'use strict';


module.exports = function(app) {
    // inject:start
    require('./jQuery')(app);
    require('./lodash')(app);
    require('./math')(app);
    require('./moment')(app);
    // inject:end
};

