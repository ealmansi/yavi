(function() {
  'use strict';

  angular
    .module('yavi')
    .service('WikipediaPage', serviceFunction);

  /** @ngInject */
  function serviceFunction($q, wikipediaAPI, yaviServer) {
    return WikipediaPage;

    function WikipediaPage(pageId) {

      var self = this;

      self.pageId = pageId;

      // Page properties.
      var categoryList = undefined;
      var description = undefined;
      var imagesList = undefined;
      var numberOfAddedInlinksList = undefined;
      var numberOfAddedOutlinksList = undefined;
      var numberOfRevertedRevisionsList = undefined;
      var numberOfRevisionsList = undefined;
      var numberOfTotalOutlinksList = undefined;
      var numberOfUniqueEditorsList = undefined;
      var pageContentSizeList = undefined;
      var relatedPages = undefined;
      var thumbnail = undefined;
      var title = undefined;

      // Property promise getters.
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

      self.getNumberOfAddedInlinksList = function(dateFrom, dateTo) {
        if (angular.isUndefined(numberOfAddedInlinksList)) {
        return yaviServer.getPageSignal("numberofaddedinlinks", pageId, dateFrom, dateTo)
            .then(function(val) {
              numberOfAddedInlinksList = val;
              return numberOfAddedInlinksList;
            });
        }
        return $q.when(numberOfAddedInlinksList);
      }

      self.getNumberOfAddedOutlinksList = function(dateFrom, dateTo) {
        if (angular.isUndefined(numberOfAddedOutlinksList)) {
        return yaviServer.getPageSignal("numberofaddedoutlinks", pageId, dateFrom, dateTo)
            .then(function(val) {
              numberOfAddedOutlinksList = val;
              return numberOfAddedOutlinksList;
            });
        }
        return $q.when(numberOfAddedOutlinksList);
      }

      self.getNumberOfRevertedRevisionsList = function(dateFrom, dateTo) {
        if (angular.isUndefined(numberOfRevertedRevisionsList)) {
        return yaviServer.getPageSignal("numberofrevertedrevisions", pageId, dateFrom, dateTo)
            .then(function(val) {
              numberOfRevertedRevisionsList = val;
              return numberOfRevertedRevisionsList;
            });
        }
        return $q.when(numberOfRevertedRevisionsList);
      }

      self.getNumberOfRevisionsList = function(dateFrom, dateTo) {
        if (angular.isUndefined(numberOfRevisionsList)) {
        return yaviServer.getPageSignal("numberofrevisions", pageId, dateFrom, dateTo)
            .then(function(val) {
              numberOfRevisionsList = val;
              return numberOfRevisionsList;
            });
        }
        return $q.when(numberOfRevisionsList);
      }

      self.getNumberOfTotalOutlinksList = function(dateFrom, dateTo) {
        if (angular.isUndefined(numberOfTotalOutlinksList)) {
        return yaviServer.getPageSignal("numberoftotaloutlinks", pageId, dateFrom, dateTo)
            .then(function(val) {
              numberOfTotalOutlinksList = val;
              return numberOfTotalOutlinksList;
            });
        }
        return $q.when(numberOfTotalOutlinksList);
      }

      self.getNumberOfUniqueEditorsList = function(dateFrom, dateTo) {
        if (angular.isUndefined(numberOfUniqueEditorsList)) {
        return yaviServer.getPageSignal("numberofuniqueeditors", pageId, dateFrom, dateTo)
            .then(function(val) {
              numberOfUniqueEditorsList = val;
              return numberOfUniqueEditorsList;
            });
        }
        return $q.when(numberOfUniqueEditorsList);
      }

      self.getPageContentSizeList = function(dateFrom, dateTo) {
        if (angular.isUndefined(pageContentSizeList)) {
        return yaviServer.getPageSignal("pagecontentsize", pageId, dateFrom, dateTo)
            .then(function(val) {
              pageContentSizeList = val;
              return pageContentSizeList;
            });
        }
        return $q.when(pageContentSizeList);
      }

      self.getRelatedPages = function(dateFrom, dateTo) {
        if (angular.isUndefined(relatedPages)) {
          return yaviServer.getPageRelatedPages(pageId, dateFrom, dateTo)
              .then(function(val) {
                relatedPages = val;
                return relatedPages;
              });
        }
        return $q.when(relatedPages);
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
    }
  }

})();
