(function() {
    'use strict';

    angular
        .module('yavi')
        .service('YaviPageDataProvider', serviceFunction);

    /** @ngInject */
    function serviceFunction(yaviApiUrl, yaviCached, YaviApiError, $http, $interpolate, $log) {

        return function(wikipediaSourceId, pageId) {

            var self = this;

            self.wikipediaSourceId = wikipediaSourceId;
            self.pageId = pageId;

            self.fetchExploreData = yaviCached(function() {
                return $http
                    .jsonp(self.buildExploreDataQuery())
                    .then(onSuccess)
                    .catch(onError);

                function onSuccess(response) {
                    if (angular.isDefined(response)
                            && angular.isDefined(response.data)) {
                        return response.data;
                    }
                    onError();
                }
                
                function onError() {
                    throw new YaviApiError(pageId, "Related pages not found.");
                }
            });

            self.buildExploreDataQuery = function() {
                var queryTemplate = '';
                queryTemplate += "{{yaviApiUrl}}";
                queryTemplate += '/explore/{{pageId}}/01-01-2015/01-06-2015?';
                queryTemplate += '&callback=JSON_CALLBACK';
                return $interpolate(queryTemplate)({
                    yaviApiUrl: yaviApiUrl,
                    pageId: pageId
                });
            }
        }

    }

})();
