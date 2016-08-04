(function() {
    'use strict';

    angular
        .module('yavi')
        .service('WikipediaApiError', serviceFunction);

    /** @ngInject */
    function serviceFunction() {

        function WikipediaApiError(message) {
            this.name = "WikipediaApiError";
            this.message = message;
        }

        WikipediaApiError.prototype = Object.create(Error.prototype);

        return WikipediaApiError;
    }

})();
