// deckController.js
(function(){
  var app = angular.module('deckService', []);

  app.service('deckSrvc', [function(){
    var deckGetter = {
      shuffle: function(array){
        var currentIndex = array.length, temporaryValue, randomIndex ;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

          // Pick a remaining element...
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex -= 1;

          // And swap it with the current element.
          temporaryValue = array[currentIndex];
          array[currentIndex] = array[randomIndex];
          array[randomIndex] = temporaryValue;
        }

        return array;
      },

      getDeck: function(DeckId){
        var cards = {};
        var qList = [];
        var aList = [];
        var response = {
            "meta": {
              "limit": 1000,
              "next": null,
              "offset": 0,
              "previous": null,
              "totalCount": 9
            },
            "objects": [
              {
                "access": "pu",
                "content": "{\"question\":\"Negative aspects of today's world attributable to agriculture:\",\"answer\":\"Patriarchy<div>Inequality<br\/><div>War<\/div><div>Famine<\/div><\/div><div>Man made environmental change<\/div>\",\"links\":[{\"label\":\"9:40\",\"url\":\"http:\/\/youtu.be\/Yocja_N5s1I?t=9m40s\"}]}",
                "createdAt": "2015-02-10T01:50:43.140761",
                "id": 5185,
                "obj": {
                  "answer": "Patriarchy<div>Inequality<br\/><div>War<\/div><div>Famine<\/div><\/div><div>Man made environmental change<\/div>",
                  "links": [
                    {
                      "label": "9:40",
                      "url": "http:\/\/youtu.be\/Yocja_N5s1I?t=9m40s"
                    }
                  ],
                  "question": "Negative aspects of today's world attributable to agriculture:"
                },
                "ownerId": 291,
                "resourceUri": "\/api\/v2\/card\/5185",
                "type": "frontAndBack",
                "updatedAt": "2015-02-10T01:50:43.140803"
              },
              {
                "access": "pu",
                "content": "{\"answer\":\"Archeology and Paleobiology.\",\"links\":[{\"label\":\"2:09\",\"url\":\"http:\/\/youtu.be\/Yocja_N5s1I?t=2m9s\"}],\"question\":\"How do we know about pre-historic humans?\"}",
                "createdAt": "2015-02-10T01:14:40.469776",
                "id": 5180,
                "obj": {
                  "answer": "Archeology and Paleobiology.",
                  "links": [
                    {
                      "label": "2:09",
                      "url": "http:\/\/youtu.be\/Yocja_N5s1I?t=2m9s"
                    }
                  ],
                  "question": "How do we know about pre-historic humans?"
                },
                "ownerId": 291,
                "resourceUri": "\/api\/v2\/card\/5180",
                "type": "frontAndBack",
                "updatedAt": "2015-02-10T01:16:13.548899"
              },
              {
                "access": "pu",
                "content": "{\"answer\":\"Everything.\",\"links\":[{\"label\":\"0:12\",\"url\":\"http:\/\/youtu.be\/Yocja_N5s1I?t=12s\"}],\"question\":\"What will be on the test?\"}",
                "createdAt": "2015-01-18T00:31:49.279764",
                "id": 5125,
                "obj": {
                  "answer": "Everything.",
                  "links": [
                    {
                      "label": "0:12",
                      "url": "http:\/\/youtu.be\/Yocja_N5s1I?t=12s"
                    }
                  ],
                  "question": "What will be on the test?"
                },
                "ownerId": 291,
                "resourceUri": "\/api\/v2\/card\/5125",
                "type": "frontAndBack",
                "updatedAt": "2015-01-20T04:01:46.457603"
              },
              {
                "access": "pu",
                "content": "{\"answer\":\"Fishing was one of their best sources of food, in terms of reliability and safety.\",\"links\":[{\"label\":\"2:30\",\"url\":\"http:\/\/youtu.be\/Yocja_N5s1I?t=2m30s\"}],\"question\":\"Why did early humans settle near the shore?\"}",
                "createdAt": "2015-01-18T00:35:02.515134",
                "id": 5127,
                "obj": {
                  "answer": "Fishing was one of their best sources of food, in terms of reliability and safety.",
                  "links": [
                    {
                      "label": "2:30",
                      "url": "http:\/\/youtu.be\/Yocja_N5s1I?t=2m30s"
                    }
                  ],
                  "question": "Why did early humans settle near the shore?"
                },
                "ownerId": 291,
                "resourceUri": "\/api\/v2\/card\/5127",
                "type": "frontAndBack",
                "updatedAt": "2015-02-10T01:13:44.346180"
              },
              {
                "access": "pu",
                "content": "{\"question\":\"Advantages\/Disadvantages of agriculture:\",\"answer\":\"A: Leads to controllable food supply.<div>D: Necessitates radical changes in the land\/environment.<\/div><div>A: Leads to food surplus, which leads to specialization of labor.<\/div><div>D: Arguably is worse for the environment\/humans<\/div><div>A: Can be practiced all around the world<\/div><div>D: Can lead to oppression\/slavery<\/div>\",\"links\":[{\"label\":\"3:39\",\"url\":\"http:\/\/youtu.be\/Yocja_N5s1I?t=3m39s\"}]}",
                "createdAt": "2015-02-10T01:25:58.633358",
                "id": 5182,
                "obj": {
                  "answer": "A: Leads to controllable food supply.<div>D: Necessitates radical changes in the land\/environment.<\/div><div>A: Leads to food surplus, which leads to specialization of labor.<\/div><div>D: Arguably is worse for the environment\/humans<\/div><div>A: Can be practiced all around the world<\/div><div>D: Can lead to oppression\/slavery<\/div>",
                  "links": [
                    {
                      "label": "3:39",
                      "url": "http:\/\/youtu.be\/Yocja_N5s1I?t=3m39s"
                    }
                  ],
                  "question": "Advantages\/Disadvantages of agriculture:"
                },
                "ownerId": 291,
                "resourceUri": "\/api\/v2\/card\/5182",
                "type": "frontAndBack",
                "updatedAt": "2015-02-10T01:25:58.633403"
              },
              {
                "access": "pu",
                "content": "{\"answer\":\"In various places around the world, using the plants early humans had at their disposal.\",\"links\":[{\"label\":\"3:08\",\"url\":\"http:\/\/youtu.be\/Yocja_N5s1I?t=3m8s\"}],\"question\":\"Where did agriculture develop?\"}",
                "createdAt": "2015-01-18T00:36:44.795185",
                "id": 5128,
                "obj": {
                  "answer": "In various places around the world, using the plants early humans had at their disposal.",
                  "links": [
                    {
                      "label": "3:08",
                      "url": "http:\/\/youtu.be\/Yocja_N5s1I?t=3m8s"
                    }
                  ],
                  "question": "Where did agriculture develop?"
                },
                "ownerId": 291,
                "resourceUri": "\/api\/v2\/card\/5128",
                "type": "frontAndBack",
                "updatedAt": "2015-01-20T04:19:16.397761"
              },
              {
                "access": "pu",
                "content": "{\"answer\":\"A: Domesticated animals serve a variety of purposes<div>D: Sedentary lifestyle becomes difficult because of constantly having to feed the herd.&#160;<\/div><div>D: Domesticatable animals aren't always around<\/div>\",\"links\":[{\"label\":\"5:29\",\"url\":\"http:\/\/youtu.be\/Yocja_N5s1I?t=5m29s\"}],\"question\":\"Advantages\/Disadvantages of herding:\"}",
                "createdAt": "2015-02-10T01:30:06.344030",
                "id": 5183,
                "obj": {
                  "answer": "A: Domesticated animals serve a variety of purposes<div>D: Sedentary lifestyle becomes difficult because of constantly having to feed the herd.&#160;<\/div><div>D: Domesticatable animals aren't always around<\/div>",
                  "links": [
                    {
                      "label": "5:29",
                      "url": "http:\/\/youtu.be\/Yocja_N5s1I?t=5m29s"
                    }
                  ],
                  "question": "Advantages\/Disadvantages of herding:"
                },
                "ownerId": 291,
                "resourceUri": "\/api\/v2\/card\/5183",
                "type": "frontAndBack",
                "updatedAt": "2015-02-10T01:41:18.056083"
              },
              {
                "access": "pu",
                "content": "{\"question\":\"John Green's theory on the cause of the Agricultural Revolution:\",\"answer\":\"The revolution came as a byproduct of a desire for more available calories, instead of a conscious choice to change the course of humanity.&#160;\",\"links\":[{\"label\":\"8:30\",\"url\":\"http:\/\/youtu.be\/Yocja_N5s1I?t=8m30s\"}]}",
                "createdAt": "2015-02-10T01:47:29.176584",
                "id": 5184,
                "obj": {
                  "answer": "The revolution came as a byproduct of a desire for more available calories, instead of a conscious choice to change the course of humanity.&#160;",
                  "links": [
                    {
                      "label": "8:30",
                      "url": "http:\/\/youtu.be\/Yocja_N5s1I?t=8m30s"
                    }
                  ],
                  "question": "John Green's theory on the cause of the Agricultural Revolution:"
                },
                "ownerId": 291,
                "resourceUri": "\/api\/v2\/card\/5184",
                "type": "frontAndBack",
                "updatedAt": "2015-02-10T01:47:29.176699"
              },
              {
                "access": "pu",
                "content": "{\"question\":\"What has happened in the last 15,000 years?\",\"answer\":\"Humanity has gone from hunting and gathering to creating the airplane, internet, and 99 cent double cheese burger.&#160;\",\"links\":[{\"label\":\"1:03\",\"url\":\"http:\/\/youtu.be\/Yocja_N5s1I?t=1m3s\"}]}",
                "createdAt": "2015-02-10T01:18:06.419776",
                "id": 5181,
                "obj": {
                  "answer": "Humanity has gone from hunting and gathering to creating the airplane, internet, and 99 cent double cheese burger.&#160;",
                  "links": [
                    {
                      "label": "1:03",
                      "url": "http:\/\/youtu.be\/Yocja_N5s1I?t=1m3s"
                    }
                  ],
                  "question": "What has happened in the last 15,000 years?"
                },
                "ownerId": 291,
                "resourceUri": "\/api\/v2\/card\/5181",
                "type": "frontAndBack",
                "updatedAt": "2015-02-10T01:18:06.419811"
              }
            ]};
        for(var i = 0; i < response.objects.length; i++){
          cards[response.objects[i].id] = response.objects[i];
          qList.push(response.objects[i].id);
          aList.push(response.objects[i].id);
        }
        qList.sort(function(a, b){
          return a - b;
        });
        aList = this.shuffle(aList);
        return {
          cards: cards,
          qList: qList,
          aList: aList
        };
      }
    };
    return deckGetter;
  }]);

})();