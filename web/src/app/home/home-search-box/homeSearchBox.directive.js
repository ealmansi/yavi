(function() {
    'use strict';

    angular
        .module('yavi')
        .directive('yvHomeSearchBox', directiveFunction);

    /** @ngInject */
    function directiveFunction(debounce, $log) {

        var directive = {
            controller: controllerFunction,
            controllerAs: 'homeSearchBox',
            link: linkFunction,
            restrict: 'E',
            templateUrl: 'html/homeSearchBox.html'
        };

        return directive;
        
        /** @ngInject */
        function controllerFunction($scope) {
            
            var self = this;

            self.home = $scope.home;
            self.searchBoxInput = angular.element("#search-box-input");
            self.searchBoxButton = angular.element("#search-box-button");
            
            self.submitQuery = debounce(500, function() {
                if (self.searchBoxInput.val().length > 0) {
                    self.home.query = self.searchBoxInput.val();
                    self.home.onSearch();
                }
            });

            return self;
        }

        function linkFunction(scope, element, attrs, controller) {
            var searchBoxInput = controller.searchBoxInput;
            var searchBoxButton = controller.searchBoxButton;
            
            searchBoxInput.on('input', controller.submitQuery);
            
            searchBoxInput.on('keydown', function(event) {
                if (event.which == 13) {
                    controller.submitQuery();
                }
            });

            searchBoxButton.on('click', controller.submitQuery);
        }
    }

})();
