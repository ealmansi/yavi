(function() {
  'use strict';

  angular
    .module('yavi')
    .directive('yvExplorePagePopularityCard', directiveFunction);

  /** @ngInject */
  function directiveFunction(wikipediaPages, $q) {
    var directive = {
      controller: controllerFunction,
      controllerAs: 'vm',
      link: linkFunction,
      restrict: 'E',
      scope: {
        pageId: '=',
        period: '='
      },
      templateUrl: 'app/explore-page/yv-explore-page-popularity-card/yvExplorePagePopularityCard.html'
    };

    return directive;
    
    /** @ngInject */
    function controllerFunction($scope, $rootScope) {
      var vm = this;

      // Check if page id is valid.
      if (!wikipediaPages.isValidId($scope.pageId)) {
        return;
      }
      
      // Get page and period.
      vm.page = wikipediaPages.getPageById($scope.pageId);
      vm.period = $scope.period;

      // Radar properties.
      vm.radarLabels = [];
      vm.radarSeries = [];
      vm.radarData = [];

      var periodSelectionWatch = $rootScope.$on('periodSelection', function(event, newPeriod) {
        vm.period.startDate = newPeriod.startDate;
        vm.period.endDate = newPeriod.endDate;
        onPeriodSelection(vm.page, vm.period, vm.radarLabels, vm.radarSeries, vm.radarData);
      });

      $scope.$on('$destroy', periodSelectionWatch);
    }

    function onPeriodSelection(page, period, radarLabels, radarSeries, radarData) {
      radarSeries.length = 0;
      radarData.length = 0;
      page.getRelatedPages(period.startDate, period.endDate)
      .then(function(relatedPages) {
        var relatedPagesTop5 = relatedPages.slice(0, 5);
        angular.forEach(relatedPagesTop5, function(pageIdScorePair) {
          var relatedPageId = pageIdScorePair.pageId;
          var relatedPage = wikipediaPages.getPageById(relatedPageId);
          var titlePromise = relatedPage.getTitle();
          var pageActivityFeaturesPromise = relatedPage.getPageActivityFeatures(period.startDate, period.endDate);
          $q.all([titlePromise, pageActivityFeaturesPromise])
          .then(function(values) {
            if (values.length == 2) {
              var pageTitle = values[0];
              var pageActivityFeatures = values[1];
              radarSeries.push(prettifyRadarLabel(pageTitle));
              if (radarLabels.length == 0) {
                angular.forEach(pageActivityFeatures, function(value, key) {
                  radarLabels.push(prettifyRadarLabel(key));
                });
              }
              var pageActivityFeaturesVector = [];
              angular.forEach(pageActivityFeatures, function(value) {
                pageActivityFeaturesVector.push(value.toFixed(2));
              });
              radarData.push(pageActivityFeaturesVector);
            }
          });
        });
      });
    }

    function linkFunction(scope, element) {
      var page = scope.vm.page;
      var period = scope.vm.period;
      var radarLabels = scope.vm.radarLabels;
      var radarSeries = scope.vm.radarSeries;
      var radarData = scope.vm.radarData;
      onPeriodSelection(page, period, radarLabels, radarSeries, radarData);
    }

    function prettifyRadarLabel(label) {
      if (label.length == 0) {
        return label;
      }
      var displayLabel = label;
      displayLabel = displayLabel.charAt(0).toUpperCase() + displayLabel.slice(1);
      displayLabel = displayLabel.replace(/(?=[A-Z])/g," ");
      if (displayLabel.length > 35) {
        displayLabel = displayLabel.substring(0, 35) + "...";
      }
      return displayLabel;
    }
  }

})();
