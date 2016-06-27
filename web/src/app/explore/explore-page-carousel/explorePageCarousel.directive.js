(function() {
    'use strict';

    angular
        .module('yavi')
        .directive('yvExplorePageCarousel', directiveFunction);

    /** @ngInject */
    function directiveFunction($compile,
                                $interpolate,
                                $log) {

        var directive = {
            controller: controllerFunction,
            controllerAs: 'explorePageCarousel',
            link: linkFunction,
            restrict: 'E',
            scope: {
                pageId: '@'
            },
            templateUrl: 'html/explorePageCarousel.html'
        };

        return directive;
        
        /** @ngInject */
        function controllerFunction(wikipediaPages,
                                    $scope,
                                    $log) {
            
            var self = this;

            self.wikipediaSourceId = $scope.$parent.explore.wikipediaSourceId;
            self.pageId = $scope.pageId;
            self.page = wikipediaPages.getPage(self.wikipediaSourceId, self.pageId);

            return self;
        }

        function linkFunction(scope, element, attributes, controller) {
            // var page = controller.page;
            // var carouselElement = element.find('uib-carousel');
            // var slides = [1, 2, 3];
            // _.each(slides, function(slide) {
            //     var slideElement = buildSlideElement(scope);
            //     carouselElement.append(slideElement);
            // });
        }

        // function buildSlideElement(scope) {
        //     var template = "<uib-slide></uib-slide>";
        //     var html = $interpolate(template)({/*pageId: pageId*/});
        //     return $compile(html)(scope);
        // }
    }

})();
