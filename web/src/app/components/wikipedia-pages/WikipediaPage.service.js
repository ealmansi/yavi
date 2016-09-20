(function() {
    'use strict';

    angular
        .module('yavi')
        .service('WikipediaPage', serviceFunction);

    /** @ngInject */
    function serviceFunction(wikipediaApi, $log) {

        return function(wikipediaId, pageId) {

            var self = this;

            self.wikipediaId = wikipediaId;
            self.pageId = pageId;

            self.getTitlePromise = _.memoize(getTitlePromise);
            self.getDescriptionPromise = _.memoize(getDescriptionPromise);
            self.getCategoryListPromise = _.memoize(getCategoryListPromise);
            self.getThumbnailPromise = _.memoize(getThumbnailPromise);
            
            function getTitlePromise() {
                return wikipediaApi.requestPageBasicData(wikipediaId, pageId)
                    .then(function(basicData) {
                        return basicData.title;
                    });
            }

            function getDescriptionPromise() {
                return wikipediaApi.requestPageBasicData(wikipediaId, pageId)
                    .then(function(basicData) {
                        return basicData.extract;
                    });
            }

            function getCategoryListPromise() {
                return wikipediaApi.requestPageCategoryList(wikipediaId, pageId)
                    .then(function(categoryList) {
                        return _.map(categoryList, function(category) {
                            return category.substr(category.indexOf(':') + 1, category.length);
                        });
                    });
            }

            function getThumbnailPromise() {
                return wikipediaApi.requestPageThumbnail(wikipediaId, pageId);
            }
        }

    }
})();