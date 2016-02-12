(function() {
  'use strict';

  angular
    .module('yavi')
    .controller('HomeController', controllerFunction);

  /** @ngInject */
  function controllerFunction(yvPageTitleConfig, $stateParams) {
    var vm = this;

    //
    yvPageTitleConfig.setDefaultPageTitle();

    //
    vm.query = {value: $stateParams.query};
    vm.searchResults = {value: []};
  }

})();
