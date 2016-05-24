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

        factory.getPage = function(wikipediaSourceId, pageId) {
            if (!_.has(pages, wikipediaSourceId)) {
                pages[wikipediaSourceId] = {};
            }
            if (!_.has(pages[wikipediaSourceId], pageId)) {
                pages[wikipediaSourceId][pageId] = new WikipediaPage(wikipediaSourceId, pageId);
            }
            return pages[wikipediaSourceId][pageId];
        }

        return factory;
    }

})();
