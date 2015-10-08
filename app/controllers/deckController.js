// deckController.js
(function(){
  var app = angular.module('deckController', ['deckService']);

  app.controller('deckCtrl', ['$scope','deckSrvc', function($scope, deckService){
    $scope.deck = deckService.getDeck();
    $scope.matching = false;
    var selectedAnswerID = null;
    var selectedQuestionID = null;

    var _addSelector = function(CID, question){
      if(question){
        if(selectedQuestionID){
          $scope.deck.cards[selectedQuestionID].state = 'hidden';
        }
        $scope.deck.cards[CID].state = 'qSelected';
        selectedQuestionID = CID;        
      }else{
        if(selectedAnswerID){
          $scope.deck.cards[selectedAnswerID].state = 'hidden';
        }
        $scope.deck.cards[CID].state = 'aSelected';
        selectedAnswerID = CID;
      } 
    }

    var _removeSelector = function(){
      if(selectedQuestionID){
        $scope.deck.cards[selectedQuestionID].state = 'hidden';
      }
      if(selectedAnswerID){
        $scope.deck.cards[selectedAnswerID].state = 'hidden';
      }
    }

    $scope.select = function(CID, question){
      if($scope.deck.cards[CID].state !== 'matched'){
        if($scope.matching){
          _addSelector(CID, question);

          if(selectedQuestionID === selectedAnswerID){
            $scope.deck.cards[CID].state = 'matched';
          }else{
            _removeSelector();
          }
          $scope.matching = false;
        }else{
          _addSelector(CID, question);
          $scope.matching = true;
        }
      }
    }


  }]);

})();