(function() {
  'use strict';

  angular
    .module('yavi')
    .directive('yvHomeImagetype', directiveFunction);

  /** @ngInject */
  function directiveFunction() {
    var directive = {
      restrict: 'E',
      scope: true,
      templateUrl: 'app/home/yv-home-imagetype/yvHomeImagetype.html'
    };

    return directive;
  }

})();
