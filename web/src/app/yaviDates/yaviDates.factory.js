(function() {
    'use strict';

    angular
        .module('yavi')
        .factory('yaviDates', factoryFunction);

    /** @ngInject */
    function factoryFunction() {

        var factory = {};

        var yaviDateFormat = "YYYY-MM-DD";

        factory.isValidDate = function(date) {
            var dateMoment = moment(date, yaviDateFormat);
            return dateMoment.isValid();
        }

        factory.isValidRange = function(startDate, endDate) {
            var startDateMoment = moment(startDate, yaviDateFormat);
            var endDateMoment = moment(endDate, yaviDateFormat);
            return startDateMoment <= endDateMoment;
        }

        return factory;
    }

})();
