(function() {
    'use strict';

    angular
        .module('yavi')
        .service('YaviPageDataProvider', serviceFunction);

    /** @ngInject */
    function serviceFunction(YaviApiError, yaviCached, $http, $interpolate, $log) {

        return function(wikipediaSourceId, pageId) {

            var self = this;

            self.wikipediaSourceId = wikipediaSourceId;
            self.pageId = pageId;

            self.fetchRelatedPages = yaviCached(function() {
                return $http
                    .jsonp(self.buildRelatedPagesQuery())
                    .then(onSuccess)
                    .catch(onError);

                function onSuccess(response) {
                    if (angular.isDefined(response)
                            && angular.isArray(response.data)) {
                        return response.data;
                    }
                    onError();
                }
                
                function onError() {
                    throw new YaviApiError(pageId, "Related pages not found.");
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
                    throw new YaviApiError(pageId, "CategoryList not found.");
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
                    throw new YaviApiError(pageId, "Description not found.");
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
                    throw new YaviApiError(pageId, "Thumbnail not found.");
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
                    throw new YaviApiError(pageId, "Title not found.");
                }
            });

            self.buildRelatedPagesQuery = function() {
                var queryTemplate = '';
                queryTemplate += 'https://yavi-mock-server.herokuapp.com/related/{{pageId}}?';
                queryTemplate += '&callback=JSON_CALLBACK';
                return $interpolate(queryTemplate)({
                    pageId: pageId
                });
            }

            self.buildCategoryListQuery = function() {
                var queryTemplate = '';
                queryTemplate += 'https://{{wikipediaSourceId}}.wikipedia.org/w/api.php?';
                queryTemplate += '&pageids={{pageId}}';
                queryTemplate += '&action=query';
                queryTemplate += '&prop=categories';
                queryTemplate += '&clshow=!hidden';
                queryTemplate += '&format=json';
                queryTemplate += '&callback=JSON_CALLBACK';
                return $interpolate(queryTemplate)({
                    wikipediaSourceId: wikipediaSourceId,
                   pageId: pageId
                });
            }

            self.buildThumbnailQuery = function() {
                var queryTemplate = '';
                queryTemplate += 'https://{{wikipediaSourceId}}.wikipedia.org/w/api.php?';
                queryTemplate += '&pageids={{pageId}}';
                queryTemplate += '&action=query';
                queryTemplate += '&prop=pageimages';
                queryTemplate += '&pithumbsize=400';
                queryTemplate += '&format=json';
                queryTemplate += '&callback=JSON_CALLBACK';
                return $interpolate(queryTemplate)({
                    wikipediaSourceId: wikipediaSourceId,
                    pageId: pageId
                });
            }
        }

    }

})();