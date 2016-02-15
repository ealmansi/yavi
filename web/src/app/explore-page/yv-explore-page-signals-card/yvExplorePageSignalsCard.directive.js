(function() {
  'use strict';

  angular
    .module('yavi')
    .directive('yvExplorePageSignalsCard', directiveFunction);

  /** @ngInject */
  function directiveFunction(wikipediaPages, $log) {
    var directive = {
      controller: controllerFunction,
      controllerAs: 'vm',
      restrict: 'E',
      scope: {
        pageId: '=',
        period: '='
      },
      templateUrl: 'app/explore-page/yv-explore-page-signals-card/yvExplorePageSignalsCard.html'
    };

    return directive;
  
    /** @ngInject */
    function controllerFunction($scope, $rootScope, $timeout) {
      var vm = this;

      //
      var zoomedListenerTimer = undefined;
      $scope.$on('$destroy', function() {
        if (angular.isDefined(zoomedListenerTimer)) {
          $timeout.cancel(zoomedListenerTimer);
        }
      });

      //
      vm.numberOfAddedInlinksChart = undefined;
      vm.numberOfAddedOutlinksChart = undefined;
      vm.numberOfRevertedRevisionsChart = undefined;
      vm.numberOfRevisionsChart = undefined;
      vm.numberOfTotalOutlinksChart = undefined;
      vm.numberOfUniqueEditorsChart = undefined;
      vm.pageContentSizeChart = undefined;

      // Check if page id is valid.
      if (!wikipediaPages.isValidId($scope.pageId)) {
        return;
      }
      
      // Get page and period.
      vm.page = wikipediaPages.getPageById($scope.pageId);
      vm.period = $scope.period;

      var startDate = vm.period.startDate, endDate = vm.period.endDate;
      var activeTab = undefined;
      vm.onSelect = function(tabId) {
        activeTab = tabId;
        switch (activeTab) {
        case 'number-of-added-inlinks':
          vm.makeChartNumberOfAddedInlinks(startDate, endDate);
          break;
        case 'number-of-added-outlinks':
          vm.makeChartNumberOfAddedOutlinks(startDate, endDate);
          break;
        case 'number-of-reverted-revisions':
          vm.makeChartNumberOfRevertedRevisions(startDate, endDate);
          break;
        case 'number-of-revisions':
          vm.makeChartNumberOfRevisions(startDate, endDate);
          break;
        case 'number-of-total-outlinks':
          vm.makeChartNumberOfTotalOutlinks(startDate, endDate);
          break;
        case 'number-of-unique-editors':
          vm.makeChartNumberOfUniqueEditors(startDate, endDate);
          break;
        case 'page-content-size':
          vm.makeChartPageContentSize(startDate, endDate);
          break;
        default:
          break;
        }
      }

      var periodSelectionWatch = $rootScope.$on('periodSelection', function(event, period) {
        startDate = period.startDate;
        endDate = period.endDate;
        vm.onSelect(activeTab);
      });

      $scope.$on('$destroy', periodSelectionWatch);
      
      vm.makeChartNumberOfAddedInlinks = function(startDate, endDate) {
          vm.page.getNumberOfAddedInlinksList(startDate, endDate)
              .then(function(numberOfAddedInlinksList) {
                  numberOfAddedInlinksList.sort(dateValueComparator);
                  vm.numberOfAddedInlinksChart = makeChart('chart-number-of-added-inlinks',
                      numberOfAddedInlinksList);
              });
      }
      
      vm.makeChartNumberOfAddedOutlinks = function(startDate, endDate) {
          vm.page.getNumberOfAddedOutlinksList(startDate, endDate)
              .then(function(numberOfAddedOutlinksList) {
                  numberOfAddedOutlinksList.sort(dateValueComparator);
                  vm.numberOfAddedOutlinksChart = makeChart('chart-number-of-added-outlinks',
                      numberOfAddedOutlinksList);
              });
      }
      
      vm.makeChartNumberOfRevertedRevisions = function(startDate, endDate) {
          vm.page.getNumberOfRevertedRevisionsList(startDate, endDate)
              .then(function(numberOfRevertedRevisionsList) {
                  numberOfRevertedRevisionsList.sort(dateValueComparator);
                  vm.numberOfRevertedRevisionsChart = makeChart('chart-number-of-reverted-revisions',
                      numberOfRevertedRevisionsList);
              });
      }
      
      vm.makeChartNumberOfRevisions = function(startDate, endDate) {
          vm.page.getNumberOfRevisionsList(startDate, endDate)
              .then(function(numberOfRevisionsList) {
                  numberOfRevisionsList.sort(dateValueComparator);
                  vm.numberOfRevisionsChart = makeChart('chart-number-of-revisions',
                      numberOfRevisionsList);
              });
      }
      
      vm.makeChartNumberOfTotalOutlinks = function(startDate, endDate) {
          vm.page.getNumberOfTotalOutlinksList(startDate, endDate)
              .then(function(numberOfTotalOutlinksList) {
                  numberOfTotalOutlinksList.sort(dateValueComparator);
                  vm.numberOfTotalOutlinksChart = makeChart('chart-number-of-total-outlinks',
                      numberOfTotalOutlinksList);
              });
      }
      
      vm.makeChartNumberOfUniqueEditors = function(startDate, endDate) {
          vm.page.getNumberOfUniqueEditorsList(startDate, endDate)
              .then(function(numberOfUniqueEditorsList) {
                  numberOfUniqueEditorsList.sort(dateValueComparator);
                  vm.numberOfUniqueEditorsChart = makeChart('chart-number-of-unique-editors',
                      numberOfUniqueEditorsList);
              });
      }
      
      vm.makeChartPageContentSize = function(startDate, endDate) {
          vm.page.getPageContentSizeList(startDate, endDate)
              .then(function(pageContentSizeList) {
                  pageContentSizeList.sort(dateValueComparator);
                  vm.pageContentSizeChart = makeChart('chart-page-content-size',
                      pageContentSizeList);
              });
      }

      function dateValueComparator(dateValueA, dateValueB) {
        var dateTimeA = new Date(dateValueA.date).getTime();
        var dateTimeB = new Date(dateValueB.date).getTime();
        var dateCompare = dateTimeA - dateTimeB;
        if (dateCompare != 0) {
          return dateCompare;
        } else {
          return dateValueA.value - dateValueB.value;
        }
      }

      function makeChart(divId, dataList) {
        angular.element('#' + divId).empty();
        var chart = AmCharts.makeChart(divId, {
          "type": "serial",
          "theme": "light",
          "marginRight": 40,
          "marginLeft": 40,
          "autoMarginOffset": 20,
          "dataDateFormat": "YYYY-MM-DD",
          "valueAxes": [{
            "id": "v1",
            "axisAlpha": 0,
            "position": "left",
            "ignoreAxisWidth":true
          }],
          "balloon": {
            "borderThickness": 1,
            "shadowAlpha": 0
          },
          "graphs": [{
            "id": "g1",
            "balloon":{
              "drop":true,
              "adjustBorderColor":false,
              "color":"#ffffff"
            },
            "bullet": "round",
            "bulletBorderAlpha": 1,
            "bulletColor": "#FFFFFF",
            "bulletSize": 5,
            "hideBulletsCount": 50,
            "lineThickness": 2,
            "title": "red line",
            "useLineColorForBulletBorder": true,
            "valueField": "value",
            "balloonText": "<span style='font-size:18px;'>[[value]]</span>"
          }],
          "chartScrollbar": {
            "graph": "g1",
            "oppositeAxis":false,
            "offset":30,
            "scrollbarHeight": 80,
            "backgroundAlpha": 0,
            "selectedBackgroundAlpha": 0.1,
            "selectedBackgroundColor": "#888888",
            "graphFillAlpha": 0,
            "graphLineAlpha": 0.5,
            "selectedGraphFillAlpha": 0,
            "selectedGraphLineAlpha": 1,
            "autoGridCount":true,
            "color":"#AAAAAA"
          },
          "chartCursor": {
            "pan": true,
            "valueLineEnabled": true,
            "valueLineBalloonEnabled": true,
            "cursorAlpha":1,
            "cursorColor":"#258cbb",
            "limitToGraph":"g1",
            "valueLineAlpha":0.2
          },
          "valueScrollbar":{
            "oppositeAxis":false,
            "offset":50,
            "scrollbarHeight":10
          },
          "categoryField": "date",
          "categoryAxis": {
            "parseDates": true,
            "dashLength": 1,
            "minorGridEnabled": true
          },
          "export": {
            "enabled": true
          },
          "dataProvider": dataList
        });

        chart.invalidateSize();
        
        chart.addListener("rendered", renderedListener);
        renderedListener();

        chart.addListener("zoomed", zoomedListener);

        return chart;

        function renderedListener() {
          chart.zoomToIndexes(chart.dataProvider.length - 40, chart.dataProvider.length - 1);
        }

        function zoomedListener(event) {
          // if (angular.isDefined(zoomedListenerTimer)) {
          //   $timeout.cancel(zoomedListenerTimer);
          // }
          // zoomedListenerTimer = $timeout(function() {
          //   $scope.$emit('periodSelection', {
          //     startDate: event.startDate,
          //     endDate: event.endDate
          //   });
          // }, 50 /* zooomed event buffer wait */);
        }
      }
    }
  }

})();
