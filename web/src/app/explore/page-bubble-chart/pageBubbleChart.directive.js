(function() {
    'use strict';

    angular
        .module('yavi')
        .directive('yvPageBubbleChart', directiveFunction);

    /** @ngInject */
    function directiveFunction() {

        var directive = {
            controller: controllerFunction,
            controllerAs: 'pageBubbleChart',
            restrict: 'E',
            templateUrl: 'html/pageBubbleChart.html'
        };

        return directive;
        
        /** @ngInject */
        function controllerFunction() {
            
            var self = this;

            return self;
        }
    }

})();
