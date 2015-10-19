'use strict';
var servicename = 'playService';

define(function(require, exports, module){
    module.exports = function(app) {

        var dependencies = ['$q', 'main.ngLib.lodash', 'main.ngLib.moment', 'main.membrightapi.membrightResources',
                'PlaylistResource', 'DeckResource', 'CardResource', 'UserDeckStatusResource', 'AnswerLogResource', 'main.membrightapi.spacingService'];

        function service($q, _, moment, MembrightResources, Playlist, Deck, Card, UserDeckStatus, AnswerLog, SpacingService) {
            var self;

            var getDecks = function (current, type, typeId) {
                var toDefer = []; var toRun = [];
                if (type === 'deck' && typeId) {
                    toDefer.push(self._getDeck(current, typeId));
                } else if (type == 'playlist' && typeId) {
                    toDefer.push(self._getPlaylist(current, typeId));
                } else {
                    if(type == 'card' && typeId){
                        //cardOrder.chooseFirstCard([parseInt(typeId)]); //TODO: handle first card
                    }
                    toDefer.push(self._getAllDecks(current));
                }

                var promise = $q.all(toDefer);
                promise.then(function () {
                    _.each(toRun, function (func) {
                        func();
                    });
                });

                return promise;
            };

            var addDeck = function (current, deckId, deck) {
                current.deckIds.push(parseInt(deckId));
                current.decks.push(deck);
            };

            var getDeck = function (current, typeId) {
                var deck = Deck.get({ id : typeId});
                addDeck(current, typeId, deck);
                return deck.$promise;
            };

            var getPlaylist = function (current, typeId) {
                current.playlist = Playlist.get({id:typeId, decks : true, cards : true}, function (playlist) {
                    _.each(playlist.decks, function (deck) {
                        addDeck(current, deck.id, deck);
                    });
                });
                return current.playlist.$promise;
            };

            var getAllDecks = function (current) {
                var userDecks = Deck.query({});
                var userDeckStatus = UserDeckStatus.query();
                var filterMutedPromise = $q.all([userDecks.$promise, userDeckStatus.$promise]);
                filterMutedPromise.then(function () {
                    var mutedDeckIds = [];
                    _.each(userDeckStatus, function (uds) {
                        if (uds.content.muted === true) mutedDeckIds.push(uds.deckId);
                    });
                    _.each(userDecks, function (d) {
                        if (!_.contains(mutedDeckIds, d.id)) {
                            addDeck(current, d.id, d);
                        }
                    });
                });
                return filterMutedPromise;
            };

            var partitionUserCardSatus = function (current, sessionHorizon, ucs, deckIds) {
                // Instantiate stats model
                var stats = {
                    new: 0,
                    due: 0,
                    known: 0,
                    primed: 0,
                    total: 0,
                    byDeck: {}
                };
                var defaultDeckStats = _.clone(stats);
                var statsByDeck = {};

                var now = moment.utc();
                var processCardStatusStats = function (uc) {
                    var state = uc.getState(now);
                    stats[state]++;
                    stats.total++;

                    if (_.isUndefined(stats.byDeck[uc.deckId])) stats.byDeck[uc.deckId] = _.clone(defaultDeckStats)
                    stats.byDeck[uc.deckId][state]++;
                    stats.byDeck[uc.deckId].total++;

                    return state;
                };

                // Filter muted and not targeted
                var ucsTargeted = _.partition(ucs, function (uc) {
                    return uc.muted == false && _.contains(deckIds, uc.deckId);
                });

                var ucsDue = _.partition(ucsTargeted[0], function (uc) {
                    var state = processCardStatusStats(uc);
                    return current.sessionHorizon > uc.getReviewBy();
                });

                // Set Remaining Inventory
                current.ucsRemaining = ucsDue[1];
                // Sort Remaining inventory
                current.ucsRemaining.sort(function (a, b) {
                    return b.getGain(now) - a.getGain(now);
                });

                //
                // Pad list of cards due with ucsRemaining to meet sessionMinimum
                //
                var cardsNeeded = _.min([current.sessionMinimum - ucsDue[0].length, current.ucsRemaining.length]);
                if (cardsNeeded > 0) {
                    var cards = current.ucsRemaining.splice(0, cardsNeeded);
                    _.each(cards, function (card) {
                        ucsDue[0].push(card);
                    });
                }
                stats.cardsInPlay = ucsDue[0].length;

                // Group Due Cards By Deck then sort
                current.ucsDueByDeck = _.groupBy(ucsDue[0], 'deckId');
                _.each(deckIds, function (deckId) {
                    var ucs = current.ucsDueByDeck[deckId];
                    if (_.isUndefined(ucs)) ucs = current.ucsDueByDeck[deckId] = [];
                    ucs.sort(self._dueDeckSort);
                    //TODO: statsByDeck;
                });

                // Set Stats
                _.extend(current.stats, stats);

                MembrightFrustrationAssassin.cardCount(ucsDue[0].length + current.ucsRemaining);
            };

            var getUserCardStatusByDeck = function (deckIds) {
                var ucs = {};
                _.each(deckIds, function (deckId) {
                    ucs[deckId] = _.clone(MembrightResources.data.cardStatusByDeck[deckId]);
                });
                return ucs;
            };

            var getSortedCardStatus = function (now, status) {
                var due = [], novo = [], rest = [], nowStr = now.format();
                _.each(status, function (ucs) {
                    if (!ucs.reviewBy) {
                        novo.push(ucs);
                        return;
                    }
                    if (ucs.reviewBy < nowStr) {
                        due.push(ucs);
                        return;
                    }
                    rest.push(ucs);
                });

                due.sort(function(a, b) {
                    return a.reviewBy > b.reviewBy ? -1 : 1;
                });

                rest.sort(function(a, b) {
                    return a.reviewBy > b.reviewBy ? 1 : -1;
                });

                return due.concat(novo, rest);
            };


            var getNextUserCardStatus = function (deckIds, ucs) {
                var i, uc;
                for (i = 0; i < deckIds.length; i++) {
                    var deckId = deckIds[i];
                    if (ucs[deckId] && ucs[deckId].length) {
                        uc = ucs[deckId].shift();
                        break;
                    }
                }
                // Rotate decks, as many times as decks were skipped
                while (deckIds.length && i >= 0) {
                    deckIds.push(deckIds.shift());
                    i--;
                }
                return uc;
            };

            var processResponse = function (now, ucs, correct, sessionStart, cardStart) {
                initStatus(ucs);

                if (correct) {
                    ucs.correctStreak += 1;
                } else {
                    ucs.correctStreak = 0;
                    ucs.content.current.strength = 0;
                }

                var nextDate = SpacingService.getNextReviewDate(now, ucs.updatedAt, ucs.content.current, ucs.content.lifetime);
                ucs.reviewBy = nextDate.utc().format();
                ucs.updatedAt = now;

                logAnswer(ucs, correct, sessionStart, cardStart);
            };

            var initStatus = function (ucs) {
                if (_.isUndefined(ucs.content)) { ucs.content = {}; };
                if (_.isUndefined(ucs.content.current)) { ucs.content.current = { strength: ucs.correctStreak } };
                if (_.isUndefined(ucs.content.lifetime)) { ucs.content.lifetime = { strength: 0} };
            };

            var logAnswer = function(ucs, correct, sessionStart, cardStart) {
                if (ucs.$update) {
                    ucs.$update();
                    AnswerLog.save({
                        card_id : ucs.cardId,
                        state : correct ? AnswerLog.STATE.RIGHT_ANSWER : AnswerLog.STATE.WRONG_ANSWER,
                        streak : ucs.correctStreak,
                        points : 0,
                        cumulativePoints : 0,
                        session_length : moment.utc().diff(sessionStart, 'seconds'),
                        time_to_answer : moment.utc().diff(cardStart, 'seconds'),
                        ms_to_answer : moment.utc().diff(cardStart)
                    });
                }
            };

            var getPotentialGain = function(now, ucs) {
                initStatus(ucs);
                return SpacingService._getPotentialGain(now, ucs.updatedAt, ucs.content.strength);
            };

            var getPanel = function (uc) {
                return {
                    card: Card.get({ id : uc.cardId }),
                    userCardStatus: uc,
                    deck: Deck.get({ id : uc.deckId }),
                    userDeckStatus: UserDeckStatus.getOne({ deck_id : uc.deckId }),
                    answerLog: {},
                    cardStart: moment.utc(),
                    responded: false,
                    correct: undefined,
                    cardMode: uc.getState(),
                    position: {}
                };
            };

            var getCardStatus = function(ucsbd, cardId, deckId) {
                return _.findWhere(ucsbd[parseInt(deckId)], { cardId: parseInt(cardId)});
            };

            return self = {
                getDecks: getDecks,
                getUserCardStatusByDeck: getUserCardStatusByDeck,
                getNextUserCardStatus: getNextUserCardStatus,
                getPanel: getPanel,
                getCardStatus: getCardStatus,
                processResponse: processResponse,
                _getDeck: getDeck,
                _getPlaylist: getPlaylist,
                _getAllDecks: getAllDecks,
                getPotentialGain: getPotentialGain,
                getSortedCardStatus: getSortedCardStatus
            };

        }
        service.$inject = dependencies;
        app.factory(app.name + '.' + servicename, service);
    };
});

