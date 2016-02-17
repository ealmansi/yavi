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
        pageId: '=',
        period: '='
      },
      templateUrl: 'app/explore-page/yv-explore-page-main-card/yvExplorePageMainCard.html'
    };

    return directive;
    
    /** @ngInject */
    function controllerFunction($scope, wikipediaPages, wikipediaSources) {
      var vm = this;
      
      //
      vm.carrouselSlides = [{
        image: '/assets/images/fallback-thumbnail.png',
        id: 0
      }];
      vm.carrouselNoWrap = false;

      // Check if page id is valid.
      if (!wikipediaPages.isValidId($scope.pageId)) {
        return;
      }
      
      // Get page and period.
      vm.page = wikipediaPages.getPageById($scope.pageId);
      vm.period = $scope.period;

      // TODO: deduplicate this code.
      vm.activeWikipediaSource = wikipediaSources.getActiveWikipediaSource();
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
