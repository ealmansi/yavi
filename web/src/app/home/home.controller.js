(function() {
    'use strict';

    angular
        .module('yavi')
        .controller('HomeController', HomeController);

    /** @ngInject */
    function HomeController(
                $compile,
                $log,
                $interpolate,
                $q,
                $scope,
                $state,
                $stateParams,
                $window,
                debounce,
                wikipediaApi
            ) {

        var self = this;

        // State params.
        self.wikipediaId = $stateParams.wikipediaId;
        self.queryString = $stateParams.queryString;
        
        // Search box state.
        self.searchBoxInputElement = null;
        self.searchBoxButtonElement = null;

        // Limit number of queries that can be done per second.
        self.maxQueriesPerSecond = 2;
        self.queryDebounceInterval = Math.round(1000 / self.maxQueriesPerSecond);
        
        // Query canceller.
        self.searchQueryCanceller = null;

        // Loading graphic state.
        self.loadingGraphicElement = null;

        /**
         *
         */
        self.init = function() {
            // Load rendered elements.
            self.searchBoxInputElement = angular.element("#search-box-input");
            self.searchBoxButtonElement = angular.element("#search-box-button");
            self.loadingGraphicElement = angular.element(".loading-graphic");

            // Bind event handlers.
            self.searchBoxInputElement.on('input', self.onSearchBoxSubmit);
            self.searchBoxButtonElement.on('click', self.onSearchBoxSubmit);
            angular.element($window).bind('resize', self.onWindowResize);
        };

        /**
         *
         */
        self.onSearchBoxSubmit = function() {
            self.queryString = self.searchBoxInputElement.val();
            self.searchQuery();
        };

        /**
         *
         */
        self.onWindowResize = function() {
            rebalanceSearchResultColumns();
        }

        /**
         *
         */
        self.searchQuery = debounce(self.queryDebounceInterval, function() {
            clearSearchResults();
            finishOngoingQuery();
            if (self.queryString.length > 0) {
                startOngoingQuery();
                var pageTitlesPromise = wikipediaApi.search(self.wikipediaId,
                        self.queryString, self.searchQueryCanceller);
                var resultsDisplayedPromise = pageTitlesPromise.then(displayResults);
                resultsDisplayedPromise.finally(finishOngoingQuery);
            }
        });
        
        /**
         *
         */
        function clearSearchResults() {
            self.searchResults = {};
            emptySearchResultColumns();
        }

        function emptySearchResultColumns() {
            var columnElements = getSearchResultColumnElements();
            _.each(columnElements, function(columnElement) {
                columnElement.empty();
            });
        }

        function getSearchResultColumnElements() {
            var columns = angular.element(".home-query-results-column");
            var columnElements = _.map(columns, angular.element);
            return columnElements;
        }

        function getActiveSearchResultColumnElements() {
            var columnElements = getSearchResultColumnElements();
            var activeColumns = _.filter(columnElements, function(columnElement) {
                return columnElement.css("display") !== "none";
            });
            var activeColumnElements = _.map(activeColumns, angular.element);
            return activeColumnElements;
        }

        function rebalanceSearchResultColumns() {
            // Get all search results in display.
            var searchResults = [];
            var activeColumnElements = getActiveSearchResultColumnElements();
            _.each(activeColumnElements, function(columnElement) {
                _.each(columnElement.children(), function(cardElement) {
                    searchResults.push(cardElement);
                });
                columnElement.empty();
            });
            // Distribute evenly between columns.
            var resultsPerColumn = Math.floor(searchResults.length / activeColumnElements.length);
            var excessNumberOfResults = searchResults.length % activeColumnElements.length;
            _.each(activeColumnElements, function(columnElement, index) {
                var numberOfResults = resultsPerColumn;
                if (index < excessNumberOfResults) {
                    numberOfResults = numberOfResults + 1;
                }
                _.times(numberOfResults, function() {
                    columnElement.append(searchResults.shift());
                });
            });
        }

        /**
         *
         */
        function startOngoingQuery() {
            showLoadingGraphic();
            self.searchQueryCanceller = $q.defer();
        }

        /**
         *
         */
        function finishOngoingQuery() {
            hideLoadingGraphic();
            if (self.searchQueryCanceller !== null) {
                self.searchQueryCanceller.resolve();
            }
            self.searchQueryCanceller = null;
            rebalanceSearchResultColumns();
        }

        /**
         *
         */
        function displayResults(pageTitles) {
            return $q.all(_.map(pageTitles, displayResult));
        }

        function displayResult(pageTitle) {
            var pageIdPromise = wikipediaApi.getPageIdByTitle(self.wikipediaId,
                    pageTitle, self.searchQueryCanceller);
            return pageIdPromise.then(displayResultByPageId).catch(_.noop());
        }

        function displayResultByPageId(pageId) {
            if (!(pageId in self.searchResults)) {
                var activeColumnElements = getActiveSearchResultColumnElements();
                var insertionColumnElement = _.min(activeColumnElements, function(columnElement) {
                    return columnElement.children().length;
                });
                var itemElement = buildQueryResultCardElement(pageId);
                insertionColumnElement.append(itemElement);
                self.searchResults[pageId] = itemElement;
                hideLoadingGraphic();
            }
        }

        function buildQueryResultCardElement(pageId) {
            var itemTemplate = '';
            itemTemplate += '<yv-home-query-result-card'
            itemTemplate += '   wikipedia-id="{{wikipediaId}}"';
            itemTemplate += '   page-id="{{pageId}}">';
            itemTemplate += '</yv-home-query-result-card>';
            var itemScope = {
                wikipediaId: self.wikipediaId,
                pageId: pageId
            };
            var itemHtml = $interpolate(itemTemplate)(itemScope);
            return $compile(itemHtml)($scope);
        }

        /**
         *
         */
        function showLoadingGraphic() {
            self.loadingGraphicElement.show();
        }

        function hideLoadingGraphic() {
            self.loadingGraphicElement.hide();
        }

        $scope.$on('$stateChangeSuccess', self.init);

        return self;
    }
    
})();
