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
        if(!selectedQuestionID) selectedQuestionID = CID;
        $scope.deck.cards[selectedQuestionID].qSelected = false;
        $scope.deck.cards[CID].qSelected = true;
        selectedQuestionID = CID;        
      }else{
        if(!selectedAnswerID) selectedAnswerID = CID;
        $scope.deck.cards[selectedAnswerID].aSelected = false;
        $scope.deck.cards[CID].aSelected = true;
        selectedAnswerID = CID;
      } 
    }

    var _removeSelector = function(){
      $scope.deck.cards[selectedQuestionID].qSelected = false;
      $scope.deck.cards[selectedAnswerID].aSelected = false;
    }

    $scope.select = function(CID, question){
      if(!$scope.deck.cards[CID].matched){
        if($scope.matching){
          _addSelector(CID, question);

          if(selectedQuestionID === selectedAnswerID) $scope.deck.cards[CID].matched = true;

          _removeSelector();
          $scope.matching = false;
        }else{
          _addSelector(CID, question);
          $scope.matching = true;
        }
      }
    }


  }]);

})();