(function() {
  'use strict';

  angular
    .module('yavi')
    .service('WikipediaPage', serviceFunction);

  /** @ngInject */
  function serviceFunction(wikipediaAPI, yaviServer, yaviConfig, $q) {
    return WikipediaPage;

    function WikipediaPage(pageId) {

      var self = this;

      self.pageId = pageId;

      // Wikipedia API properties.
      var categoryList = undefined;
      var description = undefined;
      var imagesList = undefined;
      var thumbnail = undefined;
      var title = undefined;

      // Wikipedia API property getters.
      self.getCategoryList = function() {
        if (angular.isUndefined(categoryList)) {
          return wikipediaAPI.getPageCategories(pageId)
              .then(function(val) {
                categoryList = val;
                return categoryList;
              });
        }
        return $q.when(categoryList);
      }

      self.getDescription = function() {
        if (angular.isUndefined(description)) {
          return wikipediaAPI.getPageDescription(pageId)
              .then(function(val) {
                description = val;
                return description;
              });
        }
        return $q.when(description);
      }

      self.getImagesList = function() {
        if (angular.isUndefined(imagesList)) {
          return wikipediaAPI.getPageImagesList(pageId)
              .then(function(val) {
                imagesList = val;
                return imagesList;
              });
        }
        return $q.when(imagesList);
      }

      self.getThumbnail = function() {
        if (angular.isUndefined(thumbnail)) {
          return wikipediaAPI.getPageThumbnail(pageId)
              .then(function(val) {
                thumbnail = val;
                return thumbnail;
              });
        }
        return $q.when(thumbnail);
      }

      self.getTitle = function() {
        if (angular.isUndefined(title)) {
          return wikipediaAPI.getPageTitle(pageId)
              .then(function(val) {
                title = val;
                return title;
              });
        }
        return $q.when(title);
      }

      // Yavi property getters.
      self.getPageActivityFeatures = function(dateFrom, dateTo) {
        return yaviServer.getPageActivityFeatures(pageId, yaviConfig.wikipediaId, dateFrom, dateTo);
      }

      self.getPageActivitySignal = function(dateFrom, dateTo, signalType) {
        return yaviServer.getPageActivitySignal(pageId, yaviConfig.wikipediaId, dateFrom, dateTo, signalType);
      }

      self.getRelatedPages = function(dateFrom, dateTo) {
        return yaviServer.getRelatedPages(pageId, yaviConfig.wikipediaId, dateFrom, dateTo);
      }
    }
  }

})();
