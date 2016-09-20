(function() {
    'use strict';

    angular
        .module('yavi')
        .config(config);

    /** @ngInject */
    function config($logProvider, $httpProvider, $provide) {
        // Logging enabled/disabled.
        $logProvider.debugEnabled(true);
        
        // Cache all http requests.
        $httpProvider.defaults.cache = true;

        // Custom exception handling.
        /** @ngInject */
        $provide.decorator("$exceptionHandler", function($log) {
            return function(exception) {
                $log.debug(exception.name, ':', exception.message);
            };
        });
    }

})();
