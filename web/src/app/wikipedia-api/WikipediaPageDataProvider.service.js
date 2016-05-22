(function() {
    'use strict';

    angular
        .module('yavi')
        .service('WikipediaPageDataProvider', serviceFunction);

    /** @ngInject */
    function serviceFunction(yaviCached, $http, $interpolate, $log) {

        return function(pageId) {

            var self = this;

            self.pageId = pageId;

            self.fetchBasicData = yaviCached(function() {
                return $http
                    .jsonp(self.buildBasicDataQuery())
                    .then(onSuccess)
                    .catch(onError);

                function onSuccess(response) {
                    if (angular.isDefined(response)
                            && angular.isDefined(response.data)
                            && angular.isDefined(response.data.query)
                            && angular.isDefined(response.data.query.pages)
                            && _.has(response.data.query.pages, pageId)) {
                        return response.data.query.pages[pageId];
                    }
                    onError();
                }
                
                function onError() {
                    throw "Error";
                }
            });

            self.fetchCategoryList = yaviCached(function() {
                return $http
                    .jsonp(self.buildCategoryListQuery())
                    .then(onSuccess)
                    .catch(onError);

                function onSuccess(response) {
                    if (angular.isDefined(response)
                            && angular.isDefined(response.data)
                            && angular.isDefined(response.data.query)
                            && angular.isDefined(response.data.query.pages)
                            && _.has(response.data.query.pages, pageId)
                            && angular.isDefined(response.data.query.pages[pageId].categories)) {
                        var categories = response.data.query.pages[pageId].categories;
                        var categoryTitles = _.map(categories, function(category) {
                            var categoryTitle = category.title;
                            return categoryTitle.substr(categoryTitle.indexOf(':') + 1, categoryTitle.length);
                        });
                        return categoryTitles;
                    }
                    onError();
                }
                
                function onError() {
                    throw "Error";
                }
            });

            self.fetchDescription = yaviCached(function() {
                return self
                    .fetchBasicData()
                    .then(onSuccess)
                    .catch(onError);

                function onSuccess(basicData) {
                    return basicData.extract;
                }

                function onError() {
                    throw "Error";
                }
            });

            self.fetchThumbnail = yaviCached(function() {
                return $http
                    .jsonp(self.buildThumbnailQuery())
                    .then(onSuccess)
                    .catch(onError);

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
                    throw "Error";
                }
            });

            self.fetchTitle = yaviCached(function() {
                return self
                    .fetchBasicData()
                    .then(onSuccess)
                    .catch(onError);

                function onSuccess(basicData) {
                    return basicData.title;
                }

                function onError() {
                    throw "Error";
                }
            });

            self.buildBasicDataQuery = function() {
                var queryTemplate = '';
                queryTemplate += 'https://en.wikipedia.org/w/api.php?';
                queryTemplate += '&pageids={{pageId}}';
                queryTemplate += '&action=query';
                queryTemplate += '&prop=extracts';
                queryTemplate += '&exintro=';
                queryTemplate += '&format=json';
                queryTemplate += '&callback=JSON_CALLBACK';
                return $interpolate(queryTemplate)({
                    pageId: pageId
                });
            }

            self.buildCategoryListQuery = function() {
                var queryTemplate = '';
                queryTemplate += 'https://en.wikipedia.org/w/api.php?';
                queryTemplate += '&pageids={{pageId}}';
                queryTemplate += '&action=query';
                queryTemplate += '&prop=categories';
                queryTemplate += '&clshow=!hidden';
                queryTemplate += '&format=json';
                queryTemplate += '&callback=JSON_CALLBACK';
                return $interpolate(queryTemplate)({
                   pageId: pageId
                });
            }

            self.buildThumbnailQuery = function() {
                var queryTemplate = '';
                queryTemplate += 'https://en.wikipedia.org/w/api.php?';
                queryTemplate += '&pageids={{pageId}}';
                queryTemplate += '&action=query';
                queryTemplate += '&prop=pageimages';
                queryTemplate += '&pithumbsize=400';
                queryTemplate += '&format=json';
                queryTemplate += '&callback=JSON_CALLBACK';
                return $interpolate(queryTemplate)({
                    pageId: pageId
                });
            }
        }

    }

})();
