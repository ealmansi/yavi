(function() {
    'use strict';

    angular
        .module('yavi')
        .factory('wikipediaSources', factoryFunction);

    /** @ngInject */
    function factoryFunction() {

        var factory = {};

        var wikipediaIds = ['en', 'de', 'ja', 'ru', 'es', 'fr', 'it', 'pt', 'zh', 'pl'];

        factory.isValidId = function(wikipediaId) {
            return _.contains(wikipediaIds, wikipediaId);
        }

        return factory;
    }

})();
