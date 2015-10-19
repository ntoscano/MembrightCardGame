
var modulename = 'membrightapi';

window.membrightapi = function(namespace) {

    var fullname = namespace + '.' + modulename;
    var app = angular.module(fullname, ['ngResource', 'ui.router', 'ionic', 'main.ngLib', 'ngStorage']);
    // inject:folders start
    require(['./app/lib/membrightapi/constants/index.js'], function(constants){
      constants(app);
    });
    require(['./app/lib/membrightapi/services/index.js'], function(service){
      service(app);
    });
    require(['./app/lib/membrightapi/values/index.js'], function(values){
      values(app);
    });
    // inject:folders end

    return app;
};
  

