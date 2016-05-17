(function() {
  'use strict';

  angular
    .module('yavi')
    .controller('ExplorePageController', controllerFunction);

  /** @ngInject */
  function controllerFunction($compile,
                              $interpolate,
                              $location,
                              $q,
                              $rootScope,
                              $scope,
                              $state,
                              $stateParams,
                              $timeout,
                              toastr,
                              wikipediaPages,
                              yaviDefaults,
                              yvPageTitleConfig) {
    var vm = this;

    // Read state params.
    var pageId = $stateParams.pageId;
    var startDate = $stateParams.startDate;
    var endDate = $stateParams.endDate;

    // Check page id is valid
    if (!wikipediaPages.isValidId(pageId)) {
      $state.go('pageNotFound');
      return;
    }

    // Get page and period.
    vm.page = wikipediaPages.getPageById($stateParams.pageId);
    vm.period = {
      startDate: startDate || yaviDefaults.startDate,
      endDate: endDate || yaviDefaults.endDate
    };

    // Set html page title.
    vm.page.getTitle().then(function(title) {
      yvPageTitleConfig.setPageTitle(title);
    });

    // Get cards container element;
    var explorePageCardsLeft = angular.element('#explore-page-cards-left');
    var explorePageCardsRight = angular.element('#explore-page-cards-right');

    // Create page info card.
    var pageInfoCardElement = $compile('<yv-page-info-card></yv-page-info-card>')($scope);
    explorePageCardsLeft.append(pageInfoCardElement);

    // Create period selector card.
    var periodSelectionCardElement = $compile('<yv-period-selection-card></yv-period-selection-card>')($scope);
    explorePageCardsRight.append(periodSelectionCardElement);

    // Create related pages ranking card.
    updateRelatedPagesRankingCard();

    // Create page activity signal cards.
    vm.getPageActivitySignalTitle = getPageActivitySignalTitle;
    vm.pageActivitySignals = {};
    updatePageActivitySignalCards();

    // Create compared features card.
    updatePageComparedFeaturesCard();
    
    
    // Set up watch for period changes.
    var periodSelectionTimer = undefined;
    var periodSelectionWatch = $rootScope.$on('periodSelection', function(event, newPeriod) {
      if (angular.isDefined(periodSelectionTimer)) {
        $timeout.cancel(periodSelectionTimer);
      }
      periodSelectionTimer = $timeout(function() {
        vm.period.startDate = newPeriod.startDate;
        vm.period.endDate = newPeriod.endDate;
        updateRelatedPagesRankingCard();
        updatePageActivitySignalCards();
        updatePageComparedFeaturesCard();
      }, 100);
    });
    $scope.$on('$destroy', periodSelectionWatch);
    
    // Update functions.
    function updateRelatedPagesRankingCard() {
      var startDate = vm.period.startDate;
      var endDate = vm.period.endDate;
      vm.page.getRelatedPagesRanking(startDate, endDate)
      .then(function(relatedPagesRanking) {
        if (startDate == vm.period.startDate && endDate == vm.period.endDate) {
          if (relatedPagesRanking.length == 0) {
            var message = 'No related pages during this period.';
            toastr.info(message, 'Chart could not be displayed.');
          } else {
            vm.relatedPagesRanking = relatedPagesRanking;
            var relatedPagesRankingCardElement = angular.element('yv-related-pages-ranking-card');
            if (angular.isDefined(relatedPagesRankingCardElement)) {
              relatedPagesRankingCardElement.remove();
            }
            relatedPagesRankingCardElement = $compile('<yv-related-pages-ranking-card></yv-related-pages-ranking-card>')($scope);
            periodSelectionCardElement.after(relatedPagesRankingCardElement);
          }
        }
      });
    }
    
    function updatePageActivitySignalCards() {
      updatePageActivitySignalCard('numberofrevisions', explorePageCardsLeft);
      updatePageActivitySignalCard('pagecontentsize', explorePageCardsLeft);
      updatePageActivitySignalCard('numberofuniqueeditors', explorePageCardsRight);
    }

    function updatePageActivitySignalCard(signalType, explorePageCardsColumn) {
      var startDate = vm.period.startDate;
      var endDate = vm.period.endDate;
      vm.page.getPageActivitySignal(startDate, endDate, signalType)
      .then(function(pageActivitySignal) {
        if (startDate == vm.period.startDate && endDate == vm.period.endDate) {
          if (pageActivitySignal.length < 10) {
            var pageActivitySignalTitle = vm.getPageActivitySignalTitle(signalType);
            var messageTemplate = 'Not enough data points to plot {{pageActivitySignalTitle}} during this period.';
            var message = $interpolate(messageTemplate)({pageActivitySignalTitle: pageActivitySignalTitle});
            toastr.info(message, 'Chart could not be displayed.');
          } else {
            vm.pageActivitySignals[signalType] = pageActivitySignal;
            var pageActivitySignalCardSelectorTemplate = 'yv-page-activity-signal-card.{{signalType}}';
            var pageActivitySignalCardSelector = $interpolate(pageActivitySignalCardSelectorTemplate)({signalType: signalType});
            var pageActivitySignalCardElement = angular.element(pageActivitySignalCardSelector);
            if (angular.isDefined(pageActivitySignalCardElement)) {
              pageActivitySignalCardElement.remove();
            }
            var pageActivitySignalCardHTMLTemplate = '<yv-page-activity-signal-card class="{{signalType}}" signal-type="{{signalType}}"></yv-page-activity-signal-card>';
            var pageActivitySignalCardHTML = $interpolate(pageActivitySignalCardHTMLTemplate)({signalType: signalType});
            pageActivitySignalCardElement = $compile(pageActivitySignalCardHTML)($scope);
            explorePageCardsColumn.append(pageActivitySignalCardElement);
          }
        }
      });
    }

    function updatePageComparedFeaturesCard() {
      var startDate = vm.period.startDate;
      var endDate = vm.period.endDate;
      vm.page.getRelatedPagesRanking(startDate, endDate)
      .then(function(relatedPagesRanking) {
        if (startDate == vm.period.startDate && endDate == vm.period.endDate) {
          var relatedPagesRankingTop5 = relatedPagesRanking.slice(0, 5);
          var relatedPagesRankingTitles = [];
          var relatedPagesRankingFeatures = [];
          var pageActivityFeaturesWrappedPromises = [];
          angular.forEach(relatedPagesRankingTop5, function(pageIdTitleScore) {
            var relatedPageId = pageIdTitleScore.pageId;
            var title = pageIdTitleScore.title;
            var relatedPage = wikipediaPages.getPageById(relatedPageId);
            var pageActivityFeaturesWrappedPromise = relatedPage.getPageActivityFeatures(startDate, endDate)
            .then(function(pageActivityFeaturesVector) {
              relatedPagesRankingTitles.push(title);
              relatedPagesRankingFeatures.push(pageActivityFeaturesVector);
            })
            .catch(function() { /* Skip if vector cannot be retrieved. */ });
            pageActivityFeaturesWrappedPromises.push(pageActivityFeaturesWrappedPromise);
          });
          $q.all(pageActivityFeaturesWrappedPromises)
          .then(function() {
            vm.relatedPagesRankingTitles = relatedPagesRankingTitles;
            vm.relatedPagesRankingFeatures = relatedPagesRankingFeatures;
            var comparedFeaturesCardElement = angular.element('yv-compared-features-card');
            if (angular.isDefined(comparedFeaturesCardElement)) {
              comparedFeaturesCardElement.remove();
            }
            comparedFeaturesCardElement = $compile('<yv-compared-features-card></yv-compared-features-card>')($scope);
            pageInfoCardElement.after(comparedFeaturesCardElement);
          });
        }
      });
    }

    // Helper.
    function getPageActivitySignalTitle(signalType) {
      var title = undefined;
      switch(signalType) {
      case 'numberofrevisions':
        title = "Daily Number of Revisions";
        break;
      case 'pagecontentsize':
        title = "Page Content Size in Characters";
        break;
      case 'numberofrevertedrevisions':
        title = "Daily Number of Reverted Revisions";
        break;
      case 'numberofuniqueeditors':
        title = "Daily Number of Unique Editors";
        break;
      case 'numberofaddedinlinks':
        title = "Added Inlinks";
        break;
      case 'numberofaddedoutlinks':
        title = "Added Outlinks";
        break;
      case 'numberoftotaloutlinks':
        title = "Total Outlinks";
        break;
      default:
        title = '';
        break;
      }
      return title;
    }
  }

})();
