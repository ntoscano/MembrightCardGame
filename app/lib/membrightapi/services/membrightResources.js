'use strict';
var servicename = 'membrightResources';

define(function(require, exports, module){
    
    module.exports = function(app) {

        app.factory('main.membrightapi.membrightResources', [
            '$q', '$cacheFactory', 'main.ngLib.lodash',
            'main.membrightapi.config', 'main.membrightapi.resourceHandler', 'DeckResource', 'CardResource', 'UserDeckStatusResource',
            'UserCardStatusResource', 'AnswerLogResource', 'UserPreferencesResource', 'DeckCardsResource',
            'PlaylistResource', 'PlaylistDecksResource', 'UserPlaylistStatusResource',
            function ($q, $cacheFactory, _, config, ResourceHandler, Deck, Card, UserDeckStatus, UserCardStatus, AnswerLog,
                      UserPreferences, DeckCards, Playlist, PlaylistDecks, UserPlaylistStatus) {
                var $httpCache = $cacheFactory.get('$http');
                window.$httpCache = $httpCache;
                var self;
                var _resetSync = function () {
                    var old = self.syncDefer;
                    self.sync.defer = self.syncDefer = $q.defer();
                    self.syncDefer.promise.then(old.resolve, old.reject);
                };

                self = {
                    init : function () {
                        self.sync();
                    },
                    syncDefer : $q.defer(),
                    data : {
                        decks : [],
                        deckStatus : {},
                        cards : [],
                        cardStatus : {},
                        cardStatusByDeck : {},
                        deckCards : {},
                        playlists : [],
                        playlistDecks : {},
                        playlistStatus : {}
                    },
                    resources : ResourceHandler.resources,
                    sync : function () {
                        _resetSync();
                        $httpCache.removeAll();

                        var toPromise = [];
                        // Get Decks and Cards
                        var newDeckcards = DeckCards.query(); // Need to customize return to make it useful; cache is never used
                        toPromise.push(newDeckcards.$promise);
                        // Get UserDeckStatus
                        self.data.deckStatus = {};
                        self.data.deckStatus.$original = UserDeckStatus.queryNoCache();
                        toPromise.push(self.data.deckStatus.$original.$promise);
                        // Get UserCardStatus
                        self.data.cardStatus = {};
                        self.data.cardStatus.$original = UserCardStatus.queryNoCache();
                        toPromise.push(self.data.cardStatus.$original.$promise);
                        // Get Playlists
                        var newPlaylistDecks = PlaylistDecks.queryNoCache();
                        toPromise.push(newPlaylistDecks.$promise);
                        // Get UserPlaylistStatus
                        var newPlaylistStatus = UserPlaylistStatus.queryNoCache();
                        toPromise.push(newPlaylistStatus.$promise);

                        return $q.all(toPromise).then(function () {
                            // Process self.data.deckcards
                            while (self.data.decks.length > 0) { self.data.decks.pop(); }
                            while (self.data.cards.length > 0) { self.data.cards.pop(); }
                            while (self.data.playlists.length > 0) { self.data.playlists.pop(); }
                            for (var attr in self.data.deckCards) {
                                if (self.data.deckCards.hasOwnProperty(attr)) {
                                    delete self.data.deckCards[attr];
                                }
                            }
                            for (var attr2 in self.data.playlistDecks) {
                                if (self.data.playlistDecks.hasOwnProperty(attr2)) {
                                    delete self.data.playlistDecks[attr2];
                                }
                            }

                            // Process Deck Status
                            _.each(self.data.deckStatus.$original, function (status) {
                                self.data.deckStatus[status.deckId] = status;
                                ResourceHandler.addToCache(status.deck);
                                ResourceHandler.addToCache(status, {deck_id : status.deckId});
                                self.data.decks.push(status.deck);
                                self.data.deckCards[status.deck.id] = [[],[]];
                            });

                            // Process Card Status
                            _.each(self.data.cardStatus.$original, function (status) {
                                self.data.cardStatus[status.cardId] = status;
                                if (_.isUndefined(self.data.cardStatusByDeck[status.deckId])) {
                                    self.data.cardStatusByDeck[status.deckId] = [];
                                }
                                self.data.cardStatusByDeck[status.deckId].push(status);
                                //TODO: create summary statistics
                            });

                            angular.forEach(newDeckcards, function (deckcard) {
                                if (!self.data.deckCards[deckcard.deckId]) {
                                    self.data.deckCards[deckcard.deckId] = [[],[]];
                                }
                                ResourceHandler.addToCache(deckcard.card);
                                self.data.cards.push(deckcard.card);
                                var official = angular.isDefined(self.data.cardStatus[deckcard.card.id]) ? 0 : 1; // added first
                                self.data.deckCards[deckcard.deckId][official].push(deckcard.card);
                            });

                            angular.forEach(newPlaylistStatus, function (playlistStatus) {
                                ResourceHandler.addToCache(playlistStatus.playlist);
                                self.data.playlists.push(playlistStatus.playlist);
                                self.data.playlistDecks[playlistStatus.playlist.id] = [];
                            });
                            angular.forEach(newPlaylistDecks, function (playlistDeck) {
                                if (!self.data.playlistDecks[playlistDeck.playlistId]) {
                                    self.data.playlistDecks[playlistDeck.playlistId] = [];
                                }
                                var deck = _.findWhere(self.data.decks, { id : playlistDeck.deckId }); //TODO: improve performance
                                if (angular.isObject(deck)) { self.data.playlistDecks[playlistDeck.playlistId].push(deck); }
                            });

                            ResourceHandler.addListToCache(
                                self.data.decks,
                                ResourceHandler.util.getResourceUri(config.api.deck, { format : 'json' }));
                            ResourceHandler.addListToCache(
                                self.data.deckStatus.$original,
                                ResourceHandler.util.getResourceUri(config.api.userDeckStatus, { format : 'json' }));
                            ResourceHandler.addListToCache(
                                self.data.cardStatus.$original,
                                ResourceHandler.util.getResourceUri(config.api.userCardStatus, { format : 'json' }));
                            angular.forEach(self.data.deckCards, function (cards, deckId) {
                                ResourceHandler.addListToCache(
                                    cards[0],
                                    ResourceHandler.util.getResourceUri(config.api.card, { deck__id : deckId, format : 'json', official : true }));
                                ResourceHandler.addListToCache(
                                    cards[1],
                                    ResourceHandler.util.getResourceUri(config.api.card, { deck__id : deckId, format : 'json', official : false }));
                            });
                            ResourceHandler.addListToCache(
                                self.data.playlists,
                                ResourceHandler.util.getResourceUri(config.api.playlist, { format : 'json' }));
                            angular.forEach(self.data.playlistDecks, function (decks, playlistId) {
                                ResourceHandler.addListToCache(
                                    decks,
                                    ResourceHandler.util.getResourceUri(config.api.deck, { format : 'json', playlist__id : playlistId }));
                            });

                            self.syncDefer.resolve(self);
                        });
                    }
                };
                self.sync.defer = self.syncDefer;

                var wrapActions = function (Model) {
                    // Model Customizations
                    if (angular.isUndefined(original[Model.resourceName])) { original[Model.resourceName] = {}; }
                    original[Model.resourceName].query = Model.query;

                    Model.query = function () {
                        var originalArguments = arguments;
                        var _return = [];
                        var defer = $q.defer();
                        _return.$promise = defer.promise;
                        _return.$resolved = false;

                        // Handle Custom Filters
                        var customFilters = [];
                        if (Model.paramFilters) { customFilters = Model.paramFilters(originalArguments[0]); }


                        (function () {
                            // Then trigger request, hopefully caught by cache. Finally, resolve defer.
                            var originalReturn = original[Model.resourceName].query.apply(Model, originalArguments);
                            originalReturn.$promise.then(function () {
                                var filteredReturn = originalReturn;
                                for (var filter in customFilters) {
                                    if (customFilters.hasOwnProperty(filter)) {
                                        filteredReturn = _.filter(filteredReturn, customFilters[filter]);
                                    }
                                }
                                // Copy results into the object returned
                                angular.forEach(filteredReturn, function (obj) { _return.push(obj); });
                            })['finally'](function () {
                                // And Mark as resolved
                                _return.$resolved = true;
                            }).then(defer.resolve, defer.reject);
                        })(); //Running immediately; //TODO: consider delaying until first sync; see c400629
                        return _return;
                    };
                };
                var original = {};
                wrapActions(Deck, original);
                wrapActions(Card, original);
                wrapActions(UserDeckStatus, original);
                wrapActions(UserCardStatus, original);

                Deck.onUpdateUpdateCache(function (obj) {
                    // Updates the item in cache
                    var cached = _.findWhere(self.data.decks, {id:obj.id});     // Pulls object from cache
                    if (cached) { cached.setValues(obj); }                      // Modifies object in place
                });
                Card.onUpdateUpdateCache(function (obj) {
                    var cached = _.findWhere(self.data.cards, {id:obj.id});
                    if (cached) { cached.setValues(obj); }
                });
                Playlist.onUpdateUpdateCache(function (obj) {
                    var cached = _.findWhere(self.data.playlists, {id:obj.id});
                    if (cached) { cached.setValues(obj); }
                });
                UserDeckStatus.onUpdateUpdateCache(function (obj) {
                    var cached = self.data.deckStatus[obj.deckId];
                    if (cached) { cached.setValues(obj); }
                });
                UserCardStatus.onUpdateUpdateCache(function (obj) {
                    var cached = self.data.cardStatus[obj.cardId];
                    if (cached) { cached.setValues(obj); }
                });
                Deck.on('addDeck', self.sync); // Requires waiting for deck to exist (better than listening on 'Deck-save')
                Deck.on('removeDeck', self.sync);
                Deck.on('addCard', self.sync); // Requires waiting for card to exist (better than listening on 'Card-save')
                Deck.on('delete', self.sync);
                Card.on('delete', self.sync);

                Playlist.on('save', self.sync);
                Playlist.on('addDeckToPlaylist', self.sync);
                Playlist.on('removeDeckFromPlaylist', self.sync);
                Playlist.on('removePlaylist', self.sync);

                return self;
            }
        ])
            .factory('DeckResource', ['$log', '$resource', '$q', '$http', '$cacheFactory',
                '$timeout', '$location', 'main.ngLib.lodash', 'main.membrightapi.resourceHandler',
                'main.membrightapi.config', 'main.membrightapi.track',
                function ($log, $location, $resource, $q, $http, $cacheFactory, $timeout, _, ResourceHandler, config, track) {
                    var modelName = 'Deck';
                    var Model = ResourceHandler.register(modelName, config.getURL('deck'));
                    Model.setStatic({
                        addDeck : function (deck) {
                            return ResourceHandler.util.post(config.api.addDeck, { deck_id : deck.id }).success(function () {
                                Model.broadcast('addDeck', deck);
                                track('addDeck', { deck : deck.id });
                            });
                        },
                        removeDeck : function (deck) {
                            return ResourceHandler.util.post(config.api.removeDeck, { deck_id : deck.id }).success(function () {
                                Model.broadcast('removeDeck', deck);
                                track('removeDeck', { deck : deck.id });
                            });
                        },
                        addCard : function (deck, card) {
                            var param = { deck_id : deck.id, card_id : card.id };
                            return ResourceHandler.util.post(config.api.addCard, param).success(function () {
                                Model.broadcast('addCard', deck);
                                track('addCard', param);
                            });
                        },
                        pathToLandingPage : function (deck) {
                            return '/' + Model.getSafeName(deck) + '/' + deck.id + '/';
                        },
                        drillPath : function (deck, tab) {
                            if (_.isUndefined(tab)) { tab = config.paths.practice; }
                            return '/' + tab + '/' + Model.getSafeName(deck) + '/Deck/' + deck.id;
                        },
                        drill : function (deck, tab) {
                            $location.path(Model.drillPath(deck, tab));
                        },
                        isOwned : function (user, deck) {
                            return user && user.id == deck.ownerId;
                        }
                    });

                    return ResourceHandler.resources[modelName];
                }
            ])
            .factory('CardResource', ['$log', '$resource', '$q', '$http', '$cacheFactory',
                '$timeout', 'main.ngLib.lodash', 'main.membrightapi.resourceHandler',
                'main.membrightapi.config', 'main.membrightapi.track',
                function ($log, $resource, $q, $http, $cacheFactory, $timeout, _, ResourceHandler, config, track) {
                    var modelName = 'Card';
                    var Model = ResourceHandler.register(modelName, config.getURL('card'));
                    Model.setStatic({
                        generateFromFields : function (fields, card) {
                            var obj = {};
                            _.each(fields, function(field) {
                                var value;
                                switch (field.type) {
                                    case 'array':
                                        if (field.subType == 'anchor') { obj[field.name] = []; }
                                        else { obj[field.name] = ['', '']; }
                                        break;
                                    default:
                                        obj[field.name] = '';
                                        break;
                                }
                            });
                            if (card) { return _.defaults(card.obj, obj); }
                            return obj;
                        },
                        getPath : function (card, deck, tab) {
                            if (_.isUndefined(tab)) { tab = config.paths.myDecks; }
                            return '/' + tab + '/' + deck.getSafeName() + '/Deck/' + deck.id + '/Card/' + card.id;
                        },
                        isOwned : function (user, deck) {
                            return user && user.id == deck.ownerId;
                        },
                        createCard : function (cardType, cardObj, cardAccess) {
                            var newCardParams = {
                                type : cardType,
                                content : angular.toJson(cardObj),
                                obj : cardObj,
                                access : cardAccess
                            };
                            var newCard = Model.save(newCardParams,
                                function (card) {
                                    track('createCard', { status : 'saved', card : card.id });
                                }, function () {
                                    track('createCard', { status : 'error' });
                                });
                            return newCard;
                        }
                    });
                    return ResourceHandler.resources[modelName];
                }
            ])
            .factory('UserDeckStatusResource', ['$log', '$resource', '$q', '$http', '$cacheFactory',
                '$timeout', 'main.ngLib.lodash', 'main.membrightapi.resourceHandler',
                'main.membrightapi.config', 'main.membrightapi.track',
                function ($log, $resource, $q, $http, $cacheFactory, $timeout, _, ResourceHandler, config, track) {
                    var modelName = 'UserDeckStatus';
                    var Model = ResourceHandler.register(modelName, config.getURL('userDeckStatus'));

                    Model.setStatic({
                        getPairedDecks: function (Deck, userDeckStatus) {
                            var pairs = [];
                            pairs.stats = { muted: 0 };
                            _.each(userDeckStatus, function (uds) {
                                var muted = uds.content.muted === true;
                                pairs.push({
                                    deck: Deck.get({ id: uds.deckId }),
                                    status: uds,
                                    muted: muted
                                });
                                if (muted) {
                                    pairs.stats.muted++;
                                }
                            });
                            return pairs;
                        }
                    });

                    return ResourceHandler.resources[modelName];
                }
            ])
            .factory('UserCardStatusResource', ['$log', '$resource', '$q', '$http', '$cacheFactory',
                '$timeout', 'main.ngLib.lodash', 'main.ngLib.moment', 'main.membrightapi.resourceHandler',
                'main.membrightapi.config', 'main.membrightapi.track',
                function ($log, $resource, $q, $http, $cacheFactory, $timeout, _, moment, ResourceHandler, config, track) {
                    var modelName = 'UserCardStatus';
                    var Model = ResourceHandler.register(modelName, config.getURL('userCardStatus'));

                    var filters = {
                        due_by : function (value) {
                            return function (obj) {
                                return _.isNull(obj.reviewBy) || moment.utc(value) > moment.utc(obj.reviewBy);
                            };
                        },
                        muted : function (value) {
                            return function (obj) {
                                return obj.muted == (value == 'true');
                            };
                        }
                    };

                    Model.paramFilters = function (params) {
                        var currentFilters = [];
                        for (var param in params) {
                            if (filters[param]) {
                                currentFilters.push(filters[param](params[param]));
                                delete params[param];
                            }
                        }
                        return currentFilters;
                    };

                    var _reviewBy = {};
                    Model.setStatic({
                        getGain : function (cardStatus, now) {
                            if (!_.isObject(cardStatus._now) && !_.isObject(now)) { now = moment.utc(); }
                            if (_.isNull(cardStatus.reviewBy)) { return 1; }
                            if (cardStatus._reviewBy != cardStatus.reviewBy) { delete cardStatus._gain; }

                            if (_.isUndefined(cardStatus._gain) || cardStatus._now != now && _.isObject(now)) {
                                if (now) { cardStatus._now = now; }
                                var t = cardStatus._now.diff(moment.utc(cardStatus.updatedAt), 'minutes') / 60;
                                t = _.max([0.03, t]);
                                //TODO: move constants to config (p = .3)
                                var sigma = _.max([0.2, cardStatus.correctStreak]);
                                var likely = Math.exp(-1 * 0.3 * t / Math.pow(sigma, 3));

                                if (cardStatus.correctStreak === 0) { likely = likely / 2; }

                                cardStatus._gain = 1 - likely;
                                cardStatus._reviewBy = cardStatus.reviewBy;
                            }
                            return cardStatus._gain;
                        },
                        getTargetDueDate : function (cardStatus, targetTrigger) {
                            //TODO: move constants to config (p = .3)
                            var hours = (-1) * Math.pow(cardStatus.correctStreak, 3) * Math.log(targetTrigger) / 0.3;
                            hours = _.max([0.03, hours]);
                            //TODO: decide if function should always assume from now
                            return moment.utc(cardStatus.updatedAt).add(hours, 'hours');
                        },
                        getState : function (cardStatus, now) {
                            var gain = cardStatus.getGain(now);
                            var state;
                            if (_.isNull(cardStatus.reviewBy)) { state = 'new'; }
                            else if (cardStatus.correctStreak === 0) { state = 'due'; }
                            else if (gain < 0.05) { state = 'primed'; }
                            else if (gain < 0.3) { state = 'known'; }
                            else { state = 'due'; }
                            return state;
                        },
                        getReviewBy : function (cardStatus) {
                            if (_.isUndefined(_reviewBy[cardStatus.reviewBy])) {
                                _reviewBy[cardStatus.reviewBy] = moment.utc(cardStatus.reviewBy);
                            }
                            return _reviewBy[cardStatus.reviewBy];
                        }
                    });

                    return ResourceHandler.resources[modelName];
                }
            ])
            .factory('AnswerLogResource', ['$log', '$resource', '$q', '$http', '$cacheFactory',
                '$timeout', 'main.membrightapi.resourceHandler',
                'main.membrightapi.config', 'main.membrightapi.track',
                function ($log, $resource, $q, $http, $cacheFactory, $timeout, ResourceHandler, config, track) {
                    var modelName = 'AnswerLog';
                    var Model = ResourceHandler.register(modelName, config.getURL('answerLog'));
                    ResourceHandler.resources[modelName].STATE = {
                        RIGHT_ANSWER : 'R',
                        WRONG_ANSWER : 'W',
                        PASS_ANSWER : 'P'
                    };
                    return ResourceHandler.resources[modelName];
                }
            ])
            .factory('UserPreferencesResource', ['$log', '$resource', '$q', '$http', '$cacheFactory',
                '$timeout', 'main.membrightapi.resourceHandler',
                'main.membrightapi.config', 'main.membrightapi.track',
                function ($log, $resource, $q, $http, $cacheFactory, $timeout, ResourceHandler, config, track) {
                    var modelName = 'UserPreferences';
                    var Model = ResourceHandler.register(modelName, config.getURL('userPreferences'));
                    return ResourceHandler.resources[modelName];
                }
            ])
            .factory('DeckCardsResource', ['$log', '$resource', '$q', '$http', '$cacheFactory',
                '$timeout', 'main.membrightapi.resourceHandler',
                'main.membrightapi.config', 'main.membrightapi.track',
                function ($log, $resource, $q, $http, $cacheFactory, $timeout, ResourceHandler, config, track) {
                    var modelName = 'DeckCard';
                    var Model = ResourceHandler.register(modelName, config.getURL('deckCard'));
                    return ResourceHandler.resources[modelName];
                }
            ])
            .factory('PlaylistResource', ['$log', '$resource', '$q', '$http', '$cacheFactory',
                    '$timeout', 'main.ngLib.lodash', 'main.membrightapi.resourceHandler',
                'main.membrightapi.config', 'main.membrightapi.track',
                function ($log, $resource, $q, $http, $cacheFactory, $timeout, _, ResourceHandler, config, track) {
                    var modelName = 'Playlist';
                    var Model = ResourceHandler.register(modelName, config.getURL('playlist'));

                    Model.setStatic({
                        create : function (name, image, content, access) {
                            var obj = {
                                name : name,
                                image : image,
                                content : content,
                                access : access === true ? 'pr' : 'pu'
                            };
                            var newInstance = ResourceHandler.util.create(Model, obj, track);
                            return newInstance;
                        },
                        getPath : function (playlist, tab) {
                            if (_.isUndefined(tab)) { tab = config.paths.practice; }
                            return '/' + tab + '/' + Model.getSafeName(playlist) + '/' + modelName + '/' + playlist.id;
                        },
                        addDeck : function (playlist, deck) {
                            return ResourceHandler.util.post(config.api.addDeckToPlaylist, { playlist_id : playlist.id, deck_id : deck.id }).success(function () {
                                Model.broadcast('addDeckToPlaylist', playlist, deck);
                                track('addDeckToPlaylist', { deck : deck.id });
                            });
                        },
                        removeDeck : function (playlist, deck) {
                            return ResourceHandler.util.post(config.api.removeDeckFromPlaylist, { playlist_id : playlist.id, deck_id : deck.id }).success(function () {
                                Model.broadcast('removeDeckFromPlaylist', playlist, deck);
                                track('removeDeckFromPlaylist', { deck : deck.id });
                            });
                        },
                        addPlaylist : function (playlist) {
                            return ResourceHandler.util.post(config.api.addPlaylist, { playlist_id : playlist.id }).success(function () {
                                Model.broadcast('addPlaylist', playlist);
                                track('addPlaylist', { playlist : playlist.id });
                            });
                        },
                        removePlaylist : function (playlist) {
                            return ResourceHandler.util.post(config.api.removePlaylist, { playlist_id : playlist.id }).success(function () {
                                Model.broadcast('removePlaylist', playlist);
                                track('removePlaylist', { playlist : playlist.id });
                            });
                        },
                        loadPlaylist : function(playlistId) {
                            var playlist = Model.get({id : playlistId, decks : true, cards : true}, function (playlist) {
                                ResourceHandler.addListToCache(
                                    playlist.decks,
                                    ResourceHandler.util.getResourceUri(config.api.deck, { format : 'json', in_market : true, playlist__id : playlist.id }));
                                _.each(playlist.decks, function (deck) {
                                    ResourceHandler.addToCache(deck);
                                    // Skipped caching cards because of complexity of official v. non-official
                                });
                            });
                            return playlist;
                        }
                    });

                    return ResourceHandler.resources[modelName];
                }
            ])
            .factory('PlaylistDecksResource', ['$log', '$resource', '$q', '$http', '$cacheFactory',
                '$timeout', 'main.membrightapi.resourceHandler',
                'main.membrightapi.config', 'main.membrightapi.track',
                function ($log, $resource, $q, $http, $cacheFactory, $timeout, ResourceHandler, config, track) {
                    var modelName = 'PlaylistDecks';
                    var Model = ResourceHandler.register(modelName, config.getURL('playlistDecks'));
                    return ResourceHandler.resources[modelName];
                }
            ])
            .factory('UserPlaylistStatusResource', ['$log', '$resource', '$q', '$http', '$cacheFactory',
                '$timeout', 'main.membrightapi.resourceHandler',
                'main.membrightapi.config', 'main.membrightapi.track',
                function ($log, $resource, $q, $http, $cacheFactory, $timeout, ResourceHandler, config, track) {
                    var modelName = 'UserPlaylistStatus';
                    var Model = ResourceHandler.register(modelName, config.getURL('userPlaylistStatus'));
                    return ResourceHandler.resources[modelName];
                }
            ]);

    };

});

