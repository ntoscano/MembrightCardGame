// deckController.js
(function(){
  var app = angular.module('deckController', ['deckService', 'ngSanitize']);

  app.controller('deckCtrl', ['$scope','$sce','deckSrvc', function($scope, $sce, deckService){
    $scope.deck = deckService.getDeck();
    var matching = null;
    var mismatched = false;
    var selectedAnswerID = null;
    var selectedQuestionID = null;

    var _addSelector = function(CID, cardType){
      if(cardType === 'question'){
        if(selectedQuestionID && $scope.deck.cards[selectedQuestionID].state !== 'matched'){
          $scope.deck.cards[selectedQuestionID].state = null;
        }
        $scope.deck.cards[CID].state = 'qSelected';
        selectedQuestionID = CID;        
      }else{
        if(selectedAnswerID && $scope.deck.cards[selectedAnswerID].state !== 'matched'){
          $scope.deck.cards[selectedAnswerID].state = null;
        }
        $scope.deck.cards[CID].state = 'aSelected';
        selectedAnswerID = CID;
      } 
    }

    var _mismatch = function(){
      mismatched = true;
      if(selectedQuestionID){
        $scope.deck.cards[selectedQuestionID].state = 'qMismatched';
      }
      if(selectedAnswerID){
        $scope.deck.cards[selectedAnswerID].state = 'aMismatched';
      }
    }

    var _checkMismatch = function(cardType){
      if(mismatched){
        if(selectedQuestionID){
          $scope.deck.cards[selectedQuestionID].state = null;
          selectedQuestionID = null;
        }
        if(selectedAnswerID){
          $scope.deck.cards[selectedAnswerID].state = null;
          selectedAnswerID = null;
        }
        mismatched = false;
      }
    }

    $scope.select = function(CID, cardType){
      if(cardType === matching){
        matching = null;
      }
      _checkMismatch();
      if($scope.deck.cards[CID].state !== 'matched'){
        if(matching !== null){
          _addSelector(CID, cardType);

          if(selectedQuestionID === selectedAnswerID){
            $scope.deck.cards[CID].state = 'matched';
          }else{
            _mismatch();
          }
          matching = null;
        }else{
          _addSelector(CID, cardType);
          matching = cardType;
        }
      }
    }


  }]);

})();