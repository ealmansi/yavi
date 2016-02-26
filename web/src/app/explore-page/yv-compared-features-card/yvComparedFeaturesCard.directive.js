(function() {
  'use strict';

  angular
    .module('yavi')
    .directive('yvComparedFeaturesCard', directiveFunction);

  /** @ngInject */
  function directiveFunction() {
    var directive = {
      controller: controllerFunction,
      controllerAs: 'vm',
      restrict: 'E',
      scope: true,
      templateUrl: 'app/explore-page/yv-compared-features-card/yvComparedFeaturesCard.html'
    };

    return directive;
    
    /** @ngInject */
    function controllerFunction($scope) {
      var vm = this;

      // Get chart data.
      vm.relatedPagesRankingTitles = $scope.$parent.vm.relatedPagesRankingTitles;
      vm.relatedPagesRankingFeatures = $scope.$parent.vm.relatedPagesRankingFeatures;

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

      angular.forEach(vm.relatedPagesRankingTitles, function(relatedPageTitle) {
        vm.radarSeries.push(prettifyRadarLabel(relatedPageTitle));
      });

      angular.forEach(vm.relatedPagesRankingFeatures, function(pageActivityFeatures) {
        var pageActivityFeaturesVector = [];
        angular.forEach(vm.featureLabelPairs, function(featureLabelPair) {
          var feature = featureLabelPair.feature;
          if (angular.isDefined(pageActivityFeatures[feature])) {
            pageActivityFeaturesVector.push(pageActivityFeatures[feature].toFixed(2));
          } else {
            pageActivityFeaturesVector.push(0.0);
          }
        });
        vm.radarData.push(pageActivityFeaturesVector);
      });
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
