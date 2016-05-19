(function() {
    'use strict';

    angular
        .module('yavi')
        .controller('ExploreController', controllerFunction);

    /** @ngInject */
    function controllerFunction($stateParams, $log) {

        var explore = this;

        explore.start = $stateParams.start;
        explore.end = $stateParams.end;
        explore.wiki = $stateParams.wiki;

        return explore;
    }
    
})();
