(function() {
  'use strict';

  angular
    .module('yavi')
    .directive('yvPageInfoCard', directiveFunction);

  /** @ngInject */
  function directiveFunction($interpolate, $compile) {
    var directive = {
      controller: controllerFunction,
      controllerAs: 'vm',
      link: linkFunction,
      scope: true,
      restrict: 'E',
      templateUrl: 'app/explore-page/yv-page-info-card/yvPageInfoCard.html'
    };

    return directive;
    
    /** @ngInject */
    function controllerFunction($scope, $state, wikipediaSources) {
      var vm = this;

      // Get page and period.
      vm.page = $scope.$parent.vm.page;
      vm.period = $scope.$parent.vm.period;

      // Get active wikipedia source.
      vm.activeWikipediaSource = wikipediaSources.getActiveWikipediaSource();

      // Carrousel data.
      vm.carrouselSlides = getEmptyCarrouselSlides();

      // Callback when clicking a category.
      vm.onClickCategory = function(event) {
        if (angular.isDefined(event.currentTarget)) {
          var clickedCategoryElement = angular.element(event.currentTarget);
          var category = clickedCategoryElement.html();
          $state.go('home', {
            query: category
          });
        }
      }
    }

    function linkFunction(scope, element) {
      // Populate page title.
      scope.vm.page.getTitle().then(function(title) {
        var pageTitleElement = element.find('#page-title');
        pageTitleElement.html(title);
      });

      // Populate Wikipedia link.
      var pageWikipediaLinkElement = element.find('#page-wikipedia-link');
      var pageWikipediaLinkTemplate = 'https://{{wikipediaId}}.wikipedia.org/?curid={{pageId}}';
      pageWikipediaLinkElement.attr('href', $interpolate(pageWikipediaLinkTemplate)({
        wikipediaId: scope.vm.activeWikipediaSource.wikipediaId,
        pageId: scope.vm.page.pageId
      }));

      // Populate Google link.
      scope.vm.page.getTitle().then(function(title) {
        var pageGoogleLinkElement = element.find('#page-google-link');
        pageGoogleLinkElement.attr('href', 'https://google.com/?q=' + title);
      });

      // Populate carrousel.
      scope.vm.page.getImagesList().then(function(imagesList) {
        updateCarrouselSlides(scope.vm.carrouselSlides, imagesList);
      });

      // Populate description.
      scope.vm.page.getDescription().then(function(description) {
        var pageDescriptionElement = element.find('#page-description');
        pageDescriptionElement.html(description);
      });

      // Populate categories.
      scope.vm.page.getCategoryList().then(function(categoryList) {
        var listElement = element.find('#page-categories');
        var itemElementTemplate = '<span class="page-category label label-info" ng-click="vm.onClickCategory($event)">{{ category }}</span>';
        angular.forEach(categoryList, function(category) {
          var itemElementHTML = $interpolate(itemElementTemplate)({category: category});
          var itemElement = $compile(itemElementHTML)(scope);
          listElement.append(itemElement);
        });
      });
    }

    // Carrousel utility.
    function getEmptyCarrouselSlides() {
      return [{
        image: 'assets/images/fallback-thumbnail.png',
        id: 0
      }];
    }

    function updateCarrouselSlides(carrouselSlides, imagesList) {
      if (imagesList.length > 0) {
        carrouselSlides.length = 0;
        imagesList.sort(function(imageA, imageB) {
          return imageB.width * imageB.height - imageA.width * imageA.height;
        });
        var imageId = 0;
        angular.forEach(imagesList, function(image) {
          carrouselSlides.push({
            image: image.url,
            id: imageId
          });
          imageId += 1;
        });
      }
    }
  }

})();
