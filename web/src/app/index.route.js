(function() {
    'use strict';

    angular
        .module('yavi')
        .config(routerConfig);

    /** @ngInject */
    function routerConfig($stateProvider, $urlRouterProvider, $locationProvider) {

        $urlRouterProvider.otherwise('/error');
        $locationProvider.html5Mode(true);

        $stateProvider
            .state('home', {
                url: '/?query&wiki',
                templateUrl: 'html/home.html',
                controller: 'HomeController',
                controllerAs: 'home',
                onEnter: onEnterHome
            });

        $stateProvider
            .state('explore', {
                url: '/explore/:page?&start&end&wiki',
                templateUrl: 'html/explore.html',
                controller: 'ExploreController',
                controllerAs: 'explore',
                onEnter: onEnterExplore
            });

        $stateProvider
            .state('error', {
                url: '/error?&wiki',
                templateUrl: 'html/error.html',
                controller: 'ErrorController',
                controllerAs: 'error',
                onEnter: onEnterError
            });

        /** @ngInject */
        function onEnterHome(wikipediaSources, yaviDefaults, $state, $stateParams) {
            $stateParams.query = $stateParams.query || yaviDefaults.query;
            $stateParams.wiki = $stateParams.wiki || yaviDefaults.wikipediaSourceId;
            if (angular.isUndefined($stateParams.query)
                    || angular.isUndefined($stateParams.wiki)
                    || !wikipediaSources.isValidId($stateParams.wiki)) {
                $state.go('error', {wiki: $stateParams.wiki});
            }
        }

        /** @ngInject */
        function onEnterExplore(wikipediaPages, wikipediaSources, yaviDates, yaviDefaults, $state, $stateParams) {
            $stateParams.start = $stateParams.start || yaviDefaults.startDate;
            $stateParams.end = $stateParams.end || yaviDefaults.endDate;
            $stateParams.wiki = $stateParams.wiki || yaviDefaults.wikipediaSourceId;
            if (angular.isUndefined($stateParams.page)
                    || angular.isUndefined($stateParams.start)
                    || angular.isUndefined($stateParams.end)
                    || angular.isUndefined($stateParams.wiki)
                    || !wikipediaPages.isValidId($stateParams.page)
                    || !yaviDates.isValidDate($stateParams.start)
                    || !yaviDates.isValidDate($stateParams.end)
                    || !yaviDates.isValidRange($stateParams.start, $stateParams.end)
                    || !wikipediaSources.isValidId($stateParams.wiki)) {
                $state.go('error', {wiki: $stateParams.wiki});
            }
        }

        /** @ngInject */
        function onEnterError(yaviDefaults, $stateParams) {
            $stateParams.wiki = $stateParams.wiki || yaviDefaults.wikipediaSourceId;
        }
    }

})();
