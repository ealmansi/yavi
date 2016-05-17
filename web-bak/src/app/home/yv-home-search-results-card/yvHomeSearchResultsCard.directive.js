(function() {
  'use strict';

  angular
    .module('yavi')
    .directive('yvHomeSearchResultsCard', directiveFunction);

  /** @ngInject */
  function directiveFunction($interpolate) {
    var directive = {
      controller: controllerFunction,
      controllerAs: 'vm',
      link: linkFunction,
      restrict: 'E',
      scope: {
        pageId: '='
      },
      templateUrl: 'app/home/yv-home-search-results-card/yvHomeSearchResultsCard.html'
    };

    return directive;

    /** @ngInject */
    function controllerFunction($scope, $state, wikipediaPages) {
      var vm = this;

      vm.page = wikipediaPages.getPageById($scope.pageId);

      vm.onCardClick = function() {
        $state.go('explorePage', {
          pageId: vm.page.pageId
        });
      }
    }

    function linkFunction(scope, element) {
      scope.vm.page.getThumbnail().then(function(thumbnail) {
        var backgroundImageTemplate = "url('{{ thumbnail }}')";
        element.find('.page-thumbnail')
            .css('background-image', $interpolate(backgroundImageTemplate)({
              thumbnail: thumbnail
            }));
      });

      scope.vm.page.getTitle().then(function(title) {
        element.find('.page-title')
            .html(title);
      });
      
      scope.vm.page.getDescription().then(function(description) {
        var normalizedDescription = description;
        normalizedDescription = normalizedDescription.replace(/style="display: block;"/g, '');
        normalizedDescription = normalizedDescription.replace(/<ul>|<\/ul>/g, '');
        normalizedDescription = normalizedDescription.replace(/<li>|<\/li>/g, '');
        normalizedDescription = normalizedDescription.replace(/<p>|<\/p>/g, '');
        normalizedDescription = normalizedDescription.replace(/<dl>|<\/dl>/g, '');
        normalizedDescription = normalizedDescription.replace(/<dt>|<\/dt>/g, '');
        var pageDescriptionElement = element.find('.page-description');
        pageDescriptionElement.html(normalizedDescription);
        pageDescriptionElement.dotdotdot({
          ellipsis: ' ...'
        });
      });

      scope.vm.page.getCategoryList().then(function(categoryList) {
        var listElement = element.find('.page-category-list');
        var itemElementTemplate = '<li class="page-category-item">{{ category }}</li>';
        angular.forEach(categoryList, function(category) {
          listElement.append($interpolate(itemElementTemplate)({
            category: category
          }));
        });
      });
    }
  }

})();
