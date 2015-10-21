'use strict';
var constantname = 'config';
module.exports = function(app) {
    app.constant(app.name + '.' + constantname, {
        getURL: function (api) {
            return this.server ? this.server + this.api[api] : this.api[api];
        },
        me: '/api/v2/me',
        fbConnect: '/facebook/connect',
        signOut: '/api/v2/me/signout/',

        api : {
            deck: '/api/v2/deck/:id/',
            addDeck: '/api/v2/custom/add_deck',
            removeDeck: '/api/v2/custom/remove_deck',
            addPlaylist: '/api/v2/custom/add_playlist',
            addDeckToPlaylist: '/api/v2/custom/add_deck_to_playlist',
            removeDeckFromPlaylist: '/api/v2/custom/remove_deck_from_playlist',
            removePlaylist: '/api/v2/custom/remove_playlist',
            addCard: '/api/v2/custom/add_card',
            card: '/api/v2/card/:id/',
            userCardStatus: '/api/v2/usercardstatus/:id/',
            userDeckStatus: '/api/v2/userdeckstatus/:id/',
            deckCard: '/api/v2/deck-cards/:id/',
            playlistDecks: '/api/v2/playlist-decks/:id/',
            userPlaylistStatus: '/api/v2/userplayliststatus/:id/',
            answerLog: '/api/v2/answerlog/:id/',
            me: '/api/v2/me',
            userPreferences: '/api/v2/userpreferences/:id/',
            playlist: '/api/v2/playlist/:id/',
            account: {
                signIn: '/api/v2/me/signin/',
                signOut: '/api/v2/me/signout/',
                signUp: '/api/v2/me/signup/'
            }
        }
    });
};