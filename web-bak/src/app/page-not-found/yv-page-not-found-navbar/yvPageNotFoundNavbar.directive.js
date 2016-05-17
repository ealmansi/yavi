(function() {
  'use strict';

  angular
    .module('yavi')
    .directive('yvPageNotFoundNavbar', directiveFunction);

  /** @ngInject */
  function directiveFunction() {
    var directive = {
      controller: controllerFunction,
      controllerAs: 'vm',
      restrict: 'E',
      scope: true,
      templateUrl: 'app/page-not-found/yv-page-not-found-navbar/yvPageNotFoundNavbar.html'
    };

    return directive;
    
    /** @ngInject */
    function controllerFunction($state) {
      var vm = this;

      vm.stateToHome = function() {
        $state.go('home');
      }
    }
  }

})();
