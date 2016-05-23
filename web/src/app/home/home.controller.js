(function() {
    'use strict';

    angular
        .module('yavi')
        .controller('HomeController', controllerFunction);

    /** @ngInject */
    function controllerFunction($stateParams, $interpolate, $compile, $scope, $log) {
        
        var home = this;

        home.query = $stateParams.query;
        home.wiki = $stateParams.wiki;

        home.showLoadingGraphic = false;

        home.queryResults = [482824, 1646753, 24601759, 3088905, 32555171, 41955505, 46678678, 13873200, 49863409, 5212064, 5478840, 604727, 6887661, 838057]

        $scope.$on('$stateChangeSuccess', function () {
            updateQueryResultCards();
        });

        return home;

        function updateQueryResultCards() {
            var activeColumnElements = getActiveColumns();
            var columnIndex = 0;
            _.each(home.queryResults, function(pageId) {
                var columnElement = activeColumnElements[columnIndex];
                var itemElement = buildQueryResultCardElement(pageId);
                columnElement.append(itemElement);
                columnIndex = (columnIndex + 1) % activeColumnElements.length;
            });
        }

        function getActiveColumns() {
            var columnElements = angular.element(".home-query-results-column");
            var activeColumns = _.filter(columnElements, function(column) {
                var columnElement = angular.element(column);
                return columnElement.css("display") !== "none";
            });
            return _.map(activeColumns, angular.element);
        }

        function buildQueryResultCardElement(pageId) {
            var itemTemplate = "<yv-home-query-result-card page-id=\"{{pageId}}\"></yv-home-query-result-card>";
            var itemHTML = $interpolate(itemTemplate)({pageId: pageId});
            return $compile(itemHTML)($scope);
        }
    }
    
})();
