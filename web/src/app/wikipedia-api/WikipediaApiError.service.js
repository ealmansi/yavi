(function() {
    'use strict';

    angular
        .module('yavi')
        .service('WikipediaApiError', serviceFunction);

    /** @ngInject */
    function serviceFunction($interpolate) {

        function WikipediaApiError(pageId, message) {
            this.name = "WikipediaApiError";
            this.message = $interpolate("{{message}} | Page ID: {{pageId}}.")({message: message, pageId: pageId});
        }

        WikipediaApiError.prototype = Object.create(Error.prototype);

        return WikipediaApiError;

    }

})();
