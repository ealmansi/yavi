(function() {
    'use strict';

    angular
        .module('yavi')
        .factory('wikipediaSources', factoryFunction);

    /** @ngInject */
    function factoryFunction() {

        var factory = {};

        var wikipediaSourceIds = ['en', 'de', 'ja', 'ru', 'es', 'fr', 'it', 'pt', 'zh', 'pl'];

        factory.isValidId = function(wikipediaSourceId) {
            return _.contains(wikipediaSourceIds, wikipediaSourceId);
        }

        return factory;
    }

})();
