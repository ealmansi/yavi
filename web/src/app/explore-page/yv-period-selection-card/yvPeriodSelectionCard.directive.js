(function() {
  'use strict';

  angular
    .module('yavi')
    .directive('yvPeriodSelectionCard', directiveFunction);

  /** @ngInject */
  function directiveFunction($interpolate, $timeout) {
    var directive = {
      controller: controllerFunction,
      controllerAs: 'vm',
      restrict: 'E',
      scope: true,
      templateUrl: 'app/explore-page/yv-period-selection-card/yvPeriodSelectionCard.html'
    };

    return directive;
    
    /** @ngInject */
    function controllerFunction($scope) {
      var vm = this;

      // Get page and period.
      vm.page = $scope.$parent.vm.page;
      vm.period = $scope.$parent.vm.period;

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
        var yearStr = ('0000' + year.toString()).slice(-4);
        var monthStr = ('00' + month.toString()).slice(-2);
        var dayStr = ('00' + day.toString()).slice(-2);
        var startDate = $interpolate(dateTemplate)({
          year: yearStr,
          month: monthStr,
          day: dayStr
        });
        onPeriodChange(startDate, vm.period.endDate);
      });
      
      $scope.$watch('vm.datePickerEndDate', function(datePickerEndDate) {
        var year = datePickerEndDate.getFullYear();
        var month = datePickerEndDate.getMonth() + 1;
        var day = datePickerEndDate.getDate();
        var yearStr = ('0000' + year.toString()).slice(-4);
        var monthStr = ('00' + month.toString()).slice(-2);
        var dayStr = ('00' + day.toString()).slice(-2);
        var endDate = $interpolate(dateTemplate)({
          year: yearStr,
          month: monthStr,
          day: dayStr
        });
        onPeriodChange(vm.period.startDate, endDate);
      });
      
      var onPeriodChangeTimer = undefined;
      function onPeriodChange(startDate, endDate) {
        if (angular.isDefined(onPeriodChangeTimer)) {
          $timeout.cancel(onPeriodChangeTimer);
        }
        onPeriodChangeTimer = $timeout(function() {
          if (vm.period.startDate != startDate || vm.period.endDate != endDate) {
            vm.period.startDate = startDate;
            vm.period.endDate = endDate;
            $scope.$emit('periodSelection', {
              startDate: startDate,
              endDate: endDate
            });
          }
        }, 100);
      }
    }
  }

})();
