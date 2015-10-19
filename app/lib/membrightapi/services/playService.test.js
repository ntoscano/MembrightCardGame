'use strict';
/*eslint consistent-this:[0] */
var angular = require('angular-mocks');
var app = require('../')('main');
var servicename = 'playService';
describe(app.name, function() {

    describe('Services', function() {

        describe(servicename, function() {
            var $injector, apiConfig, moment, _, $rootScope;

            beforeEach(function() {
                angular.mock.module(app.name, function ($provide) {
                });
            });

            beforeEach(inject(['$injector', '$rootScope', 'main.ngLib.moment', 'main.ngLib.lodash', function(_$injector_, _$rootScope_, _moment_, ___) {
                $injector = _$injector_;
                $rootScope = _$rootScope_;
                apiConfig = $injector.get(app.name + '.config');
                this.service = $injector.get(app.name + '.' + servicename);
                moment = _moment_;
                _ = ___;
            }]));

            it('should be defined', function() {
                expect(this.service).toBeDefined();
            });

            describe('setup functions', function () {
                var $httpBackend, current;

                beforeEach(function () {
                    this.service = $injector.get(app.name + '.' + servicename);
                    $httpBackend = $injector.get('$httpBackend');
                    current = {
                        decks: [],
                        deckIds: [],
                        playlist: undefined
                    };
                });

                afterEach(function () {
                    $httpBackend.verifyNoOutstandingRequest();
                    $httpBackend.verifyNoOutstandingExpectation();
                });

                it('should load a deck', function () {
                    var Deck = $injector.get('DeckResource');
                    spyOn(Deck, 'get').and.returnValue({id:1});

                    this.service._getDeck(current, '1');

                    expect(Deck.get).toHaveBeenCalled();
                    expect(current.decks.length).toBe(1);
                    expect(current.decks[0].id).toBe(1);
                });

                it('should load a playlist and its decks', function () {
                    $httpBackend.expectGET(apiConfig.api.playlist.replace('\:id/', '2') + '?cards=true&decks=true&format=json')
                        .respond({id:2, decks: [{id: 10}, {id: 11}]});

                    this.service._getPlaylist(current, '2');
                    $httpBackend.flush();

                    expect(current.playlist).toBeDefined();
                    expect(current.decks.length).toBe(2);
                    expect(current.decks[0].id).toBe(10);
                });


                it('should load all the non muted decks', function () {
                    $httpBackend.expectGET(apiConfig.api.deck.replace('/\:id/', '') + '?format=json')
                        .respond({objects: [{id: 20}, {id: 21}, {id: 22}]});
                    $httpBackend.expectGET(apiConfig.api.userDeckStatus.replace('/\:id/', '') + '?format=json')
                        .respond({objects: [{deckId: 20, content: {}}, {deckId: 21, content: {}}, {deckId: 22, content: { muted: true }}]});

                    this.service._getAllDecks(current);
                    $httpBackend.flush();

                    expect(current.decks.length).toBe(2);
                    expect(current.decks[0].id).toBe(20);
                    expect(current.decks[1].id).toBe(21);
                });

                describe('getDecks', function () {
                    it('should call _getAllDecks', function () {
                        spyOn(this.service, '_getAllDecks');
                        this.service.getDecks({});

                        expect(this.service._getAllDecks).toHaveBeenCalled();
                    });

                    it('should call _getPlaylist', function () {
                        spyOn(this.service, '_getPlaylist');
                        this.service.getDecks({}, 'playlist', '1');

                        expect(this.service._getPlaylist).toHaveBeenCalled();
                    });

                    it('should call _getDeck', function () {
                        spyOn(this.service, '_getDeck');
                        this.service.getDecks({}, 'deck', '1');

                        expect(this.service._getDeck).toHaveBeenCalled();
                    });
                });

                describe('data manipulation', function () {
                    var testData, now;

                    beforeEach(function () {
                        testData = require('./data.test.js');
                        testData.runSync($injector, $httpBackend, apiConfig);
                        now = moment.utc();
                    });

                    afterEach(function () {
                        $httpBackend.verifyNoOutstandingRequest();
                        $httpBackend.verifyNoOutstandingExpectation();
                    });

                    it('returns correct set of ucs from MembrightResources', function () {
                        var ucs = this.service.getUserCardStatusByDeck([180, 207]);
                        expect(ucs[180]).toBeDefined();
                        expect(ucs[180][0].deckId).toBe(180);
                        expect(ucs[207]).toBeDefined();
                        expect(ucs[207][0].deckId).toBe(207);
                    });

                    it('returns correct uc and rotates deckIds', function () {
                        var deckIds = [180, 207, 189];
                        var ucs = this.service.getUserCardStatusByDeck(deckIds);
                        var uc = this.service.getNextUserCardStatus(deckIds, ucs);

                        expect(uc.deckId).toBe(180);
                        expect(deckIds[0]).toBe(207);
                        expect(deckIds[1]).toBe(189);
                    });

                    it('returns a panel with data from MembrightResources', function () {
                        var ucs = this.service.getUserCardStatusByDeck([180]);
                        var uc = this.service.getNextUserCardStatus([180], ucs);
                        var panel = this.service.getPanel(uc);

                        $rootScope.$digest();

                        expect(panel.card.id).toBe(uc.cardId);
                        expect(panel.deck.id).toBe(uc.deckId);
                        expect(panel.userDeckStatus.deckId).toBe(uc.deckId);
                        expect(panel.cardMode).toBe('new');
                    });

                    it('returns a targeted user card status by cardId and deckId', function () {
                        var ucsbd = this.service.getUserCardStatusByDeck([180, 207]);
                        var ucs = this.service.getCardStatus(ucsbd, '4931', '207');
                        expect(ucs).toBeDefined();
                        expect(ucs.cardId).toBe(4931);
                        expect(ucs.deckId).toBe(207);
                    });

                    it('keeps correctStreak and current.strength consistent', function () {
                        var ucs = {"cardId": 4929, "correctStreak": 0, "createdAt": "2015-04-17T22:19:08.322828", "deckId": 207, "id": 32345, "muted": false, "resourceUri": "/api/v2/usercardstatus/32345", "reviewBy": null, "updatedAt": "2015-04-17T22:19:08.322855"};

                        var i = 0;
                        while(i++ < 15) {
                            this.service.processResponse(now, ucs, true, moment.utc(now).subtract(1, 'h'), moment.utc(now).subtract(1, 'm'));

                            expect(ucs.correctStreak).toBeCloseTo(i, 1);
                            expect(ucs.content.current.strength).toBeCloseTo(i, 1);

                            now = moment.utc(ucs.reviewBy);
                        }
                    });

                    it('quick cramming still makes progress', function () {
                        /*
                        Here I am trying to see if the behavior of the algorithm is consistent with my expectations.

                        TODO: Skip if potential gain is less than 1% (they are 99% certain to recall).

                        If I get something wrong on the first try, when should I review next?
                            Nowish - 7 seconds, after answering another card.
                        If I get something right on the first try, when should I review next?
                            In about an hour.
                        If I get something right on the second try a few minutes later, when should I review next?
                            Again, in about an hour.
                        If I review something 15 times in an hour correctly, when should I review next?
                            In a few hours.
                         */
                        var ucs = {"cardId": 4929, "correctStreak": 0, "createdAt": "2015-04-17T22:19:08.322828", "deckId": 207, "id": 32345, "muted": false, "resourceUri": "/api/v2/usercardstatus/32345", "reviewBy": null, "updatedAt": "2015-04-17T22:19:08.322855"},
                            sessionStart = moment.utc(now),
                            i = 0;
                        while(i++ < 15) {
                            //WARNING: potential gain is ignored
                            //dump('potential gain: ' + this.service.getPotentialGain(now, ucs) * 100);
                            //if (this.service.getPotentialGain(now, ucs) < .01) {
                            //    //skip
                            //    dump('skipping; since session start: ' + sessionStart.from(now));
                            //    now = moment.utc(now).add(3, 'm');
                            //    continue;
                            //}
                            this.service.processResponse(now, ucs, true, moment.utc(now).subtract(2, 'm'), moment.utc(now).subtract(1, 'm'));

                            // WARNING: from now is bugged
                            // TODO: report bug in moment.js
                            //console.log('from now sessionStart', now.diff(moment.utc(ucs.sessionStart), 'minutes'));
                            //console.log('from now diff', now.diff(moment.utc(ucs.reviewBy), 'hours'));
                            //console.log('from now', now.fromNow(moment.utc(ucs.reviewBy), 'minutes'));

                            if (i < 3) {
                                expect(now.diff(moment.utc(ucs.reviewBy), 'hours')).toBe(-1);
                            } else if (i == 14) {
                                expect(now.diff(moment.utc(ucs.reviewBy), 'hours')).toBe(-3);
                            }

                            now = moment.utc(now).add(3, 'm');
                        }

                    });

                    it('sorts user card status', function () {
                        var ucsbd = this.service.getUserCardStatusByDeck([180, 207]);


                        var i = 0;
                        while (i++ < 10){
                            ucsbd[180][i].reviewBy = moment.utc(now).add(30*i-180, 'minutes').format();
                        }

                        var sorted = this.service.getSortedCardStatus(now, ucsbd[180]);
                        var order =  [32289, 32290, 32291, 32292, 32293, 32294, 32283, 32282, 32281, 32280, 32279, 32278, 32277, 32288, 32287, 32286, 32285, 32284];
                        _.each(sorted, function(ucs) {
                            expect(ucs.id).toBe(order.shift());
                            //console.log(ucs.id, ucs.cardId, ucs.reviewBy, moment.utc(ucs.reviewBy).from(now), moment.utc(ucs.reviewBy).format('MMMM Do YYYY, h:mm:ss a'));
                        });
                    });

                });
            });

        });
    });
});