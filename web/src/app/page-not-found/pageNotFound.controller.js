(function() {
  'use strict';

  angular
    .module('yavi')
    .controller('PageNotFoundController', controllerFunction);

  /** @ngInject */
  function controllerFunction(yvPageTitleConfig, $state) {
    var vm = this;

    yvPageTitleConfig.setDefaultPageTitle();

    vm.stateToHome = function() {
      $state.go('home');
    }
  }

})();
