(function() {
  'use strict';

  angular
    .module('yavi')
    .factory('yvPageTitleConfig', factoryFunction);

  /** @ngInject */
  function factoryFunction($interpolate) {
    var pageTitleTemplate = 'Yavi - {{pageTitle}}';
    var defaultPageTitle = 'Visualize Wikipedia';
    var pageTitle = defaultPageTitle;

    return {
      getPageTitle: getPageTitleFunction,
      setPageTitle: setPageTitleFunction,
      setDefaultPageTitle: setDefaultPageTitleFunction
    };

    function getPageTitleFunction() {
      return $interpolate(pageTitleTemplate)({pageTitle: pageTitle});
    }
    
    function setPageTitleFunction(newPageTitle) {
      pageTitle = newPageTitle;
    }
    
    function setDefaultPageTitleFunction() {
      setPageTitleFunction(defaultPageTitle);
    }
  }
  
})();
