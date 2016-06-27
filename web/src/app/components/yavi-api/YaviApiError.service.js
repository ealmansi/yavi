(function() {
    'use strict';

    angular
        .module('yavi')
        .service('YaviApiError', serviceFunction);

    /** @ngInject */
    function serviceFunction($interpolate) {

        function YaviApiError(pageId, message) {
            this.name = "YaviApiError";
            this.message = $interpolate("{{message}} | Page ID: {{pageId}}.")({message: message, pageId: pageId});
        }

        YaviApiError.prototype = Object.create(Error.prototype);

        return YaviApiError;

    }

})();
