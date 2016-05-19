(function() {
    'use strict';

    angular
        .module('yavi')
        .directive('yvHomeQueryResultCard', directiveFunction);

    /** @ngInject */
    function directiveFunction() {

        var directive = {
            controller: controllerFunction,
            controllerAs: 'homeQueryResultCard',
            restrict: 'E',
            templateUrl: 'html/homeQueryResultCard.html'
        };

        return directive;
        
        /** @ngInject */
        function controllerFunction() {
            
            var homeQueryResultCard = this;

            return homeQueryResultCard;
        }
    }

})();
