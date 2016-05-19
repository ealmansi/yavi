(function() {
    'use strict';

    angular
        .module('yavi')
        .directive('yvHomeSearchBox', directiveFunction);

    /** @ngInject */
    function directiveFunction() {

        var directive = {
            controller: controllerFunction,
            controllerAs: 'homeSearchBox',
            restrict: 'E',
            templateUrl: 'html/homeSearchBox.html'
        };

        return directive;
        
        /** @ngInject */
        function controllerFunction() {
            
            var homeSearchBox = this;

            return homeSearchBox;
        }
    }

})();
