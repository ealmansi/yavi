(function() {
  'use strict';

  angular
    .module('yavi')
    .factory('yaviServer', factoryFunction);

  /** @ngInject */
  function factoryFunction($http, yaviConfig, $interpolate) {

    var factory = {};

    factory.getPageSignal = function(signalType, pageId, dateFrom, dateTo) {
      return $http
        .jsonp(buildPageSignalQuery(signalType, pageId, dateFrom, dateTo))
        .then(onSuccess, onError);

      function onSuccess(response) {
        if (angular.isDefined(response)
            && angular.isDefined(response.data)) {
          return response.data;
        }
        onError();
      }

      function onError() {
        throwYaviServerError("Signal could not be retrieved");
      }
    }

    factory.getPageRelatedPages = function(pageId, dateFrom, dateTo) {
      return $http
        .jsonp(buildPageRelatedPagesQuery(pageId, dateFrom, dateTo))
        .then(onSuccess, onError);

      function onSuccess(response) {
        if (angular.isDefined(response)
            && angular.isDefined(response.data)) {
          return response.data;
        }
        onError();
      }

      function onError() {
        throwYaviServerError("RelatedPages could not be retrieved");
      }
    }

    return factory;

    function buildPageSignalQuery(signalType, pageId, dateFrom, dateTo) {
      var queryTemplate = '';
      queryTemplate += 'http://localhost:8080/yavi-server/signal?';
      queryTemplate += '&pageid={{pageId}}';
      queryTemplate += '&wikipediaid={{wikipediaId}}';
      queryTemplate += '&datefrom={{dateFrom}}';
      queryTemplate += '&dateto={{dateTo}}';
      queryTemplate += '&signaltype={{signalType}}';
      queryTemplate += '&callback=JSON_CALLBACK';
      return $interpolate(queryTemplate)({
        signalType: signalType,
        pageId: pageId,
        wikipediaId: yaviConfig.wikipediaId,
        dateFrom: dateFrom,
        dateTo: dateTo
      });
    }
    
    function buildPageRelatedPagesQuery(pageId, dateFrom, dateTo) {
      var queryTemplate = '';
      queryTemplate += 'http://localhost:8080/yavi-server/relatedpages?';
      queryTemplate += '&pageid={{pageId}}';
      queryTemplate += '&wikipediaid={{wikipediaId}}';
      queryTemplate += '&datefrom={{dateFrom}}';
      queryTemplate += '&dateto={{dateTo}}';
      queryTemplate += '&callback=JSON_CALLBACK';
      return $interpolate(queryTemplate)({
        pageId: pageId,
        wikipediaId: yaviConfig.wikipediaId,
        dateFrom: dateFrom,
        dateTo: dateTo
      });
    }

    function throwYaviServerError(errorMessage) {
      throw $interpolate("Yavi Server: {{errorMessage}}.")({errorMessage: errorMessage});
    }
  }
  
})();
