(function() {
    'use strict';

    angular
        .module('yavi')
        .service('WikipediaPage', serviceFunction);

    /** @ngInject */
    function serviceFunction(wikipediaApi, yaviApi, yaviCached, $q, $log) {

        return function(wikipediaSourceId, pageId) {

            var self = this;

            self.wikipediaSourceId = wikipediaSourceId;
            self.pageId = pageId;

            // Wikipedia Api.
            var wikipediaPageDataProvider = wikipediaApi.getPageDataProvider(wikipediaSourceId, pageId);

            self.fetchCategoryList = yaviCached(function() {
                return wikipediaPageDataProvider.fetchCategoryList();
            });

            self.fetchDescription = yaviCached(function() {
                return wikipediaPageDataProvider.fetchDescription();
            });

            self.fetchThumbnail = yaviCached(function() {
                return wikipediaPageDataProvider.fetchThumbnail();
            });

            self.fetchTitle = yaviCached(function() {
                return wikipediaPageDataProvider.fetchTitle();
            });

            // Yavi Api.
            var yaviPageDataProvider = yaviApi.getPageDataProvider(wikipediaSourceId, pageId);

            self.fetchExploreData = yaviCached(function() {
                return yaviPageDataProvider.fetchExploreData();
            });
        }

    }

})();
