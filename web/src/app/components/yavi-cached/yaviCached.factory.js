(function() {
    'use strict';

    angular
        .module('yavi')
        .factory('yaviCached', factoryFunction);

    /** @ngInject */
    function factoryFunction($q) {

        var factory = function(wrappedFunction) {
            var cachedValue = undefined;
            return function() {
                if (_.isUndefined(cachedValue)) {
                    return wrappedFunction()
                        .then(function(value) {
                            return cachedValue = value;
                        });
                }
                return $q.when(cachedValue);
            }
        };

        return factory;
    }

})();
