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
    function controllerFunction(wikipediaPages, $scope, $log, $interpolate) {
      var vm = this;

      // Check if page id is valid.
      if (!wikipediaPages.isValidId($scope.pageId)) {
        return;
      }
      
      // Get page and period.
      vm.page = wikipediaPages.getPageById($scope.pageId);
      vm.period = $scope.period;

      vm.onApply = function() {
        $scope.$emit('periodSelection', {
          startDate: vm.datePicker.date.startDate.format('YYYY-MM-DD'),
          endDate: vm.datePicker.date.endDate.format('YYYY-MM-DD')
        });
      }

      vm.datePickerStartDate = new Date(vm.period.startDate);
      vm.datePickerEndDate = new Date(vm.period.endDate);

      vm.datePickerFormat = 'MMMM dd, yyyy';
      vm.datePickerMinDate = new Date(2000, 5, 22);
      vm.datePickerMaxDate = new Date(2020, 5, 22);
      vm.datePickerAltInputFormats = ['M!/d!/yyyy'];
      vm.datePickerOptions = {formatYear: 'yy', startingDay: 1};

      var dateTemplate = '{{year}}-{{month}}-{{day}}';
      $scope.$watch('vm.datePickerStartDate', function(datePickerStartDate) {
        var year = datePickerStartDate.getFullYear();
        var month = datePickerStartDate.getMonth() + 1;
        var day = datePickerStartDate.getDate();
        var startDate = $interpolate(dateTemplate)({
          year: year,
          month: month,
          day: day
        });
        onPeriodChange(startDate, vm.period.endDate);
      });
      $scope.$watch('vm.datePickerEndDate', function(datePickerEndDate) {
        var year = datePickerEndDate.getFullYear();
        var month = datePickerEndDate.getMonth() + 1;
        var day = datePickerEndDate.getDate();
        var endDate = $interpolate(dateTemplate)({
          year: year,
          month: month,
          day: day
        });
        onPeriodChange(vm.period.startDate, endDate);
      });
      function onPeriodChange(startDate, endDate) {
        vm.period.startDate = startDate;
        vm.period.endDate = endDate;
        $scope.$emit('periodSelection', {
          startDate: startDate,
          endDate: endDate
        });
      }
    }
  }

})();
