'use strict';
define(function(require, exports, module){
  module.exports = function(app) {
      // inject:start
      require(['./config'], function(config){
        config(app)
      });
      // inject:end
  };
});