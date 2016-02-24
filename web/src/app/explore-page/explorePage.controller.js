(function() {
  'use strict';

  angular
    .module('yavi')
    .controller('ExplorePageController', controllerFunction);

  /** @ngInject */
  function controllerFunction(wikipediaPages, $stateParams, yvPageTitleConfig, $state, $location) {
    var vm = this;

    if (!wikipediaPages.isValidId($stateParams.pageId)) {
      $state.go('pageNotFound');
    }

    //
    vm.page = wikipediaPages.getPageById($stateParams.pageId);
    vm.period = {
      startDate: $stateParams.startDate || '2014-01-01',
      endDate: $stateParams.endDate || '2014-03-01'
    };

    vm.page.getTitle().then(function(title) {
      yvPageTitleConfig.setPageTitle(title);
    }).catch(function() {
      $state.go('pageNotFound');
    });

    vm.absoluteURL = $location.absUrl();
  }

})();
