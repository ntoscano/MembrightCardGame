'use strict';

// Declare app level module which depends on views, and components
angular.module('MCG', [
  'ngRoute',
  'app-directives',
  'deckController',
  'deckService',
  'ngSanitize'
  ]).config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/view1'});
}]);

