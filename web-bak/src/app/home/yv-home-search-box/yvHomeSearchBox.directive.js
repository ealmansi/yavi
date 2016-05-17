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
      scope: {
        onSearchBoxChange: '=',
        onSearchBoxSubmit: '=',
        query: '='
      },
      templateUrl: 'app/home/yv-home-search-box/yvHomeSearchBox.html'
    };

    return directive;
  
    /** @ngInject */
    function controllerFunction($scope) {
      var vm = this;

      // Home properties.
      vm.onSearchBoxChange = $scope.onSearchBoxChange;
      vm.onSearchBoxSubmit = $scope.onSearchBoxSubmit;
      vm.query = $scope.query;

      // Search box properties.
      vm.searchBoxInputDebounce = 150;
    }
    
    function linkFunction(scope, element) {
      element.find('#home-search-box-input').focus();
      scope.vm.onSearchBoxChange();
    }
  }

})();
