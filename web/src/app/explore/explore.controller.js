(function() {
    'use strict';

    angular
        .module('yavi')
        .controller('ExploreController', controllerFunction);

    /** @ngInject */
    function controllerFunction(wikipediaPages,
                                $compile,
                                $interpolate,
                                $scope,
                                $stateParams,
                                $log) {
        var self = this;

        self.pageId = undefined;
        self.startDate = undefined;
        self.endDate = undefined;
        self.wikipediaSourceId = undefined;
        self.page = undefined;

        function init() {
            self.pageId = $stateParams.page;
            self.startDate = $stateParams.startDate;
            self.endDate = $stateParams.endDate;
            self.wikipediaSourceId = $stateParams.wiki;
            self.page = wikipediaPages.getPage(self.wikipediaSourceId, self.pageId);
            updateBubbleChart();
        }

        function updateBubbleChart() {
            self.page.fetchRelatedPages()
                .then(function(pageIds) {
                    var bubbleChartWrapperElement = angular.element("#explore-bubble-chart-wrapper");
                    var bubbleChartElement = buildBubbleChartElement(pageIds);
                    bubbleChartWrapperElement.append(bubbleChartElement);
                });
        }

        function buildBubbleChartElement(pageIds) {
            var template = "<yavi-bubble-chart page-ids=\"{{pageIds}}\"></yavi-bubble-chart>";
            var html = $interpolate(template)({pageIds: pageIds.join(",")});
            return $compile(html)($scope);
        }

        $scope.$on('$stateChangeSuccess', init);

        return self;
    }
    
})();
