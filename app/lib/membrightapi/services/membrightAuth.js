'use strict';
var servicename = 'membrightAuth';

define(function(require, exports, module){
    module.exports = function(app) {

        var dependencies = ['$httpProvider', 'main.ngLib.jQuery', 'main.ngLib.lodash', 'main.membrightapi.config'];

        function service($httpProvider, $, _, apiConfig) {
            var isInitialized, fbAppId, fbPermissions, appConfig;
            var init;
            isInitialized = false;
            init = function (_appConfig) {
                _.defaults(apiConfig, _appConfig);
                $httpProvider.defaults.xsrfCookieName = 'csrftoken';
                $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
                $httpProvider.defaults.withCredentials = true;

                $httpProvider.interceptors.push(['$browser', function($browser) {
                    return {
                        'request': function(config) {
                            if (config.method == 'POST') {
                                var xsrfValue = $browser.cookies()[config.xsrfCookieName || $httpProvider.defaults.xsrfCookieName];
                                config.headers[(config.xsrfHeaderName || $httpProvider.defaults.xsrfHeaderName)] = xsrfValue;
                            }
                            return config;
                        }
                    };
                }]);

                isInitialized = true;
                appConfig = _appConfig;
                fbAppId = _appConfig.fbAppId;
                fbPermissions = ['public_profile', 'email', 'user_friends'];
                /*
                 * Note: fbAsyncInit should run immediately to avoid race condition, so it cannot wait for services.
                 */
                window.fbAsyncInit = function () {
                    window.FB.init({
                        appId      : fbAppId,
                        cookie     : true,
                        xfbml      : true,
                        version    : 'v2.0'
                    });
                };
            };

            return {
                // initialization
                init: init,

                $get: ['main.ngLib.jQuery', 'main.ngLib.lodash', '$window', '$http', '$location', '$localStorage', 'main.ngLib.facebookConnectPlugin',
                    function($, _, $window, $http, $location, $localStorage, facebookConnectPlugin) {
                        var self;
                        self = {
                            isInitialized: isInitialized,

                            /**
                             * Returns the user from local storage. If the user is not null, it goes on to confirm that
                             * the user still is authorized on the server.
                             *
                             * Use Case 1: User has never logged in previously. No local user and no server authorization.
                             * Use Case 2: User has just logged in. No local user, but there is server authorization.
                             * Use Case 3: User has previously logged in and is still authorized.
                             * Use Case 4: User has previously, but is no longer authorized or is offline.
                             *
                             * Offline is a special version of previous cases.
                             */
                            getUser: function (success, fail) {
                                if ($localStorage.user) {
                                    success($localStorage.user);
                                    $http({
                                        url: appConfig.server + apiConfig.me,
                                        responseType:'json'
                                    }).then(function (user) {
                                        // Use Case 3
                                        // Local user has access to the server. Update local data.
                                        // End load with user
                                        // NOOP: confirmed previous call to success
                                    }, function () {
                                        // Use Case 4
                                        // Local user is no longer authorized or offline.
                                        // End load with no user
                                        fail();
                                        //TODO: handle offline
                                    });
                                } else {
                                    // Local Storage has not been populated. Check for log in.
                                    $http({
                                        url: appConfig.server + apiConfig.me,
                                        responseType: 'json'
                                    }).then(function (user) {
                                        // Use Case 2
                                        // First login! Set local user and data.
                                        $localStorage.user = user;
                                        // End load with user
                                        success(user);
                                    }, function () {
                                        // Use Case 1
                                        // Not logged in or offline
                                        // End load with no user
                                        fail();
                                        //TODO: handle offline
                                    });
                                }
                                return $localStorage.user;
                            },

                            logIn : {
                                facebook : function (success, fail) {
                                    if (cordova.platformId == 'browser') {
                                        var mb_connect = self.buildUrl(appConfig.server + apiConfig.fbConnect + '/?attempt=1&' + $.param({ next : $location.absUrl() }));
                                        var fbLoginUrl = 'https://www.facebook.com/dialog/oauth?' + $.param({
                                            client_id : fbAppId,
                                            response_type : 'code',
                                            scope : fbPermissions,
                                            redirect_uri : mb_connect
                                        });
                                        $window.location.assign(fbLoginUrl);
                                    } else {
                                        facebookConnectPlugin.get().login(fbPermissions, function(response) {
                                            var mb_connect = self.buildUrl(appConfig.server + apiConfig.fbConnect + '/?attempt=1&' + $.param({
                                                access_token : response.authResponse.accessToken,
                                                next: appConfig.server + apiConfig.me
                                            }));
                                            $.ajax({
                                                dataType: 'json',
                                                url: mb_connect,
                                                xhrFields: {withCredentials: true}
                                            }).then(function (user) {
                                                success(user);
                                            }, function () {
                                                fail();
                                            });

                                        }, function () {
                                            fail();
                                        });
                                    }

                                }
                            },
                            buildUrl : function (uri, relative, hash) {
                                var url = '';
                                if (url.indexOf('/') === 0) {
                                    url += $location.protocol() + '://' + $location.host();
                                    if (!_.contains([80, 443], $location.port())) { url += ':' + $location.port(); }
                                }
                                if (relative) { url += $window.location.pathname; }
                                url += uri;
                                if (hash) { url += '#' + hash; }
                                return url;
                            },
                            logOut : function () {
                                delete $localStorage.user;
                                $localStorage.$save();
                                return $http({
                                    url: appConfig.server + apiConfig.signOut,
                                    responseType:'json'
                                });
                            }

                        };
                        return self;
                    }
                ]
            };

        }
        service.$inject = dependencies;

        app.provider(app.name + '.' + servicename, service);
    }; 
});