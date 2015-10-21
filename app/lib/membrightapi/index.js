
var modulename = 'membrightapi';

module.exports = function(namespace) {

  var fullname = namespace + '.' + modulename;
  var app = angular.module(fullname, ['ngResource', 'ui.router', 'ionic', 'main.ngLib', 'ngStorage']);
  // inject:folders start
  require('./constants')(app);
  require('./services')(app);
  require('./values')(app);
  // inject:folders end

  return app;
};
  

