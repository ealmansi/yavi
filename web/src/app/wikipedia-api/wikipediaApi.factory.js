(function() {
    'use strict';

    angular
        .module('yavi')
        .factory('wikipediaApi', factoryFunction);

    /** @ngInject */
    function factoryFunction(WikipediaPageDataProvider) {

        var factory = {};

        var pageDataProviders = {};

        factory.getPageDataProvider = function(pageId) {
            if (!_.has(pageDataProviders, pageId)) {
                pageDataProviders[pageId] = new WikipediaPageDataProvider(pageId);
            }
            return pageDataProviders[pageId];
        }

        return factory;
    }

})();
