(function() {
    'use strict';

    angular
        .module('yavi')
        .controller('HomeController', controllerFunction);

    /** @ngInject */
    function controllerFunction($stateParams, $log) {
        
        var home = this;

        home.query = $stateParams.query;
        home.wiki = $stateParams.wiki;

        home.showLoadingGraphic = false;

        return home;
    }
    
})();
