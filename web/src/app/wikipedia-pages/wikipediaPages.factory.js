(function() {
    'use strict';

    angular
        .module('yavi')
        .factory('wikipediaPages', factoryFunction);

    /** @ngInject */
    function factoryFunction(WikipediaPage) {

        var factory = {};

        var pages = {};

        factory.isValidId = function(pageId) {
            var pageIdNum = +pageId;
            return !isNaN(pageIdNum) && pageIdNum > 0;
        }

        factory.getPage = function(pageId) {
            if (!_.has(pages, pageId)) {
                pages[pageId] = new WikipediaPage(pageId);
            }
            return pages[pageId];
        }

        return factory;
    }

})();
