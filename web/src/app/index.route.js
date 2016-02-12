(function() {
  'use strict';

  angular
    .module('yavi')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider, $locationProvider) {
    $stateProvider
      .state('home', {
        url: '/:query?',
        templateUrl: 'app/home/home.html',
        controller: 'HomeController',
        controllerAs: 'vm'
      });

    $stateProvider
      .state('explorePage', {
        url: '/explorePage/:pageId',
        templateUrl: 'app/explore-page/explorePage.html',
        controller: 'ExplorePageController',
        controllerAs: 'vm'
      });

    $stateProvider
      .state('pageNotFound', {
        url: '/pageNotFound/',
        templateUrl: 'app/page-not-found/pageNotFound.html',
        controller: 'PageNotFoundController',
        controllerAs: 'vm'
      });

    $urlRouterProvider.otherwise('/');

    $locationProvider.html5Mode(true);
  }

})();
