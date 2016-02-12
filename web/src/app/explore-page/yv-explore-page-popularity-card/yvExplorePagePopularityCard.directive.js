(function() {
  'use strict';

  angular
    .module('yavi')
    .directive('yvExplorePagePopularityCard', directiveFunction);

  /** @ngInject */
  function directiveFunction() {
    var directive = {
      controller: controllerFunction,
      controllerAs: 'vm',
      restrict: 'E',
      scope: {
        pageId: '='
      },
      templateUrl: 'app/explore-page/yv-explore-page-popularity-card/yvExplorePagePopularityCard.html'
    };

    return directive;
    
    /** @ngInject */
    function controllerFunction(wikipediaPages, $scope) {
      var vm = this;
      
      //
      vm.radarLabels = ["Eating", "Drinking", "Sleeping", "Designing", "Coding", "Cycling", "Running"];
      vm.radarData = [
        [65, 59, 90, 81, 56, 55, 40],
        [28, 48, 40, 19, 96, 27, 100]
      ];

      vm.lineLabels = ["January", "February", "March", "April", "May", "June", "July"];
      vm.lineSeries = ['Series A', 'Series B'];
      vm.lineData = [
        [65, 59, 80, 81, 56, 55, 40],
        [28, 48, 40, 19, 86, 27, 90]
      ];

      //
      if (!wikipediaPages.isValidId($scope.pageId)) {
        return;
      }

      vm.page = wikipediaPages.getPageById($scope.pageId);
    }
  }

})();
