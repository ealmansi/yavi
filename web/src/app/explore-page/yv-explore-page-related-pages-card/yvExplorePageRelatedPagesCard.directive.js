(function() {
  'use strict';

  angular
    .module('yavi')
    .directive('yvExplorePageRelatedPagesCard', directiveFunction);

  /** @ngInject */
  function directiveFunction() {
    var directive = {
      controller: controllerFunction,
      controllerAs: 'vm',
      restrict: 'E',
      scope: {
        pageId: '='
      },
      templateUrl: 'app/explore-page/yv-explore-page-related-pages-card/yvExplorePageRelatedPagesCard.html'
    };

    return directive;
  
    /** @ngInject */
    function controllerFunction(wikipediaPages, $scope) {
      var vm = this;

      //
      if (!wikipediaPages.isValidId($scope.pageId)) {
        return;
      }
      
      vm.page = wikipediaPages.getPageById($scope.pageId);
    }
  }

})();
