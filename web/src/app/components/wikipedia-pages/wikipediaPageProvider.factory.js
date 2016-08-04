(function() {
    'use strict';

    angular
        .module('yavi')
        .factory('wikipediaPageProvider', factoryFunction);

    /** @ngInject */
    function factoryFunction(WikipediaPage) {

        var factory = {};

        factory.getPage = _.memoize(getPage, getPageHash);

        return factory;

        function getPage(wikipediaId, pageId) {
            return new WikipediaPage(wikipediaId, pageId);
        };

        function getPageHash(wikipediaId, pageId) {
            return wikipediaId + ":" + pageId;
        };
    }

})();
