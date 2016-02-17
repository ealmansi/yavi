(function() {
  'use strict';

  angular
    .module('yavi')
    .directive('yvHomeNavbar', directiveFunction);

  /** @ngInject */
  function directiveFunction() {
    var directive = {
      controller: controllerFunction,
      controllerAs: 'vm',
      restrict: 'E',
      scope: {
        query: '='
      },
      templateUrl: 'app/home/yv-home-navbar/yvHomeNavbar.html'
    };

    return directive;
    
    /** @ngInject */
    function controllerFunction($scope, wikipediaSources, $state) {
      var vm = this;
      
      // Home properties.
      vm.query = $scope.query;

      // Collapsing.
      vm.navbarMenuIsCollapsed = true;
      vm.toggleNavbarMenu = function() {
        vm.navbarMenuIsCollapsed = !vm.navbarMenuIsCollapsed;
      }

      // Wikipedia sources.
      vm.wikipediaSources = wikipediaSources.getWikipediaSources();
      vm.activeWikipediaSource = wikipediaSources.getActiveWikipediaSource();
      vm.selectWikipediaSource = function(wikipediaId) {
        wikipediaSources.setActiveWikipediaSourceById(wikipediaId);
        $state.go($state.current, {
          query: vm.query.value
        }, {reload: true, inherit: false});
      }
    }
  }

})();
