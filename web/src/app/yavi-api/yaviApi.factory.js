(function() {
    'use strict';

    angular
        .module('yavi')
        .factory('yaviApi', factoryFunction);

    /** @ngInject */
    function factoryFunction(YaviPageDataProvider) {

        var factory = {};

        var pageDataProviders = {};

        factory.getPageDataProvider = function(wikipediaSourceId, pageId) {
            
            if (!_.has(pageDataProviders, wikipediaSourceId)) {
                pageDataProviders[wikipediaSourceId] = {};
            }
            if (!_.has(pageDataProviders[wikipediaSourceId], pageId)) {
                pageDataProviders[wikipediaSourceId][pageId] = new YaviPageDataProvider(wikipediaSourceId, pageId);
            }
            return pageDataProviders[wikipediaSourceId][pageId];
        }

        return factory;
    }

})();
