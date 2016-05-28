(function() {
    'use strict';

    angular
        .module('yavi')
        .controller('HomeController', controllerFunction);

    /** @ngInject */
    function controllerFunction(debounce,
                                wikipediaApi,
                                $compile,
                                $interpolate,
                                $q,
                                $scope,
                                $stateParams,
                                $log) {
        var self = this;

        self.query = undefined;
        self.wikipediaSourceId = undefined;
        self.searchResults = undefined;
        self.onSearch = undefined;
        self.clearSearchResultCards = undefined;
        self.addSearchResult = undefined;
        self.loadingGraphic = undefined;

        function init() {
            self.query = $stateParams.query;
            self.wikipediaSourceId = $stateParams.wiki;
            self.searchResults = {};
            self.onSearch = onSearch;
            self.clearSearchResultCards = clearSearchResultCards;
            self.addSearchResult = addSearchResult;
            self.loadingGraphic = angular.element(".loading-graphic");
        }

        function onSearch() {
            self.clearSearchResultCards();
            showLoadingGraphic();
            var resultSetsPromises = wikipediaApi.multiSearch(self.query);
            $q.all(_.map(resultSetsPromises, handleResultSetPromise))
                .then(hideLoadingGraphic);
        }

        function handleResultSetPromise(resultSetPromise) {
            return resultSetPromise
                .then(function(queryResultSet) {
                    var query = queryResultSet.query;
                    var resultSet = queryResultSet.resultSet;
                    if (query == self.query) {
                        return $q.all(_.map(resultSet, handlePageIdPromise));
                    }
                    return $q.when([]);
                })
                .catch(function(){ /* ignore*/ });
        }

        function handlePageIdPromise(pageIdPromise) {
            return pageIdPromise
                .then(function(queryPageId) {
                    var query = queryPageId.query;
                    var pageId = queryPageId.pageId;
                    if (query == self.query) {
                        self.addSearchResult(pageId);
                        hideLoadingGraphic();
                    }
                })
                .catch(function(){ /* ignore*/ });
        }

        function showLoadingGraphic() {
            self.loadingGraphic.show();
        }

        function hideLoadingGraphic() {
            self.loadingGraphic.hide();
        }

        function clearSearchResultCards() {
            var activeColumnElements = getActiveColumnsElements();
            _.each(activeColumnElements, function(columnElement) {
                columnElement.empty();
            });
            self.searchResults = {};
        }

        function addSearchResult(pageId) {
            if (!(pageId in self.searchResults)) {
                var activeColumnElements = getActiveColumnsElements();
                var insertionColumnElement = _.min(activeColumnElements, function(columnElement) {
                    return columnElement.children().length;
                });
                var itemElement = buildQueryResultCardElement(pageId);
                insertionColumnElement.append(itemElement);
                self.searchResults[pageId] = itemElement;
            }
        }

        function getActiveColumnsElements() {
            var columnElements = _.map(angular.element(".home-query-results-column"), angular.element);
            var activeColumnElements = _.map(_.filter(columnElements, function(columnElement) {
                return columnElement.css("display") !== "none";
            }), angular.element);
            return activeColumnElements;
        }

        function buildQueryResultCardElement(pageId) {
            var template = "<yv-home-query-result-card page-id=\"{{pageId}}\"></yv-home-query-result-card>";
            var html = $interpolate(template)({pageId: pageId});
            return $compile(html)($scope);
        }

        $scope.$on('$stateChangeSuccess', init);

        return self;
    }
    
})();
