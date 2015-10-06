// deckController.js
(function(){
  var app = angular.module('deckController', ['deckService']);

  app.controller('deckCtrl', ['$scope','deckSrvc', function($scope, deckService){
    $scope.deck = deckService.getDeck();
    $scope.select = function(CID, question){
      if(question){
        for(var i in $scope.deck.cards){
          $scope.deck.cards[i].qSelected = 0;
        }
        $scope.deck.cards[CID].qSelected = 1;
      }else{
        for(var i in $scope.deck.cards){
          $scope.deck.cards[i].aSelected = 0;
        }
        $scope.deck.cards[CID].aSelected = 1;
      }

      if($scope.deck.cards[CID].aSelected && $scope.deck.cards[CID].qSelected) console.log('match');
      else console.log('nonmatch');

    }


  }]);

})();