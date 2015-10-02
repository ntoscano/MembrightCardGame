(function(){
  var app = angular.module('app-directives', []);

  app.directive('navbarLink', function(){
    return{
      restrict: 'E',
      scope: {
        //stuff goes here
      },
      templateUrl: "app/views/navbar.html",
      compile: function(tElement, tAttrs, transclude){
        return{
          pre : function (scope, iElement, iAttrs){
          },
          post: function (scope, iElement, iAttrs){
            //stuff goes here
          }
        }
      }
    };
  });

  app.directive('questionContainer', function(){
    return{
      restrict: 'E',
      scope: {
        //stuff goes here
      },
      templateUrl: "app/views/questionContainer.html",
      compile: function(tElement, tAttrs, transclude){
        return{
          pre : function (scope, iElement, iAttrs){
          },
          post: function (scope, iElement, iAttrs){
            //stuff goes here
          }
        }
      }
    };
  });

  app.directive('statsContainer', function(){
    return{
      restrict: 'E',
      scope: {
        //stuff goes here
      },
      templateUrl: "app/views/statsContainer.html",
      compile: function(tElement, tAttrs, transclude){
        return{
          pre : function (scope, iElement, iAttrs){
          },
          post: function (scope, iElement, iAttrs){
            //stuff goes here
          }
        }
      }
    };
  });

  app.directive('answerContainer', function(){
    return{
      restrict: 'E',
      scope: {
        //stuff goes here
      },
      templateUrl: "app/views/answerContainer.html",
      compile: function(tElement, tAttrs, transclude){
        return{
          pre : function (scope, iElement, iAttrs){
          },
          post: function (scope, iElement, iAttrs){
            //stuff goes here
          }
        }
      }
    };
  });

})();