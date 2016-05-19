(function() {
    'use strict';

    angular
        .module('yavi')
        .directive('yvHomeNavbar', directiveFunction);

    /** @ngInject */
    function directiveFunction() {

        var directive = {
            controller: controllerFunction,
            controllerAs: 'homeNavbar',
            restrict: 'E',
            templateUrl: 'html/homeNavbar.html'
        };

        return directive;
        
        /** @ngInject */
        function controllerFunction() {
            
            var homeNavbar = this;

            return homeNavbar;
        }
    }

})();
