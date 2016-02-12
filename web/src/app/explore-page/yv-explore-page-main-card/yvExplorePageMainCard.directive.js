(function() {
  'use strict';

  angular
    .module('yavi')
    .directive('yvExplorePageMainCard', directiveFunction);

  /** @ngInject */
  function directiveFunction(yaviConfig, wikipediaSources, $interpolate) {
    var directive = {
      controller: controllerFunction,
      controllerAs: 'vm',
      link: linkFunction,
      restrict: 'E',
      scope: {
        pageId: '='
      },
      templateUrl: 'app/explore-page/yv-explore-page-main-card/yvExplorePageMainCard.html'
    };

    return directive;
    
    /** @ngInject */
    function controllerFunction(wikipediaPages, $scope) {
      var vm = this;
      
      //
      vm.carrouselSlides = [{
        image: '/assets/images/fallback-thumbnail.png',
        id: 0
      }];
      vm.carrouselNoWrap = false;

      //
      if (!wikipediaPages.isValidId($scope.pageId)) {
        return;
      }
      
      vm.page = wikipediaPages.getPageById($scope.pageId);

      // TODO: deduplicate this code.
      vm.activeWikipediaSource = getWikipediaSourceById(yaviConfig.wikipediaId);
      function getWikipediaSourceById(wikipediaId) {
        var matchingWikipediaSource = undefined;
        angular.forEach(wikipediaSources, function(wikipediaSource) {
          if (wikipediaSource.wikipediaId == wikipediaId) {
            matchingWikipediaSource = wikipediaSource;
          }
        });
        return matchingWikipediaSource;
      }
    }

    function linkFunction(scope, element) {
      scope.vm.page.getImagesList().then(function(imagesList) {
        if (imagesList.length > 0) {
          scope.vm.carrouselSlides = [];
          imagesList.sort(function(imageA, imageB) {
            return imageB.width * imageB.height - imageA.width * imageA.height;
          });
          var imageId = 0;
          angular.forEach(imagesList, function(image) {
            scope.vm.carrouselSlides.push({
              image: image.url,
              id: imageId
            });
            imageId += 1;
          });
        }
      });

      scope.vm.page.getTitle().then(function(title) {
        element.find('#page-title')
            .html(title);
      });
      
      scope.vm.page.getDescription().then(function(description) {
        var pageDescriptionElement = element.find('#page-description');
        pageDescriptionElement.html(description);
        pageDescriptionElement.dotdotdot({
          ellipsis: ' ...'
        });
      });

      scope.vm.page.getCategoryList().then(function(categoryList) {
        var listElement = element.find('#page-category-list');
        var itemElementTemplate = '<li class="page-category-item">{{ category }}</li>';
        angular.forEach(categoryList, function(category) {
          listElement.append($interpolate(itemElementTemplate)({
            category: category
          }));
        });
      });

      var pageWikipediaLinkElement = element.find('#page-wikipedia-link');
      var pageWikipediaLinkTemplate = 'https://{{wikipediaId}}.wikipedia.org/?curid={{pageId}}';
      pageWikipediaLinkElement.attr('href', $interpolate(pageWikipediaLinkTemplate)({
        wikipediaId: scope.vm.activeWikipediaSource.wikipediaId,
        pageId: scope.vm.page.pageId
      }));

      scope.vm.page.getTitle().then(function(title) {
        var pageGoogleLinkElement = element.find('#page-google-link');
        pageGoogleLinkElement.attr('href', 'https://google.com/?q=' + title);
      });
    }
  }

})();
