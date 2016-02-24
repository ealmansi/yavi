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

      // Relevant features to display.
      vm.featureLabelPairs = [
        {label: "No. Revisions", feature: "totalNumberOfRevisions"},
        {label: "Max. No. Revisions (1 day window)", feature: "numberOfRevisionsPeakOrder1"},
        {label: "Max. No. Revisions (3 day window)", feature: "numberOfRevisionsPeakOrder3"},
        {label: "Max. No. Revisions (5 day window)", feature: "numberOfRevisionsPeakOrder5"},
        {label: "Max. No. Revisions (7 day window)", feature: "numberOfRevisionsPeakOrder7"},
        {label: "Max. No. Revisions (10 day window)", feature: "numberOfRevisionsPeakOrder10"},
        {label: "No. Reverted Revisions", feature: "totalNumberOfRevertedRevisions"}
      ];

      angular.forEach(vm.featureLabelPairs, function(featureLabelPair) {
        vm.radarLabels.push(featureLabelPair.label);
      });

      var periodSelectionWatch = $rootScope.$on('periodSelection', function(event, newPeriod) {
        vm.period.startDate = newPeriod.startDate;
        vm.period.endDate = newPeriod.endDate;
        onPeriodSelection(vm.page, vm.period, vm.radarLabels, vm.radarSeries, vm.radarData, vm.featureLabelPairs);
      });

      $scope.$on('$destroy', periodSelectionWatch);
    }

    function onPeriodSelection(page, period, radarLabels, radarSeries, radarData, featureLabelPairs) {
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
          .then(function(titlePageActivityFeaturesPair) {
            var pageTitle = titlePageActivityFeaturesPair[0];
            var pageActivityFeatures = titlePageActivityFeaturesPair[1];
            radarSeries.push(prettifyRadarLabel(pageTitle));
            var pageActivityFeaturesVector = [];
            angular.forEach(featureLabelPairs, function(featureLabelPair) {
              var feature = featureLabelPair.feature;
              if (angular.isDefined(pageActivityFeatures[feature])) {
                pageActivityFeaturesVector.push(pageActivityFeatures[feature].toFixed(2));
              } else {
                pageActivityFeaturesVector.push(0.0);
              }
            });
            radarData.push(pageActivityFeaturesVector);
          });
        });
      });
    }

    function linkFunction(scope) {
      var page = scope.vm.page;
      var period = scope.vm.period;
      var radarLabels = scope.vm.radarLabels;
      var radarSeries = scope.vm.radarSeries;
      var radarData = scope.vm.radarData;
      var featureLabelPairs = scope.vm.featureLabelPairs;
      onPeriodSelection(page, period, radarLabels, radarSeries, radarData, featureLabelPairs);
    }

    function prettifyRadarLabel(label) {
      if (label.length == 0) {
        return label;
      }
      var displayLabel = label;
      displayLabel = displayLabel.charAt(0).toUpperCase() + displayLabel.slice(1);
      displayLabel = displayLabel.replace(/(?=[A-Z])/g," ");
      if (displayLabel.length > 30) {
        displayLabel = displayLabel.substring(0, 30) + "...";
      }
      return displayLabel;
    }
  }

})();
