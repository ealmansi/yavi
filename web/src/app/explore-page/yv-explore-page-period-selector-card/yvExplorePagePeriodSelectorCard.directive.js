(function() {
  'use strict';

  angular
    .module('yavi')
    .directive('yvExplorePagePeriodSelectorCard', directiveFunction);

  /** @ngInject */
  function directiveFunction() {
    var directive = {
      controller: controllerFunction,
      controllerAs: 'vm',
      restrict: 'E',
      scope: {
        pageId: '=',
        period: '='
      },
      templateUrl: 'app/explore-page/yv-explore-page-period-selector-card/yvExplorePagePeriodSelectorCard.html'
    };

    return directive;
    
    /** @ngInject */
    function controllerFunction(wikipediaPages, $scope, $log) {
      var vm = this;

      // Check if page id is valid.
      if (!wikipediaPages.isValidId($scope.pageId)) {
        return;
      }
      
      // Get page and period.
      vm.page = wikipediaPages.getPageById($scope.pageId);
      vm.period = $scope.period;

      vm.datePicker = {date: {startDate: vm.period.startDate, endDate: vm.period.endDate}};
      vm.onApply = function() {
        $scope.$emit('periodSelection', {
          startDate: vm.datePicker.date.startDate.format('YYYY-MM-DD'),
          endDate: vm.datePicker.date.endDate.format('YYYY-MM-DD')
        });
      }
    }
  }

})();
