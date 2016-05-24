(function() {
    'use strict';

    angular
        .module('yavi')
        .service('WikipediaPage', serviceFunction);

    /** @ngInject */
    function serviceFunction(wikipediaApi, yaviCached, $q, $log) {

        return function(wikipediaSourceId, pageId) {

            var self = this;

            self.wikipediaSourceId = wikipediaSourceId;
            self.pageId = pageId;

            var wikipediaPageDataProvider = wikipediaApi.getPageDataProvider(wikipediaSourceId, pageId);

            self.fetchCategoryList = yaviCached(function() {
                return wikipediaPageDataProvider.fetchCategoryList(pageId);
            });

            self.fetchDescription = yaviCached(function() {
                return wikipediaPageDataProvider.fetchDescription(pageId);
            });

            self.fetchThumbnail = yaviCached(function() {
                return wikipediaPageDataProvider.fetchThumbnail(pageId);
            });

            self.fetchTitle = yaviCached(function() {
                return wikipediaPageDataProvider.fetchTitle(pageId);
            });
        }

    }

})();
