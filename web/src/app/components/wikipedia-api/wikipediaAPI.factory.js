(function() {
  'use strict';

  angular
    .module('yavi')
    .factory('wikipediaAPI', factoryFunction);

  /** @ngInject */
  function factoryFunction($http, yaviConfig, $q, $interpolate) {

    var factory = {};

    factory.getPageCategories = function(pageId) {
      return $http
        .jsonp(buildPageCategoriesQuery(pageId))
        .then(onSuccess, onError);

      function onSuccess(response) {
        if (response
            && response.data
            && response.data.query
            && response.data.query.pages
            && response.data.query.pages[pageId]
            && response.data.query.pages[pageId].categories) {
          var categories = response.data.query.pages[pageId].categories;
          var categoryTitles = [];
          angular.forEach(categories, function(category) {
            var categoryTitle = category.title;
            var categoryTitleNoPrefix =
                categoryTitle.substr(categoryTitle.indexOf(':') + 1, categoryTitle.length);
            this.push(categoryTitleNoPrefix);
          }, categoryTitles);
          return categoryTitles;
        }
        onError();
      }

      function onError() {
        throwWikipediaAPIError("Categories could not be retrieved");
      }
    }

    factory.getPageDescription = function(pageId) {
      return $http
        .jsonp(buildPageBasicDataQuery(pageId))
        .then(onSuccess, onError);

      function onSuccess(response) {
        if (response
            && response.data
            && response.data.query
            && response.data.query.pages
            && response.data.query.pages[pageId]
            && response.data.query.pages[pageId].extract) {
          return response.data.query.pages[pageId].extract;
        }
        onError();
      }

      function onError() {
        throwWikipediaAPIError("Description could not be retrieved");
      }
    }

    factory.getPageImagesList = function(pageId) {
      return $http
        .jsonp(buildPageImagesListQuery(pageId))
        .then(onSuccess, onError);

      function onSuccess(response) {
        var acceptedImageExtensions = ['bmp', 'eps', 'gif', 'jpeg', 'jpg',
                                      'pcd', 'pct', 'pdf', 'pict', 'png',
                                      'ps', 'psd', 'pub', 'svg', 'thm'];
                                      
        var blackListedImages = ['commons-logo.svg', 'ambox_scales.svg', 'ambox_current_red.svg',
                                  'star_full.svg', 'star_empty.svg', 'searchtool.svg',
                                  'crystal_clear_app_browser.png', 'padlock.svg', 'padlock-silver.svg',
                                  'padlock-olive.svg', 'ambox_outdated_serious.svg', 'wikinews-logo.svg'];

        if (response
            && response.data
            && response.data.query
            && response.data.query.pages) {
          var imageObjects = {};
          angular.forEach(response.data.query.pages, function(page) {
            if (page.imageinfo
                && page.imageinfo.length > 0
                && page.imageinfo[0].url
                && page.imageinfo[0].width
                && page.imageinfo[0].height) {
              var url = page.imageinfo[0].url;
              var width = page.imageinfo[0].width;
              var height = page.imageinfo[0].height;
              if (!imageObjects.hasOwnProperty(url)) {
                if (100 <= width && width <= 1000 && 100 <= height && height <= 1000) {
                  var urlLowerCase = url.toLowerCase();
                  var isBlackListed = false;
                  angular.forEach(blackListedImages, function(blackListedImage) {
                    if (urlLowerCase.indexOf(blackListedImage) !== -1) {
                      isBlackListed = true;
                    }
                  });
                  if (!isBlackListed) {
                    var extension = urlLowerCase.split('.').pop();
                    if (acceptedImageExtensions.indexOf(extension) !== -1) {
                      imageObjects[url] = {
                        url: url,
                        width: width,
                        height: height
                      };
                    }
                  }
                }
              }
            }
          });
          var imageList = [];
          angular.forEach(imageObjects, function(imageObject) {
            imageList.push(imageObject);
          })
          return imageList;
        }
        onError();
      }

      function onError() {
        throwWikipediaAPIError("Images list could not be retrieved");
      }
    }

    factory.getPageThumbnail = function(pageId) {
      return $http
        .jsonp(buildPageThumbnailQuery(pageId))
        .then(onSuccess, onError);

      function onSuccess(response) {
        if (response
            && response.data
            && response.data.query
            && response.data.query.pages
            && response.data.query.pages[pageId]
            && response.data.query.pages[pageId].thumbnail
            && response.data.query.pages[pageId].thumbnail.source) {
          return response.data.query.pages[pageId].thumbnail.source;
        }
        onError();
      }

      function onError() {
        throwWikipediaAPIError("Thumbnail could not be retrieved");
      }
    }

    factory.getPageTitle = function(pageId) {
      return $http
        .jsonp(buildPageBasicDataQuery(pageId))
        .then(onSuccess, onError);

      function onSuccess(response) {
        if (response
            && response.data
            && response.data.query
            && response.data.query.pages
            && response.data.query.pages[pageId]
            && response.data.query.pages[pageId].title) {
          return response.data.query.pages[pageId].title;
        }
        onError();
      }

      function onError() {
        throwWikipediaAPIError("Title could not be retrieved");
      }
    }

    factory.searchQuery = function(query) {
      return $http
        .jsonp(buildSearchQuery(query))
        .then(onSuccess, onError);

      function onSuccess(response) {
        if (response
            && response.data
            && response.data.query
            && response.data.query.search
            && angular.isArray(response.data.query.search)) {
          var queryResults = response.data.query.search;
          var pageIdPromises = [];
          angular.forEach(queryResults, function(queryResult) {
            if (angular.isDefined(queryResult.title)) {
              var pageTitle = queryResult.title;
              var pageIdPromise = factory.getPageIdByTitle(pageTitle);
              pageIdPromises.push(pageIdPromise);
            }
          });
          return pageIdPromises;
        }
        onError();
      }

      function onError() {
        throwWikipediaAPIError("Query results could not be retrieved");
      }
    }

    factory.getPageIdByTitle = function(title) {
      return $http
        .jsonp(buildPageIdByTitleQuery(title))
        .then(onSuccess, onError);

      function onSuccess(response) {
        if (response
            && response.data
            && response.data.query
            && response.data.query.pages) {
          var pageIdArray = Object.keys(response.data.query.pages);
          if (pageIdArray.length > 0 && pageIdArray[0] != -1) {
            return pageIdArray[0];
          }
        }
        onError();
      }

      function onError() {
        throwWikipediaAPIError("Page Id could not be retrieved");
      }
    }

    return factory;

    function buildPageCategoriesQuery(pageId) {
      var queryTemplate = '';
      queryTemplate += 'https://{{wikipediaId}}.wikipedia.org/w/api.php?';
      queryTemplate += '&pageids={{pageId}}';
      queryTemplate += '&action=query';
      queryTemplate += '&prop=categories';
      queryTemplate += '&clshow=!hidden';
      queryTemplate += '&format=json';
      queryTemplate += '&callback=JSON_CALLBACK';
      return $interpolate(queryTemplate)({
        wikipediaId: yaviConfig.wikipediaId,
        pageId: pageId
      });
    }

    function buildPageBasicDataQuery(pageId) {
      var queryTemplate = '';
      queryTemplate += 'https://{{wikipediaId}}.wikipedia.org/w/api.php?';
      queryTemplate += '&pageids={{pageId}}';
      queryTemplate += '&action=query';
      queryTemplate += '&prop=extracts';
      queryTemplate += '&exintro=';
      queryTemplate += '&explaintext=';
      queryTemplate += '&format=json';
      queryTemplate += '&callback=JSON_CALLBACK';
      return $interpolate(queryTemplate)({
        wikipediaId: yaviConfig.wikipediaId,
        pageId: pageId
      });
    }

    function buildPageImagesListQuery(pageId) {
      var queryTemplate = '';
      queryTemplate += 'https://{{wikipediaId}}.wikipedia.org/w/api.php?';
      queryTemplate += '&pageids={{pageId}}';
      queryTemplate += '&action=query';
      queryTemplate += '&generator=images';
      queryTemplate += '&prop=imageinfo';
      queryTemplate += '&iiprop=url|dimensions';
      queryTemplate += '&gimlimit=10';
      queryTemplate += '&format=json';
      queryTemplate += '&callback=JSON_CALLBACK';
      return $interpolate(queryTemplate)({
        wikipediaId: yaviConfig.wikipediaId,
        pageId: pageId
      });
    }

    function buildPageThumbnailQuery(pageId) {
      var queryTemplate = '';
      queryTemplate += 'https://{{wikipediaId}}.wikipedia.org/w/api.php?';
      queryTemplate += '&pageids={{pageId}}';
      queryTemplate += '&action=query';
      queryTemplate += '&prop=pageimages';
      queryTemplate += '&pithumbsize=500';
      queryTemplate += '&format=json';
      queryTemplate += '&callback=JSON_CALLBACK';
      return $interpolate(queryTemplate)({
        wikipediaId: yaviConfig.wikipediaId,
        pageId: pageId
      });
    }

    function buildSearchQuery(query) {
      var queryTemplate = '';
      queryTemplate += 'https://{{wikipediaId}}.wikipedia.org/w/api.php?';
      queryTemplate += '&action=query';
      queryTemplate += '&list=search';
      queryTemplate += '&srsearch={{query}}';
      queryTemplate += '&srnamespace=0';
      queryTemplate += '&srwhat=text';
      queryTemplate += '&srprop=size';
      queryTemplate += '&indexpageids=';
      queryTemplate += '&redirects=';
      queryTemplate += '&srlimit=20';
      queryTemplate += '&format=json';
      queryTemplate += '&callback=JSON_CALLBACK';
      return $interpolate(queryTemplate)({
        wikipediaId: yaviConfig.wikipediaId,
        query: query
      });
    }

    function buildPageIdByTitleQuery(title) {
      var queryTemplate = '';
      queryTemplate += 'https://{{wikipediaId}}.wikipedia.org/w/api.php?';
      queryTemplate += '&titles={{title}}';
      queryTemplate += '&action=query';
      queryTemplate += '&format=json';
      queryTemplate += '&callback=JSON_CALLBACK';
      return $interpolate(queryTemplate)({
        wikipediaId: yaviConfig.wikipediaId,
        title: title
      });
    }

    function throwWikipediaAPIError(errorMessage) {
      throw $interpolate("Wikipedia API: {{errorMessage}}.")({errorMessage: errorMessage});
    }
  }
  
})();
