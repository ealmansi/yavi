(function() {
  'use strict';

  angular
    .module('yavi')
    .constant('wikipediaSources', [
      {wikipediaId: 'en', flagId: 'gb', language: 'English'},
      {wikipediaId: 'de', flagId: 'de', language: 'Deutsch'},
      {wikipediaId: 'ja', flagId: 'jp', language: '日本語'},
      {wikipediaId: 'ru', flagId: 'ru', language: 'Русский'},
      {wikipediaId: 'es', flagId: 'es', language: 'Español'},
      {wikipediaId: 'fr', flagId: 'fr', language: 'Français'},
      {wikipediaId: 'it', flagId: 'it', language: 'Italiano'},
      {wikipediaId: 'pt', flagId: 'pt', language: 'Português'},
      {wikipediaId: 'zh', flagId: 'cn', language: '中文'},
      {wikipediaId: 'pl', flagId: 'pl', language: 'Polski'}
    ]);

})();
