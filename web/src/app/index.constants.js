(function() {
    'use strict';

    angular
        .module('yavi')
        .constant('yaviDefaults', {
            query: '',
            startDate: '2014-01-01',
            endDate: '2014-03-01',
            wikipediaSourceId: 'en',
            commaDangle: null
        });

})();
