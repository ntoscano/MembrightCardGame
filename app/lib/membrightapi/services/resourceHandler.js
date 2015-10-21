'use strict';
var servicename = 'resourceHandler';

module.exports = function(app) {

    var dependencies = ['$log', '$resource', '$q', '$http', '$cacheFactory', '$timeout', '$rootScope', 'main.ngLib.jQuery', 'main.ngLib.lodash', 'main.membrightapi.config'];

    function service($log, $resource, $q, $http, $cacheFactory, $timeout, $rootScope, $, _, config) {
        var $httpCache = $cacheFactory.get('$http');
        $httpCache._put = $httpCache.put; $httpCache._cache = {};
        $httpCache.put = function (k,v) { $httpCache._put(k,v); $httpCache._cache[k]=v;}
        var $resourceListener = $rootScope.$new(true);
        var self = {
            resources : {},
            init : function () {
                $http.defaults.xsrfCookieName = 'csrftoken';
                $http.defaults.xsrfHeaderName = 'X-CSRFToken';
                //TODO: load cache from localstorage
            },
            register : function (name, apiUrl, format) {
                if (_.isUndefined(apiUrl)) { throw 'Cannot Register Resource' + name + ': apiUrl is undefined'; }
                if (typeof format == 'undefined') { format = { id : '@id', format : 'json'}; }
                var resource = $resource(apiUrl, format, self._actions(name));
                resource.resourceName = name;
                resource.resourceUrl = apiUrl;
                self.resources[name] = resource;

                self.util.setStatic(resource, name, self._static(name));

                return resource;
            },
            addToCache : function (obj, uniqueParam) {
                if (uniqueParam && !_.isObject(uniqueParam)) {
                    uniqueParam = undefined;
                }
                if (_.isString(obj.resourceUri)) {
                    var cacheKey = obj.resourceUri + '?format=json';
                    if (uniqueParam) {
                        cacheKey = obj.resourceUri.substr(0, obj.resourceUri.lastIndexOf('/'));
                        cacheKey += '?' + $.param(uniqueParam) + '&format=json';
                    }
                    if (cacheKey.indexOf('/') === 0 && config.server) { cacheKey = config.server + cacheKey; }
                    if (uniqueParam) { self.addListToCache([obj], cacheKey); }
                    else { $httpCache.put(cacheKey, obj); }
                    //TODO: put in localStorage
                }
            },
            addListToCache : function (objects, cacheKey) {
                var cache = {
                    meta : {
                        limit: 0,
                        next: null,
                        offset: 0,
                        previous: null,
                        totalCount: objects.length
                    },
                    objects : objects
                };
                $httpCache.put(cacheKey, cache);
            },
            _static : function (ModelName) {
                self.resources[ModelName].onUpdateUpdateCache = function (callback) {
                    //This method must be called on a model for the list cache to be updated; callback optional
                    //TODO: (improvement) enable cache update by default, adding callback as a separate listener
                    var cacheKey = self.util.getResourceUri(this.resourceUrl, { format : 'json' });
                    this.on('update', function (event, obj) {
                        // get cache
                        var value = $httpCache.get(cacheKey);
                        if (_.isUndefined(value)) { return; }
                        // modify cache
                        var oldObj = _.findWhere(value.objects, { id : obj.id });
                        // put updated value into cache (modified in place)
                        self.util.setValues(oldObj, obj);
                        if (_.isFunction(callback)) { callback(obj); }
                    });
                };
                self.resources[ModelName].on = function (name, listener) {
                    return $resourceListener.$on(ModelName + '-' + name, listener);
                };
                self.resources[ModelName].broadcast = function (name, args) {
                    return $resourceListener.$broadcast(ModelName + '-' + name, args);
                };
                self.resources[ModelName].setStatic = function (_static) {
                    self.util.setStatic(self.resources[ModelName], ModelName, _static);
                };
                return {
                    getSafeName : function (obj) {
                        var name = obj.name;
                        if (!_.isString(name)) { name = ModelName + ' ' + obj.id; }
                        return encodeURIComponent(name.replace(/[\:\? \/]/g, '_'));
                    },
                    setValues : self.util.setValues
                };
            },
            _actions : function (name) {
                return {
                    query : {
                        method : 'GET', isArray : true, cache : true,
                        transformResponse : function (txt) {
                            var data = angular.fromJson(txt);
                            angular.forEach(data.objects, self.addToCache);
                            return data.objects;
                        }
                    },
                    queryNoCache : {
                        method : 'GET', isArray : true, cache : false,
                        transformResponse : function (txt) {
                            var data = angular.fromJson(txt);
                            angular.forEach(data.objects, self.addToCache);
                            return data.objects;
                        }
                    },
                    save : {
                        method : 'POST',
                        interceptor : {
                            response : function (result) {
                                self.resources[name].broadcast('save', result.resource);
                                return result;
                            },
                            responseError : function (result) {
                                return result;
                            }
                        }
                    },
                    update : {
                        method : 'PATCH',
                        transformRequest : function (data, headersGetter) {
                            //TODO: Use JSON Field in back end to avoid this on front end
                            if (angular.isObject(data.obj)) {
                                data.content = angular.toJson(data.obj);
                            }
                            self.addToCache(data);
                            //TODO: put in localStorage
                            return angular.toJson(data);
                        },
                        interceptor : {
                            response : function (result) {
                                self.resources[name].broadcast('update', result.resource);
                                return result;
                            },
                            responseError : function (result) {
                                return result;
                            }
                        }
                    },
                    delete : {
                        method : 'DELETE',
                        interceptor : {
                            response : function (result) {
                                self.resources[name].broadcast('delete', result.resource);
                                return result;
                            },
                            responseError : function (result) {
                                return result;
                            }
                        }
                    },
                    get : { method : 'GET', cache : true },
                    getNoCache : { method : 'GET', cache : false },
                    getOne : {
                        method : 'GET', isArray : false, cache : true,
                        transformResponse : function (txt) {
                            //TODO: put in localStorage
                            return txt.length === 0 ? null : angular.fromJson(txt).objects[0];
                        }
                    }
                };
            },
            util : {
                post : function (url, param) {
                    return $http.post(url, $.param(param),
                        { headers: { 'Content-Type': 'application/x-www-form-urlencoded'} }
                    );
                },
                getResourceUri : function (uri, param) {
                    if (param.id) {
                        uri = uri.replace(':id', param.id);
                        delete param.id;
                    }
                    uri = uri.replace('/:id/', '');
                    if (_.size(param)) { uri += '?' + $.param(param); }
                    if (uri.indexOf('/') === 0) { uri = config.server + uri; }
                    return uri;
                },
                setValues : function (dest, source) {
                    for (var key in source) {
                        if (key.indexOf('$') !== 0 && key.indexOf('_') !== 0) { dest[key] = source[key]; }
                    }
                },
                setStatic : function(resource, name, _static) {
                    angular.forEach(_static, function (obj, key) {
                        resource[key] = obj;
                        resource.prototype[key] = function () {
                            var args = Array.prototype.slice.call(arguments, 0);
                            args.unshift(this);
                            return resource[key].apply(resource, args);
                        };
                    });
                },
                create : function (resource, obj, log) {
                    var newInstance = resource.save(obj,
                        function (instance) {
                            log.track('create' + resource.modelName, { status : 'saved', id : instance.id });
                        }, function () {
                            log.track('create' + resource.modelName, { status : 'error' });
                        });
                    return newInstance;
                }
            }
        };
        return self;

    }
    service.$inject = dependencies;
    app.factory(app.name + '.' + servicename, service);
};

