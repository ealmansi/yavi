(function() {
  'use strict';

  angular
    .module('yavi')
    .directive('yvHomeSearchResults', directiveFunction);

  /** @ngInject */
  function directiveFunction() {
    var directive = {
      controller: controllerFunction,
      controllerAs: 'vm',
      restrict: 'E',
      scope: true,
      templateUrl: 'app/home/yv-home-search-results/yvHomeSearchResults.html'
    };

    return directive;
    
    /** @ngInject */
    function controllerFunction($scope) {
      var vm = this;

      // Home properties.
      vm.searchResults = $scope.$parent.vm.searchResults;
    }
  }

})();
