(function() {
    'use strict';

    angular
        .module('yavi')
        .factory('wikipediaApi', factoryFunction);

    /** @ngInject */
    function factoryFunction(WikipediaApiError, WikipediaPageDataProvider, $interpolate, $timeout, $http, $log) {

        var factory = {};

        var pageDataProviders = {};

        factory.getPageDataProvider = function(wikipediaSourceId, pageId) {
            
            if (!_.has(pageDataProviders, wikipediaSourceId)) {
                pageDataProviders[wikipediaSourceId] = {};
            }
            if (!_.has(pageDataProviders[wikipediaSourceId], pageId)) {
                pageDataProviders[wikipediaSourceId][pageId] = new WikipediaPageDataProvider(wikipediaSourceId, pageId);
            }
            return pageDataProviders[wikipediaSourceId][pageId];
        }

        factory.multiSearch = function(query) {
            var moreLikePromise = searchMoreLike(query);
            var inTitlePromise = searchInTitle(query);
            var textPromise = searchText(query);
            return [moreLikePromise, inTitlePromise, textPromise];
        }

        function searchMoreLike(query) {
            return $timeout(function() {
                return $http
                    .jsonp(buildSearchMoreLikeQuery(query))
                    .then(onSuccess)
                    .catch(onError);
            }, 2000);

            function onSuccess(response) {
                if (angular.isDefined(response)
                        && angular.isDefined(response.data)
                        && angular.isDefined(response.data.query)
                        && angular.isArray(response.data.query.search)) {
                    var searchResults = response.data.query.search;
                    var validSearchResults = _.filter(searchResults, function(searchResult) {
                        return _.has(searchResult, 'title');
                    });
                    var pageTitles = _.pluck(validSearchResults, 'title');
                    var pageIdPromises = _.map(pageTitles, function(pageTitle) {
                        return findPageIdByTitle(pageTitle)
                            .then(function(pageId) {
                                return {query: query, pageId: pageId};
                            });
                    });
                    return {query: query, resultSet: pageIdPromises};
                }
                onError();
            }

            function onError() {
                throw new WikipediaApiError(0, " not found.");
            }
        }

        function searchInTitle(query) {
            return $http
                .jsonp(buildSearchInTitleQuery(query))
                .then(onSuccess)
                .catch(onError);

            function onSuccess(response) {
                if (angular.isDefined(response)
                        && angular.isDefined(response.data)
                        && angular.isDefined(response.data.query)
                        && angular.isArray(response.data.query.search)) {
                    var searchResults = response.data.query.search;
                    var validSearchResults = _.filter(searchResults, function(searchResult) {
                        return _.has(searchResult, 'title');
                    });
                    var pageTitles = _.pluck(validSearchResults, 'title');
                    var pageIdPromises = _.map(pageTitles, function(pageTitle) {
                        return findPageIdByTitle(pageTitle)
                            .then(function(pageId) {
                                return {query: query, pageId: pageId};
                            });
                    });
                    return {query: query, resultSet: pageIdPromises};
                }
                onError();
            }

            function onError() {
                throw new WikipediaApiError(0, " not found.");
            }
        }

        function searchText(query) {
            return $timeout(function() {
                return $http
                    .jsonp(buildSearchTextQuery(query))
                    .then(onSuccess)
                    .catch(onError);
            }, 1000);

            function onSuccess(response) {
                if (angular.isDefined(response)
                        && angular.isDefined(response.data)
                        && angular.isDefined(response.data.query)
                        && angular.isArray(response.data.query.search)) {
                    var searchResults = response.data.query.search;
                    var validSearchResults = _.filter(searchResults, function(searchResult) {
                        return _.has(searchResult, 'title');
                    });
                    var pageTitles = _.pluck(validSearchResults, 'title');
                    var pageIdPromises = _.map(pageTitles, function(pageTitle) {
                        return findPageIdByTitle(pageTitle)
                            .then(function(pageId) {
                                return {query: query, pageId: pageId};
                            });
                    });
                    return {query: query, resultSet: pageIdPromises};
                }
                onError();
            }

            function onError() {
                throw new WikipediaApiError(0, " not found.");
            }
        }

        function findPageIdByTitle(pageTitle) {
            return $http
                .jsonp(buildPageIdByTitleQuery(pageTitle))
                .then(onSuccess)
                .catch(onError);

            function onSuccess(response) {
                if (angular.isDefined(response)
                        && angular.isDefined(response.data)
                        && angular.isDefined(response.data.query)
                        && angular.isDefined(response.data.query.pages)) {
                    for (var page in response.data.query.pages) {
                        return page;
                    }
                }
                onError();
            }

            function onError() {
                throw new WikipediaApiError(0, " not found.");
            }
        }

        function buildSearchMoreLikeQuery(query) {
            var queryTemplate = "https://en.wikipedia.org/w/api.php?";
            queryTemplate += "&action=query";
            queryTemplate += "&list=search";
            queryTemplate += "&srsearch=morelike:{{searchQuery}}";
            queryTemplate += "&srlimit=10";
            queryTemplate += "&srprop=";
            queryTemplate += "&format=json";
            queryTemplate += "&callback=JSON_CALLBACK";
            return $interpolate(queryTemplate)({ searchQuery: query });
        }
        
        function buildSearchInTitleQuery(query) {
            var queryTemplate = "https://en.wikipedia.org/w/api.php?";
            queryTemplate += "&action=query";
            queryTemplate += "&list=search";
            queryTemplate += "&srsearch=intitle:{{searchQuery}}~";
            queryTemplate += "&srlimit=10";
            queryTemplate += "&srprop=";
            queryTemplate += "&format=json";
            queryTemplate += "&callback=JSON_CALLBACK";
            return $interpolate(queryTemplate)({ searchQuery: query });
        }
        
        function buildSearchTextQuery(query) {
            var queryTemplate = "https://en.wikipedia.org/w/api.php?";
            queryTemplate += "&action=query";
            queryTemplate += "&list=search";
            queryTemplate += "&srsearch={{searchQuery}}";
            queryTemplate += "&srwhat=text";
            queryTemplate += "&srlimit=10";
            queryTemplate += "&srprop=";
            queryTemplate += "&continue=";
            queryTemplate += "&format=json";
            queryTemplate += "&callback=JSON_CALLBACK";
            return $interpolate(queryTemplate)({ searchQuery: query });
        }

        function buildPageIdByTitleQuery(pageTitle) {
            var queryTemplate = "https://en.wikipedia.org/w/api.php?";
            queryTemplate += "&action=query";
            queryTemplate += "&titles={{pageTitle}}";
            queryTemplate += "&prop=";
            queryTemplate += "&format=json";
            queryTemplate += "&callback=JSON_CALLBACK";
            return $interpolate(queryTemplate)({ pageTitle: pageTitle });
        }

        return factory;
    }

})();
