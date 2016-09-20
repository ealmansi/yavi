(function() {
    'use strict';

    angular
        .module('yavi')
        .directive('yvPageFeatureChart', directiveFunction);

    /** @ngInject */
    function directiveFunction($log) {

        var directive = {
            controller: controllerFunction,
            controllerAs: 'pageFeatureChart',
            link: linkFunction,
            restrict: 'E',
            templateUrl: 'html/pageFeatureChart.html'
        };

        return directive;
        
        /** @ngInject */
        function controllerFunction() {
            
            var self = this;

            return self;
        }

        function linkFunction(scope, element, attributes, controller) {
            
            
        }
    }

})();
