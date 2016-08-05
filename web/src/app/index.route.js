(function() {
    'use strict';

    angular
        .module('yavi')
        .config(routerConfig);

    /** @ngInject */
    function routerConfig(
                $stateProvider,
                $urlRouterProvider,
                $locationProvider
            ) {

        $stateProvider
            .state('home', {
                url: '/?w&q',
                templateUrl: 'html/home.html',
                controller: 'HomeController',
                controllerAs: 'home',
                onEnter: onEnterHome
            });

        $stateProvider
            .state('explore', {
                url: '/explore?w&p&s&e',
                templateUrl: 'html/explore.html',
                controller: 'ExploreController',
                controllerAs: 'explore',
                onEnter: onEnterExplore
            });

        $stateProvider
            .state('error', {
                url: '/error?&w',
                templateUrl: 'html/error.html',
                controller: 'ErrorController',
                controllerAs: 'error',
                onEnter: onEnterError
            });

        $urlRouterProvider.otherwise('/error');
        
        $locationProvider.html5Mode(true);
    }
    
    /** @ngInject */
    function onEnterHome($state, $stateParams, wikipediaSources, yaviDefaults) {
        // Read state parameters.
        $stateParams.wikipediaId = $stateParams.w || yaviDefaults.wikipediaId;
        $stateParams.queryString = $stateParams.q || yaviDefaults.queryString;
        
        // Check if state is valid, else redirect to error state.
        if (angular.isUndefined($stateParams.wikipediaId) ||
                angular.isUndefined($stateParams.queryString) ||
                !wikipediaSources.isValidId($stateParams.wikipediaId)) {
            $state.go('error', { w: $stateParams.wikipediaId });
        }
    }

    /** @ngInject */
    function onEnterExplore($state, $stateParams, wikipediaSources, yaviDates, yaviDefaults) {
        // Read state parameters.
        $stateParams.wikipediaId = $stateParams.w || undefined;
        $stateParams.pageId = $stateParams.p || undefined;
        $stateParams.startDate = $stateParams.s || yaviDefaults.startDate;
        $stateParams.endDate = $stateParams.e || yaviDefaults.endDate;
        
        // Check if state is valid, else redirect to error state.
        if (angular.isUndefined($stateParams.wikipediaId) ||
                angular.isUndefined($stateParams.pageId) ||
                angular.isUndefined($stateParams.startDate) ||
                angular.isUndefined($stateParams.endDate) ||
                !wikipediaSources.isValidId($stateParams.wikipediaId) ||
                !isValidPageId($stateParams.pageId) ||
                !yaviDates.isValidDate($stateParams.startDate) ||
                !yaviDates.isValidDate($stateParams.endDate) ||
                !yaviDates.isValidRange($stateParams.startDate, $stateParams.endDate)) {
            $state.go('error', { w: $stateParams.wikipediaId });
        }
        
        function isValidPageId(pageId) {
            return /^[1-9][0-9]*$/.test(pageId);
        }
    }

    /** @ngInject */
    function onEnterError($state, $stateParams, yaviDefaults) {
        // Read state parameters.
        $stateParams.wikipediaId = $stateParams.w || yaviDefaults.wikipediaId;
    }

})();
