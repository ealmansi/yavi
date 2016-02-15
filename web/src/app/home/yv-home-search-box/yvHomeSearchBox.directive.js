(function() {
  'use strict';

  angular
    .module('yavi')
    .directive('yvHomeSearchBox', directiveFunction);

  /** @ngInject */
  function directiveFunction() {
    var directive = {
      controller: controllerFunction,
      controllerAs: 'vm',
      link: linkFunction,
      restrict: 'E',
      scope: true,
      templateUrl: 'app/home/yv-home-search-box/yvHomeSearchBox.html'
    };

    return directive;
  
    /** @ngInject */
    function controllerFunction($scope, wikipediaSources, $timeout, wikipediaAPI, $state) {
      var vm = this;

      // Home properties.
      vm.query = $scope.$parent.vm.query;
      vm.searchResults = $scope.$parent.vm.searchResults;
      vm.searchBoxInputDebounce = 150;
      vm.searchOngoing = false;

      // Wikipedia sources.
      vm.activeWikipediaSource = wikipediaSources.getActiveWikipediaSource();
      vm.wikipediaSources = wikipediaSources.getWikipediaSources();

      // Search box change.
      var onChangeTimerCurrent = undefined;
      vm.onChange = function() {
        onChangeTimerCurrent = $timeout(function() {
          if (vm.query.value) {
            vm.searchOngoing = true;
            var onChangeTimerAtSearch = onChangeTimerCurrent;
            wikipediaAPI.search(vm.query.value)
                .then(function(searchResults) {
                  if (onChangeTimerAtSearch == onChangeTimerCurrent) {
                    vm.searchResults.value = searchResults;
                  }
                  vm.searchOngoing = false;
                })
                .catch(function() {
                  vm.searchOngoing = false;
                });
          } else {
            vm.searchResults.value = [];
          }
        });
      }
      $scope.$on("$destroy", function() {
        if (angular.isDefined(onChangeTimerCurrent)) {
          $timeout.cancel(onChangeTimerCurrent);
        }
      });

      // Search box submit.
      vm.onSubmit = function() {
        if (vm.searchResults.value.length > 0) {
          $state.go('explorePage', {
            pageId: vm.searchResults.value[0]
          });
        }
      }
    }
    
    function linkFunction(scope, element) {
      element.find('#home-search-box-input').focus();
      scope.vm.onChange();
    }
  }

})();
