(function() {
    'use strict';

    angular
        .module('yavi')
        .controller('ErrorController', ErrorController);

    /** @ngInject */
    function ErrorController(
                $stateParams,
                $log
            ) {
        
        var self = this;

        return self;
    }
    
})();
