(function() {
  'use strict';

  angular
    .module('yavi')
    .directive('yvExplorePageNavbar', directiveFunction);

  /** @ngInject */
  function directiveFunction() {
    var directive = {
      controller: controllerFunction,
      controllerAs: 'vm',
      restrict: 'E',
      scope: {
        pageId: '='
      },
      templateUrl: 'app/explore-page/yv-explore-page-navbar/yvExplorePageNavbar.html'
    };

    return directive;
    
    /** @ngInject */
    function controllerFunction($scope, $state, $interpolate, wikipediaPages, wikipediaSources, toastr) {
      var vm = this;

      //      
      vm.navbarMenuIsCollapsed = true;
      vm.searchBoxInput = '';

      //
      vm.onChange = function() {
        vm.onSubmit();
      }

      vm.onSubmit = function() {
        $state.go('home', {
          query: vm.searchBoxInput
        });
      }
      
      vm.stateToHome = function() {
        $state.go('home');
      }

      vm.toggleNavbarMenu = function() {
        vm.navbarMenuIsCollapsed = !vm.navbarMenuIsCollapsed;
      }

      //
      if (!wikipediaPages.isValidId($scope.pageId)) {
        return;
      }
      
      vm.page = wikipediaPages.getPageById($scope.pageId);

      vm.page.getTitle().then(function(title) {
        vm.searchBoxInput = title;
      });

      // Wikipedia sources.
      vm.wikipediaSources = wikipediaSources.getWikipediaSources();
      vm.activeWikipediaSource = wikipediaSources.getActiveWikipediaSource();
      vm.selectWikipediaSource = function(wikipediaId) {
        wikipediaSources.setActiveWikipediaSourceById(wikipediaId);
        vm.activeWikipediaSource = wikipediaSources.getActiveWikipediaSource();
        var messageTemplate = 'Changed Wikipiedia source to: {{language}}';
        var message = $interpolate(messageTemplate)({language: vm.activeWikipediaSource.language});
        toastr.success(message);
        $state.go('home');
      }
    }
  }

})();
