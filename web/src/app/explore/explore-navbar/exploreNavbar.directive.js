(function() {
    'use strict';

    angular
        .module('yavi')
        .directive('yvExploreNavbar', directiveFunction);

    /** @ngInject */
    function directiveFunction() {

        var directive = {
            controller: controllerFunction,
            controllerAs: 'exploreNavbar',
            restrict: 'E',
            templateUrl: 'html/exploreNavbar.html'
        };

        return directive;
        
        /** @ngInject */
        function controllerFunction() {
            
            var self = this;

            return self;
        }
    }

})();
