(function() {
  'use strict';

  angular
    .module('yavi')
    .factory('wikipediaSources', factoryFunction);

  /** @ngInject */
  function factoryFunction(yaviConfig) {

    var factory = {};

    var wikipediaSources = [
      {wikipediaId: 'en', flagId: 'gb', language: 'English'},
      // {wikipediaId: 'de', flagId: 'de', language: 'Deutsch'},
      // {wikipediaId: 'ja', flagId: 'jp', language: '日本語'},
      // {wikipediaId: 'ru', flagId: 'ru', language: 'Русский'},
      {wikipediaId: 'es', flagId: 'es', language: 'Español'}
      // {wikipediaId: 'fr', flagId: 'fr', language: 'Français'},
      // {wikipediaId: 'it', flagId: 'it', language: 'Italiano'},
      // {wikipediaId: 'pt', flagId: 'pt', language: 'Português'},
      // {wikipediaId: 'zh', flagId: 'cn', language: '中文'},
      // {wikipediaId: 'pl', flagId: 'pl', language: 'Polski'}
    ];

    factory.getWikipediaSources = function() {
      return wikipediaSources;
    }

    factory.getWikipediaSourceById = function(wikipediaId) {
      var matchingWikipediaSource = undefined;
      angular.forEach(wikipediaSources, function(wikipediaSource) {
        if (wikipediaSource.wikipediaId == wikipediaId) {
          matchingWikipediaSource = wikipediaSource;
        }
      });
      return matchingWikipediaSource;
    }

    factory.getActiveWikipediaSource = function() {
      return factory.getWikipediaSourceById(yaviConfig.wikipediaId);
    }

    factory.setActiveWikipediaSourceById = function(wikipediaId) {
      yaviConfig.wikipediaId = wikipediaId;
    }

    return factory;
  }
  
})();
