(function() {
  'use strict';

  angular
    .module('yavi')
    .factory('yaviServer', factoryFunction);

  /** @ngInject */
  function factoryFunction($http, $interpolate) {

    var factory = {};

    factory.getPageActivityFeatures = function(pageId, wikipediaId, dateFrom, dateTo) {
      return $http
          .jsonp(buildPageActivityFeaturesQuery(pageId, wikipediaId, dateFrom, dateTo))
          .then(onSuccess, onError);

      function onSuccess(response) {
        if (angular.isDefined(response)
            && angular.isDefined(response.data)) {
          return response.data;
        }
        onError();
      }

      function onError() {
        throwYaviServerError('PageActivityFeatures could not be retrieved.');
      }
    }

    factory.getPageActivitySignal = function(pageId, wikipediaId, dateFrom, dateTo, signalType) {
      return $http
          .jsonp(buildPageActivitySignalQuery(pageId, wikipediaId, dateFrom, dateTo, signalType))
          .then(onSuccess, onError);

      function onSuccess(response) {
        if (angular.isDefined(response)
            && angular.isDefined(response.data)) {
          return response.data;
        }
        onError();
      }

      function onError() {
        throwYaviServerError('PageActivitySignal could not be retrieved.');
      }
    }

    factory.getRelatedPagesRanking = function(pageId, wikipediaId, dateFrom, dateTo) {
      return $http
          .jsonp(buildRelatedPagesRankingQuery(pageId, wikipediaId, dateFrom, dateTo))
          .then(onSuccess, onError);

      function onSuccess(response) {
        if (angular.isDefined(response)
            && angular.isDefined(response.data)) {
          return response.data;
        }
        onError();
      }

      function onError() {
        throwYaviServerError('RelatedPagesRanking could not be retrieved.');
      }
    }

    return factory;

    function buildPageActivityFeaturesQuery(pageId, wikipediaId, dateFrom, dateTo) {
      var queryTemplate = '';
      queryTemplate += 'https://gate.d5.mpi-inf.mpg.de/yavi-server/pageactivityfeatures?';
      queryTemplate += '&pageid={{pageId}}';
      queryTemplate += '&wikipediaid={{wikipediaId}}';
      queryTemplate += '&datefrom={{dateFrom}}';
      queryTemplate += '&dateto={{dateTo}}';
      queryTemplate += '&callback=JSON_CALLBACK';
      return $interpolate(queryTemplate)({
        pageId: pageId,
        wikipediaId: wikipediaId,
        dateFrom: dateFrom,
        dateTo: dateTo
      });
    }

    function buildPageActivitySignalQuery(pageId, wikipediaId, dateFrom, dateTo, signalType) {
      var queryTemplate = '';
      queryTemplate += 'https://gate.d5.mpi-inf.mpg.de/yavi-server/pageactivitysignal?';
      queryTemplate += '&pageid={{pageId}}';
      queryTemplate += '&wikipediaid={{wikipediaId}}';
      queryTemplate += '&datefrom={{dateFrom}}';
      queryTemplate += '&dateto={{dateTo}}';
      queryTemplate += '&signaltype={{signalType}}';
      queryTemplate += '&callback=JSON_CALLBACK';
      return $interpolate(queryTemplate)({
        pageId: pageId,
        wikipediaId: wikipediaId,
        dateFrom: dateFrom,
        dateTo: dateTo,
        signalType: signalType
      });
    }
    
    function buildRelatedPagesRankingQuery(pageId, wikipediaId, dateFrom, dateTo) {
      var queryTemplate = '';
      queryTemplate += 'https://gate.d5.mpi-inf.mpg.de/yavi-server/relatedpages?';
      queryTemplate += '&pageid={{pageId}}';
      queryTemplate += '&wikipediaid={{wikipediaId}}';
      queryTemplate += '&datefrom={{dateFrom}}';
      queryTemplate += '&dateto={{dateTo}}';
      queryTemplate += '&callback=JSON_CALLBACK';
      return $interpolate(queryTemplate)({
        pageId: pageId,
        wikipediaId: wikipediaId,
        dateFrom: dateFrom,
        dateTo: dateTo
      });
    }

    function throwYaviServerError(errorMessage) {
      throw $interpolate("Yavi Server: {{errorMessage}}.")({errorMessage: errorMessage});
    }
  }
  
})();
