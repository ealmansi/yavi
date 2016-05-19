(function() {
    'use strict';

    angular
        .module('yavi')
        .controller('ErrorController', controllerFunction);

    /** @ngInject */
    function controllerFunction($stateParams, $log) {
        
        var error = this;

        error.wiki = $stateParams.wiki;

        return error;
    }
    
})();
