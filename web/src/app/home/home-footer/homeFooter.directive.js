(function() {
    'use strict';

    angular
        .module('yavi')
        .directive('yvHomeFooter', directiveFunction);

    /** @ngInject */
    function directiveFunction() {

        var directive = {
            controller: controllerFunction,
            controllerAs: 'homeFooter',
            restrict: 'E',
            templateUrl: 'html/homeFooter.html'
        };

        return directive;
        
        /** @ngInject */
        function controllerFunction() {
            
            var homeFooter = this;

            return homeFooter;
        }
    }

})();
