(function() {
  'use strict';

  angular
    .module('yavi')
    .factory('wikipediaPages', factoryFunction);

  /** @ngInject */
  function factoryFunction(WikipediaPage) {
    var pages = {};

    return new function() {
      this.isValidId = function(pageId) {
        var pageIdInteger = parseInt(pageId, 10);
        return pageIdInteger > 0;
      }

      this.getPageById = function(pageIdArg) {
        var pageId = parseInt(pageIdArg, 10);
        if (!pages.hasOwnProperty(pageId)) {
          pages[pageId] = new WikipediaPage(pageId);
        }
        return pages[pageId];
      }
    }
  }
  
})();
