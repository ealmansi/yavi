(function() {
  'use strict';

  angular
    .module('yavi')
    .directive('yvPageTitle', directiveFunction);

  /** @ngInject */
  function directiveFunction(yvPageTitleConfig) {
    var directive = {
      link: linkFunction,
      restrict: 'E',
      scope: true,
      template: '<title></title>'
    };

    return directive;
    
    function linkFunction(scope, element) {
      scope.$watch(function() {
        return yvPageTitleConfig.getPageTitle();
      }, function(newPageTitle) {
        element.find('title').html(newPageTitle);
      });
    }
  }

})();
