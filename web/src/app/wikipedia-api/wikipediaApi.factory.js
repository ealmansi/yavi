(function() {
    'use strict';

    angular
        .module('yavi')
        .factory('wikipediaApi', factoryFunction);

    /** @ngInject */
    function factoryFunction(WikipediaPageDataProvider) {

        var factory = {};

        var pageDataProviders = {};

        factory.getPageDataProvider = function(wikipediaSourceId, pageId) {
            
            if (!_.has(pageDataProviders, wikipediaSourceId)) {
                pageDataProviders[wikipediaSourceId] = {};
            }
            if (!_.has(pageDataProviders[wikipediaSourceId], pageId)) {
                pageDataProviders[wikipediaSourceId][pageId] = new WikipediaPageDataProvider(wikipediaSourceId, pageId);
            }
            return pageDataProviders[wikipediaSourceId][pageId];
        }

        return factory;
    }

})();
