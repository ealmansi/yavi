(function() {
    'use strict';

    angular
        .module('yavi')
        .factory('wikipediaPages', factoryFunction);

    /** @ngInject */
    function factoryFunction() {

        var factory = {};

        factory.isValidId = function(wikipediaPageId) {
            var wikipediaPageIdNum = +wikipediaPageId;
            return !isNaN(wikipediaPageIdNum) && wikipediaPageIdNum > 0;
        }

        return factory;
    }

})();
