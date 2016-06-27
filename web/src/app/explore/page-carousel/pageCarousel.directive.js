(function() {
    'use strict';

    angular
        .module('yavi')
        .directive('yvPageCarousel', directiveFunction);

    /** @ngInject */
    function directiveFunction() {

        var directive = {
            controller: controllerFunction,
            controllerAs: 'pageCarousel',
            restrict: 'E',
            templateUrl: 'html/pageCarousel.html'
        };

        return directive;
        
        /** @ngInject */
        function controllerFunction() {
            
            var self = this;

            return self;
        }
    }

})();
