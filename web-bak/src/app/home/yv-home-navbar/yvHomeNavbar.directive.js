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
    function controllerFunction($scope, $state, $interpolate, wikipediaSources, toastr) {
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
        vm.activeWikipediaSource = wikipediaSources.getActiveWikipediaSource();
        $state.go($state.current, {
          query: vm.query.value
        }, {reload: true, inherit: false});
        var messageTemplate = 'Changed Wikipiedia source to: {{language}}';
        var message = $interpolate(messageTemplate)({language: vm.activeWikipediaSource.language});
        toastr.success(message);
      }
    }
  }

})();
