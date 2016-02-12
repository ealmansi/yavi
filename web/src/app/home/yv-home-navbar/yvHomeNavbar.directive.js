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
      scope: true,
      templateUrl: 'app/home/yv-home-navbar/yvHomeNavbar.html'
    };

    return directive;
    
    /** @ngInject */
    function controllerFunction($scope, wikipediaSources, yaviConfig, $state) {
      var vm = this;
      
      // Home properties.
      vm.query = $scope.$parent.vm.query;

      // Collapsing.
      vm.navbarMenuIsCollapsed = true;
      vm.toggleNavbarMenu = function() {
        vm.navbarMenuIsCollapsed = !vm.navbarMenuIsCollapsed;
      }

      // Wikipedia sources.
      vm.wikipediaSources = wikipediaSources;
      vm.activeWikipediaSource = getWikipediaSourceById(yaviConfig.wikipediaId);
      vm.selectWikipediaSource = function(wikipediaId) {
        var wikipediaSource = getWikipediaSourceById(wikipediaId);
        if (angular.isDefined(wikipediaSource)) {
          yaviConfig.wikipediaId = wikipediaSource.wikipediaId;
          $state.go($state.current, {
            query: vm.query.value
          }, {reload: true, inherit: false});
        }
      }
      
      function getWikipediaSourceById(wikipediaId) {
        var matchingWikipediaSource = undefined;
        angular.forEach(wikipediaSources, function(wikipediaSource) {
          if (wikipediaSource.wikipediaId == wikipediaId) {
            matchingWikipediaSource = wikipediaSource;
          }
        });
        return matchingWikipediaSource;
      }
    }
  }

})();
