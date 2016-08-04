(function() {
    'use strict';

    angular
        .module('yavi')
        .factory('wikipediaApi', factoryFunction);

    /** @ngInject */
    function factoryFunction(
                $http,
                $interpolate,
                WikipediaApiError
            ) {

        var factory = {};

        factory.requestPageBasicData = _.memoize(requestPageBasicData, memoizeHashFunction);
        factory.requestPageCategoryList = _.memoize(requestPageCategoryList, memoizeHashFunction);
        factory.requestPageThumbnail = _.memoize(requestPageThumbnail, memoizeHashFunction);
        factory.search = _.memoize(search, memoizeHashFunction);
        factory.getPageIdByTitle = _.memoize(getPageIdByTitle, memoizeHashFunction);

        return factory;

        /**
         *
         */
        function requestPageBasicData(wikipediaId, pageId) {
            
            return doHttpRequest(buildRequestUrl(), onSuccess, onError);

            function buildRequestUrl() {
                var urlTemplate = 'https://{{wikipediaId}}.wikipedia.org/w/api.php?';
                urlTemplate += '&pageids={{pageId}}';
                urlTemplate += '&action=query';
                urlTemplate += '&prop=extracts';
                urlTemplate += '&exintro=';
                urlTemplate += '&format=json';
                urlTemplate += '&callback=JSON_CALLBACK';
                var scope = buildRequestPageUrlScope(wikipediaId, pageId);
                return $interpolate(urlTemplate)(scope);
            }

            function onSuccess(response) {
                if (angular.isDefined(response) &&
                        angular.isDefined(response.data) &&
                        angular.isDefined(response.data.query) &&
                        angular.isDefined(response.data.query.pages) &&
                        _.has(response.data.query.pages, pageId)) {
                    return response.data.query.pages[pageId];
                }
                onError();
            }

            function onError() {
                var errorMessage = buildPageRequestErrorMessage(wikipediaId,
                                    pageId, "Basic page data");
                throw new WikipediaApiError(errorMessage);
            }
        }

        /**
         *
         */
        function requestPageCategoryList(wikipediaId, pageId) {
            
            return doHttpRequest(buildRequestUrl(), onSuccess, onError);

            function buildRequestUrl() {
                var urlTemplate = 'https://{{wikipediaId}}.wikipedia.org/w/api.php?';
                urlTemplate += '&pageids={{pageId}}';
                urlTemplate += '&action=query';
                urlTemplate += '&prop=categories';
                urlTemplate += '&clshow=!hidden';
                urlTemplate += '&format=json';
                urlTemplate += '&callback=JSON_CALLBACK';
                var scope = buildRequestPageUrlScope(wikipediaId, pageId);
                return $interpolate(urlTemplate)(scope);
            }

            function onSuccess(response) {
                if (angular.isDefined(response) &&
                        angular.isDefined(response.data) &&
                        angular.isDefined(response.data.query) &&
                        angular.isDefined(response.data.query.pages) &&
                        _.has(response.data.query.pages, pageId) &&
                        angular.isDefined(response.data.query.pages[pageId].categories)) {
                    var categories = response.data.query.pages[pageId].categories;
                    return _.pluck(categories, "title");
                }
                onError();
            }

            function onError() {
                var errorMessage = buildPageRequestErrorMessage(wikipediaId,
                                    pageId, "Category list");
                throw new WikipediaApiError(errorMessage);
            }
        }

        /**
         *
         */
        function requestPageThumbnail(wikipediaId, pageId) {
            
            return doHttpRequest(buildRequestUrl(), onSuccess, onError);

            function buildRequestUrl() {
                var urlTemplate = 'https://{{wikipediaId}}.wikipedia.org/w/api.php?';
                urlTemplate += '&pageids={{pageId}}';
                urlTemplate += '&action=query';
                urlTemplate += '&prop=pageimages';
                urlTemplate += '&pithumbsize=400';
                urlTemplate += '&format=json';
                urlTemplate += '&callback=JSON_CALLBACK';
                var scope = buildRequestPageUrlScope(wikipediaId, pageId);
                return $interpolate(urlTemplate)(scope);
            }

            function onSuccess(response) {
                if (angular.isDefined(response)
                        && angular.isDefined(response.data)
                        && angular.isDefined(response.data.query)
                        && angular.isDefined(response.data.query.pages)
                        && _.has(response.data.query.pages, pageId)
                        && angular.isDefined(response.data.query.pages[pageId].thumbnail)
                        && angular.isDefined(response.data.query.pages[pageId].thumbnail.source)) {
                    return response.data.query.pages[pageId].thumbnail.source;
                }
                onError();
            }

            function onError() {
                var errorMessage = buildPageRequestErrorMessage(wikipediaId,
                                    pageId, "Thumbnail");
                throw new WikipediaApiError(errorMessage);
            }
        }

        /**
         *
         */
        function search(wikipediaId, queryString) {
            
            return doHttpRequest(buildRequestUrl(), onSuccess, onError);

            function buildRequestUrl() {
                var urlTemplate = 'https://{{wikipediaId}}.wikipedia.org/w/api.php?';
                urlTemplate += "&action=opensearch";
                urlTemplate += "&search={{queryString}}";
                urlTemplate += "&namespace=0";
                urlTemplate += "&limit=10";
                urlTemplate += "&suggest=true";
                urlTemplate += "&format=json";
                urlTemplate += "&formatversion=2";
                urlTemplate += "&callback=JSON_CALLBACK";
                return $interpolate(urlTemplate)({
                    wikipediaId: wikipediaId,
                    queryString: queryString
                });
            }

            function onSuccess(response) {
                if (angular.isDefined(response) &&
                        angular.isArray(response.data) &&
                        response.data.length === 4 &&
                        angular.isArray(response.data[1])) {
                    return response.data[1];
                }
                onError();
            }

            function onError() {
                throw new WikipediaApiError("Search failed.");
            }
        }

        /**
         *
         */
        function getPageIdByTitle(wikipediaId, pageTitle) {
            
            return doHttpRequest(buildRequestUrl(), onSuccess, onError);

            function buildRequestUrl() {
                var urlTemplate = 'https://{{wikipediaId}}.wikipedia.org/w/api.php?';
                urlTemplate += '&action=query';
                urlTemplate += '&titles={{pageTitle}}';
                urlTemplate += '&prop=';
                urlTemplate += '&format=json';
                urlTemplate += '&callback=JSON_CALLBACK';
                return $interpolate(urlTemplate)({
                    wikipediaId: wikipediaId,
                    pageTitle: pageTitle
                });
            }

            function onSuccess(response) {
                if (angular.isDefined(response) &&
                        angular.isDefined(response.data) &&
                        angular.isDefined(response.data.query) &&
                        angular.isDefined(response.data.query.pages)) {
                    for (var pageId in response.data.query.pages) {
                        return pageId;
                    }
                }
                onError();
            }

            function onError() {
                throw new WikipediaApiError("Page ID could not be retreived.");
            }
        }

        /**
         *
         */
        function doHttpRequest(url, onSuccess, onError) {
            return $http.jsonp(url).then(onSuccess).catch(onError);
        }

        /**
         *
         */
        function buildRequestPageUrlScope(wikipediaId, pageId) {
            return {
                wikipediaId: wikipediaId,
                pageId: pageId
            };
        }

        /**
         *
         */
        function buildPageRequestErrorMessage(wikipediaId, pageId, item) {
            var messageTemplate = "{{item}} could not be retreived.";
            messageTemplate += " | Wikipedia ID: {{wikipediaId}}, Page ID: {{pageId}}.";
            var scope = {
                item: item,
                wikipediaId: wikipediaId,
                pageId: pageId
            };
            return $interpolate(messageTemplate)(scope);
        }

        /**
         *
         */
        function memoizeHashFunction(firstArgument, secondArgument) {
            return firstArgument + "::::" + secondArgument;
        }
    }

})();
