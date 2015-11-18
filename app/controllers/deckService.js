// deckController.js
(function(){
  var app = angular.module('deckService', []);

  app.service('deckSrvc', [function(){
    var deckGetter = {
      shuffle: function(array){ // use a library shuffle method i.e. underscore
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
        var aList = []; //improve variable names
        var response = {
          "meta": {
            "limit": 1000,
            "next": null,
            "offset": 0,
            "previous": null,
            "totalCount": 30
          },
          "objects": [
            {
              "access": "pu",
              "content": "{\"question\":\"Above The Fold\",\"answer\":\"The top most portion of a webpage that is visible without users having to scroll.\",\"links\":[]}",
              "createdAt": "2015-11-18T21:30:08.214876",
              "id": 5855,
              "obj": {
                "answer": "The top most portion of a webpage that is visible without users having to scroll.",
                "links": [
                  
                ],
                "question": "Above The Fold"
              },
              "ownerId": 291,
              "resourceUri": "\/api\/v2\/card\/5855",
              "type": "frontAndBack",
              "updatedAt": "2015-11-18T21:30:08.214907"
            },
            {
              "access": "pu",
              "content": "{\"question\":\"Unique Selling Point\",\"answer\":\"The competitive differentiators that a business has over its competitors.\",\"links\":[]}",
              "createdAt": "2015-11-18T21:35:33.795082",
              "id": 5877,
              "obj": {
                "answer": "The competitive differentiators that a business has over its competitors.",
                "links": [
                  
                ],
                "question": "Unique Selling Point"
              },
              "ownerId": 291,
              "resourceUri": "\/api\/v2\/card\/5877",
              "type": "frontAndBack",
              "updatedAt": "2015-11-18T21:35:33.795119"
            },
            {
              "access": "pu",
              "content": "{\"question\":\"Below The Fold\",\"answer\":\"The portion of a webpage that is not immediately visible when the page loads, that users must scroll to see.\",\"links\":[]}",
              "createdAt": "2015-11-18T21:30:55.807418",
              "id": 5858,
              "obj": {
                "answer": "The portion of a webpage that is not immediately visible when the page loads, that users must scroll to see.",
                "links": [
                  
                ],
                "question": "Below The Fold"
              },
              "ownerId": 291,
              "resourceUri": "\/api\/v2\/card\/5858",
              "type": "frontAndBack",
              "updatedAt": "2015-11-18T21:30:55.807467"
            },
            {
              "access": "pu",
              "content": "{\"question\":\"Average Order Value\",\"answer\":\"The average dollar amount spent each time a customer places an order on a website or mobile app.\",\"links\":[]}",
              "createdAt": "2015-11-18T21:30:41.333622",
              "id": 5857,
              "obj": {
                "answer": "The average dollar amount spent each time a customer places an order on a website or mobile app.",
                "links": [
                  
                ],
                "question": "Average Order Value"
              },
              "ownerId": 291,
              "resourceUri": "\/api\/v2\/card\/5857",
              "type": "frontAndBack",
              "updatedAt": "2015-11-18T21:30:41.333672"
            },
            {
              "access": "pu",
              "content": "{\"question\":\"Sales Funnel\",\"answer\":\"The path taken by a potential customer through a website or app as they move towards becoming a customer.\",\"links\":[]}",
              "createdAt": "2015-11-18T21:34:05.717204",
              "id": 5871,
              "obj": {
                "answer": "The path taken by a potential customer through a website or app as they move towards becoming a customer.",
                "links": [
                  
                ],
                "question": "Sales Funnel"
              },
              "ownerId": 291,
              "resourceUri": "\/api\/v2\/card\/5871",
              "type": "frontAndBack",
              "updatedAt": "2015-11-18T21:34:05.717292"
            },
            {
              "access": "pu",
              "content": "{\"question\":\"Online Marketing\",\"answer\":\"The strategy for leveraging web-based channels to spread a message about a company&#8217;s brand, products, or services to its potential customers.\",\"links\":[]}",
              "createdAt": "2015-11-18T21:33:53.743458",
              "id": 5870,
              "obj": {
                "answer": "The strategy for leveraging web-based channels to spread a message about a company&#8217;s brand, products, or services to its potential customers.",
                "links": [
                  
                ],
                "question": "Online Marketing"
              },
              "ownerId": 291,
              "resourceUri": "\/api\/v2\/card\/5870",
              "type": "frontAndBack",
              "updatedAt": "2015-11-18T21:33:53.743515"
            },
            {
              "access": "pu",
              "content": "{\"question\":\"Squeeze Page\",\"answer\":\"A landing page which is specifically designed to 'squeeze' e-mail addresses out of visitors and prospects.\",\"links\":[]}",
              "createdAt": "2015-11-18T21:35:00.469027",
              "id": 5875,
              "obj": {
                "answer": "A landing page which is specifically designed to 'squeeze' e-mail addresses out of visitors and prospects.",
                "links": [
                  
                ],
                "question": "Squeeze Page"
              },
              "ownerId": 291,
              "resourceUri": "\/api\/v2\/card\/5875",
              "type": "frontAndBack",
              "updatedAt": "2015-11-18T21:35:00.469056"
            },
            {
              "access": "pu",
              "content": "{\"question\":\"User Flow\",\"answer\":\"The path taken by a prototypical user on a website or app to complete a task.\",\"links\":[]}",
              "createdAt": "2015-11-18T21:35:40.552024",
              "id": 5878,
              "obj": {
                "answer": "The path taken by a prototypical user on a website or app to complete a task.",
                "links": [
                  
                ],
                "question": "User Flow"
              },
              "ownerId": 291,
              "resourceUri": "\/api\/v2\/card\/5878",
              "type": "frontAndBack",
              "updatedAt": "2015-11-18T21:35:40.552049"
            },
            {
              "access": "pu",
              "content": "{\"question\":\"Shopping Cart Abandonment\",\"answer\":\"When a potential customer starts a check out process for an online order but drops out of the process before completing the purchase.\",\"links\":[]}",
              "createdAt": "2015-11-18T21:34:33.943447",
              "id": 5873,
              "obj": {
                "answer": "When a potential customer starts a check out process for an online order but drops out of the process before completing the purchase.",
                "links": [
                  
                ],
                "question": "Shopping Cart Abandonment"
              },
              "ownerId": 291,
              "resourceUri": "\/api\/v2\/card\/5873",
              "type": "frontAndBack",
              "updatedAt": "2015-11-18T21:34:33.943472"
            },
            {
              "access": "pu",
              "content": "{\"question\":\"<div>Bucket Testing<\/div>\",\"answer\":\"A method of testing two versions of a website or app against one another to see which one performs better on specified key metrics. Synonym for split testing.\",\"links\":[]}",
              "createdAt": "2015-11-18T21:31:13.901249",
              "id": 5859,
              "obj": {
                "answer": "A method of testing two versions of a website or app against one another to see which one performs better on specified key metrics. Synonym for split testing.",
                "links": [
                  
                ],
                "question": "<div>Bucket Testing<\/div>"
              },
              "ownerId": 291,
              "resourceUri": "\/api\/v2\/card\/5859",
              "type": "frontAndBack",
              "updatedAt": "2015-11-18T21:31:13.901305"
            },
            {
              "access": "pu",
              "content": "{\"question\":\"Lead Generation\",\"answer\":\"The process of generating consumer interest for a product or service with the goal of turning that interest into a sale.\",\"links\":[]}",
              "createdAt": "2015-11-18T21:32:51.004848",
              "id": 5866,
              "obj": {
                "answer": "The process of generating consumer interest for a product or service with the goal of turning that interest into a sale.",
                "links": [
                  
                ],
                "question": "Lead Generation"
              },
              "ownerId": 291,
              "resourceUri": "\/api\/v2\/card\/5866",
              "type": "frontAndBack",
              "updatedAt": "2015-11-18T21:32:51.004874"
            },
            {
              "access": "pu",
              "content": "{\"question\":\"Search Engine Optimization\",\"answer\":\"The art and science of getting pages to rank higher in search engines such as Google and Bing.\",\"links\":[]}",
              "createdAt": "2015-11-18T21:34:20.590288",
              "id": 5872,
              "obj": {
                "answer": "The art and science of getting pages to rank higher in search engines such as Google and Bing.",
                "links": [
                  
                ],
                "question": "Search Engine Optimization"
              },
              "ownerId": 291,
              "resourceUri": "\/api\/v2\/card\/5872",
              "type": "frontAndBack",
              "updatedAt": "2015-11-18T21:34:20.590323"
            },
            {
              "access": "pu",
              "content": "{\"question\":\"Call To Action\",\"answer\":\"A call to action or CTA is a prompt on a website that tells the user to take some specified action.\",\"links\":[]}",
              "createdAt": "2015-11-18T21:31:34.015362",
              "id": 5860,
              "obj": {
                "answer": "A call to action or CTA is a prompt on a website that tells the user to take some specified action.",
                "links": [
                  
                ],
                "question": "Call To Action"
              },
              "ownerId": 291,
              "resourceUri": "\/api\/v2\/card\/5860",
              "type": "frontAndBack",
              "updatedAt": "2015-11-18T21:31:34.015426"
            },
            {
              "access": "pu",
              "content": "{\"question\":\"Social Proof\",\"answer\":\"A strategy for conducting controlled, randomized experiments with the goal of improving a metric, such as clicks, form completions, or purchases on a website or mobile app.\",\"links\":[]}",
              "createdAt": "2015-11-18T21:34:47.935016",
              "id": 5874,
              "obj": {
                "answer": "A strategy for conducting controlled, randomized experiments with the goal of improving a metric, such as clicks, form completions, or purchases on a website or mobile app.",
                "links": [
                  
                ],
                "question": "Social Proof"
              },
              "ownerId": 291,
              "resourceUri": "\/api\/v2\/card\/5874",
              "type": "frontAndBack",
              "updatedAt": "2015-11-18T21:34:47.935051"
            },
            {
              "access": "pu",
              "content": "{\"question\":\"Headline Testing\",\"answer\":\"The process of developing multiple title variations for an article or piece of online media to determine which one performs the best.\",\"links\":[]}",
              "createdAt": "2015-11-18T21:32:13.350156",
              "id": 5863,
              "obj": {
                "answer": "The process of developing multiple title variations for an article or piece of online media to determine which one performs the best.",
                "links": [
                  
                ],
                "question": "Headline Testing"
              },
              "ownerId": 291,
              "resourceUri": "\/api\/v2\/card\/5863",
              "type": "frontAndBack",
              "updatedAt": "2015-11-18T21:32:13.350203"
            },
            {
              "access": "pu",
              "content": "{\"question\":\"Value Proposition\",\"answer\":\"The essence of the value that your product or service provides to the customer.\",\"links\":[]}",
              "createdAt": "2015-11-18T21:35:51.610285",
              "id": 5879,
              "obj": {
                "answer": "The essence of the value that your product or service provides to the customer.",
                "links": [
                  
                ],
                "question": "Value Proposition"
              },
              "ownerId": 291,
              "resourceUri": "\/api\/v2\/card\/5879",
              "type": "frontAndBack",
              "updatedAt": "2015-11-18T21:35:51.610346"
            },
            {
              "access": "pu",
              "content": "{\"question\":\"A\/A Testing\",\"answer\":\"A method of comparing two versions of a webpage or mobile app experience against each other in order to test the accuracy of the testing tool.\",\"links\":[]}",
              "createdAt": "2015-11-18T21:29:21.472405",
              "id": 5852,
              "obj": {
                "answer": "A method of comparing two versions of a webpage or mobile app experience against each other in order to test the accuracy of the testing tool.",
                "links": [
                  
                ],
                "question": "A\/A Testing"
              },
              "ownerId": 291,
              "resourceUri": "\/api\/v2\/card\/5852",
              "type": "frontAndBack",
              "updatedAt": "2015-11-18T21:29:21.472459"
            },
            {
              "access": "pu",
              "content": "{\"question\":\"Landing Page Optimization\",\"answer\":\"The process of improving elements on a landing page to increase conversions.\",\"links\":[]}",
              "createdAt": "2015-11-18T21:32:38.711936",
              "id": 5865,
              "obj": {
                "answer": "The process of improving elements on a landing page to increase conversions.",
                "links": [
                  
                ],
                "question": "Landing Page Optimization"
              },
              "ownerId": 291,
              "resourceUri": "\/api\/v2\/card\/5865",
              "type": "frontAndBack",
              "updatedAt": "2015-11-18T21:32:38.711968"
            },
            {
              "access": "pu",
              "content": "{\"question\":\"Conversion Rate Optimization\",\"answer\":\"The process of increasing the percentage of conversions from a website or mobile app.&#160;\",\"links\":[]}",
              "createdAt": "2015-11-18T21:32:01.530931",
              "id": 5862,
              "obj": {
                "answer": "The process of increasing the percentage of conversions from a website or mobile app.&#160;",
                "links": [
                  
                ],
                "question": "Conversion Rate Optimization"
              },
              "ownerId": 291,
              "resourceUri": "\/api\/v2\/card\/5862",
              "type": "frontAndBack",
              "updatedAt": "2015-11-18T21:32:01.530975"
            },
            {
              "access": "pu",
              "content": "{\"question\":\"Ad Viewability\",\"answer\":\"The concept of how visible ads on a website or mobile app are to users.\",\"links\":[]}",
              "createdAt": "2015-11-18T21:30:25.695351",
              "id": 5856,
              "obj": {
                "answer": "The concept of how visible ads on a website or mobile app are to users.",
                "links": [
                  
                ],
                "question": "Ad Viewability"
              },
              "ownerId": 291,
              "resourceUri": "\/api\/v2\/card\/5856",
              "type": "frontAndBack",
              "updatedAt": "2015-11-18T21:30:25.695405"
            },
            {
              "access": "pu",
              "content": "{\"question\":\"A\/B\/N Testing\",\"answer\":\"A method of comparing multiple versions of webpage or mobile app against each other to determine which performs best.\",\"links\":[]}",
              "createdAt": "2015-11-18T21:29:56.362124",
              "id": 5854,
              "obj": {
                "answer": "A method of comparing multiple versions of webpage or mobile app against each other to determine which performs best.",
                "links": [
                  
                ],
                "question": "A\/B\/N Testing"
              },
              "ownerId": 291,
              "resourceUri": "\/api\/v2\/card\/5854",
              "type": "frontAndBack",
              "updatedAt": "2015-11-18T21:29:56.362179"
            },
            {
              "access": "pu",
              "content": "{\"question\":\"Conversion Rate\",\"answer\":\"The number of conversions on a webpage or app divided by the total number of visitors.\",\"links\":[]}",
              "createdAt": "2015-11-18T21:31:47.875861",
              "id": 5861,
              "obj": {
                "answer": "The number of conversions on a webpage or app divided by the total number of visitors.",
                "links": [
                  
                ],
                "question": "Conversion Rate"
              },
              "ownerId": 291,
              "resourceUri": "\/api\/v2\/card\/5861",
              "type": "frontAndBack",
              "updatedAt": "2015-11-18T21:31:47.875890"
            },
            {
              "access": "pu",
              "content": "{\"question\":\"Website Optimization\",\"answer\":\"The process of using controlled experimentation to improve a website's ability to drive business goals.&#160;\",\"links\":[]}",
              "createdAt": "2015-11-18T21:36:16.030122",
              "id": 5881,
              "obj": {
                "answer": "The process of using controlled experimentation to improve a website's ability to drive business goals.&#160;",
                "links": [
                  
                ],
                "question": "Website Optimization"
              },
              "ownerId": 291,
              "resourceUri": "\/api\/v2\/card\/5881",
              "type": "frontAndBack",
              "updatedAt": "2015-11-18T21:36:16.030147"
            },
            {
              "access": "pu",
              "content": "{\"question\":\"Statistical Significance\",\"answer\":\"The likelihood that the difference in conversion rates between a given variation and the baseline is not due to random chance.\",\"links\":[]}",
              "createdAt": "2015-11-18T21:35:14.741153",
              "id": 5876,
              "obj": {
                "answer": "The likelihood that the difference in conversion rates between a given variation and the baseline is not due to random chance.",
                "links": [
                  
                ],
                "question": "Statistical Significance"
              },
              "ownerId": 291,
              "resourceUri": "\/api\/v2\/card\/5876",
              "type": "frontAndBack",
              "updatedAt": "2015-11-18T21:35:14.741191"
            },
            {
              "access": "pu",
              "content": "{\"question\":\"Mobile App A\/B Testing\",\"answer\":\"The practice of using A\/B testing to test different experiences within mobile apps.\",\"links\":[]}",
              "createdAt": "2015-11-18T21:33:23.323609",
              "id": 5868,
              "obj": {
                "answer": "The practice of using A\/B testing to test different experiences within mobile apps.",
                "links": [
                  
                ],
                "question": "Mobile App A\/B Testing"
              },
              "ownerId": 291,
              "resourceUri": "\/api\/v2\/card\/5868",
              "type": "frontAndBack",
              "updatedAt": "2015-11-18T21:33:23.323663"
            },
            {
              "access": "pu",
              "content": "{\"question\":\"iOS A\/B Testing\",\"answer\":\"The process of running a controlled experiment comparing one or more versions of an iOS app against the original to improve certain metrics.\",\"links\":[]}",
              "createdAt": "2015-11-18T21:32:26.569685",
              "id": 5864,
              "obj": {
                "answer": "The process of running a controlled experiment comparing one or more versions of an iOS app against the original to improve certain metrics.",
                "links": [
                  
                ],
                "question": "iOS A\/B Testing"
              },
              "ownerId": 291,
              "resourceUri": "\/api\/v2\/card\/5864",
              "type": "frontAndBack",
              "updatedAt": "2015-11-18T21:32:26.569775"
            },
            {
              "access": "pu",
              "content": "{\"question\":\"Viewable Impression\",\"answer\":\"A standard measure of ad viewability defined by the IAB to be an ad which appears at least 50% on screen for more than one second.\",\"links\":[]}",
              "createdAt": "2015-11-18T21:36:04.830016",
              "id": 5880,
              "obj": {
                "answer": "A standard measure of ad viewability defined by the IAB to be an ad which appears at least 50% on screen for more than one second.",
                "links": [
                  
                ],
                "question": "Viewable Impression"
              },
              "ownerId": 291,
              "resourceUri": "\/api\/v2\/card\/5880",
              "type": "frontAndBack",
              "updatedAt": "2015-11-18T21:36:04.830046"
            },
            {
              "access": "pu",
              "content": "{\"question\":\"<div>A\/B Testing<\/div>\",\"answer\":\"A method of comparing two versions of a webpage or mobile app experience against each other to determine which performs best.\",\"links\":[]}",
              "createdAt": "2015-11-18T21:29:39.793155",
              "id": 5853,
              "obj": {
                "answer": "A method of comparing two versions of a webpage or mobile app experience against each other to determine which performs best.",
                "links": [
                  
                ],
                "question": "<div>A\/B Testing<\/div>"
              },
              "ownerId": 291,
              "resourceUri": "\/api\/v2\/card\/5853",
              "type": "frontAndBack",
              "updatedAt": "2015-11-18T21:29:39.793180"
            },
            {
              "access": "pu",
              "content": "{\"question\":\"Marketing Technology Stack\",\"answer\":\"A grouping of technologies that marketers leverage to conduct and improve their marketing activities.\",\"links\":[]}",
              "createdAt": "2015-11-18T21:33:09.545216",
              "id": 5867,
              "obj": {
                "answer": "A grouping of technologies that marketers leverage to conduct and improve their marketing activities.",
                "links": [
                  
                ],
                "question": "Marketing Technology Stack"
              },
              "ownerId": 291,
              "resourceUri": "\/api\/v2\/card\/5867",
              "type": "frontAndBack",
              "updatedAt": "2015-11-18T21:33:09.545274"
            },
            {
              "access": "pu",
              "content": "{\"question\":\"Multivariate Testing\",\"answer\":\"A technique for testing a hypothesis where multiple variables are modified, in order to determine the best combination of variations on those elements of a website or mobile app.\",\"links\":[]}",
              "createdAt": "2015-11-18T21:33:40.230734",
              "id": 5869,
              "obj": {
                "answer": "A technique for testing a hypothesis where multiple variables are modified, in order to determine the best combination of variations on those elements of a website or mobile app.",
                "links": [
                  
                ],
                "question": "Multivariate Testing"
              },
              "ownerId": 291,
              "resourceUri": "\/api\/v2\/card\/5869",
              "type": "frontAndBack",
              "updatedAt": "2015-11-18T21:33:40.230761"
            }
          ]}
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