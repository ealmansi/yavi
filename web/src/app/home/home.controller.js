(function() {
    'use strict';

    angular
        .module('yavi')
        .controller('HomeController', controllerFunction);

    /** @ngInject */
    function controllerFunction($compile,
                                $interpolate,
                                $scope,
                                $stateParams,
                                $log) {
        var self = this;

        self.query = undefined;
        self.wikipediaSourceId = undefined;
        self.showLoadingGraphic = undefined;
        self.queryResults = undefined;

        function init() {
            self.query = $stateParams.query;
            self.wikipediaSourceId = $stateParams.wiki;
            self.showLoadingGraphic = false;
            self.queryResults = [482824, 1646753, 24601759, 3088905, 32555171, 41955505, 46678678, 13873200, 49863409, 5212064, 5478840, 604727, 6887661, 838057];
            updateQueryResultCards();
        }

        function getActiveColumns() {
            var columnElements = _.map(angular.element(".home-query-results-column"), angular.element);
            var activeColumnElements = _.map(_.filter(columnElements, function(columnElement) {
                return columnElement.css("display") !== "none";
            }), angular.element);
            return activeColumnElements;
        }

        function updateQueryResultCards() {
            var activeColumnElements = getActiveColumns();
            var columnIndex = 0;
            _.each(self.queryResults, function(pageId) {
                var columnElement = activeColumnElements[columnIndex];
                var itemElement = buildQueryResultCardElement(pageId);
                columnElement.append(itemElement);
                columnIndex = (columnIndex + 1) % activeColumnElements.length;
            });
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
