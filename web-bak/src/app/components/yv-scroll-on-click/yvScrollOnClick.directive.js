(function() {
  'use strict';

  angular
    .module('yavi')
    .directive('yvScrollOnClick', directiveFunction);

  /** @ngInject */
  function directiveFunction() {
    var directive = {
      link: linkFunction,
      restrict: 'A'
    };

    return directive;
    
    function linkFunction(scope, element) {
      element.on('click', function() {
        angular.element('body').animate({
          scrollTop: angular.element('yv-home-imagetype').offset().top
        }, "fast");
      });
    }
  }

})();
