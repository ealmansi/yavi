(function() {
  'use strict';

  angular
    .module('yavi')
    .directive('yvExplorePageSignalsCard', directiveFunction);

  /** @ngInject */
  function directiveFunction(wikipediaPages) {
    var directive = {
      controller: controllerFunction,
      controllerAs: 'vm',
      restrict: 'E',
      scope: {
        pageId: '='
      },
      templateUrl: 'app/explore-page/yv-explore-page-signals-card/yvExplorePageSignalsCard.html'
    };

    return directive;
  
    /** @ngInject */
    function controllerFunction($scope, $timeout) {
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

      //
      if (!wikipediaPages.isValidId($scope.pageId)) {
        return;
      }
      
      vm.page = wikipediaPages.getPageById($scope.pageId);
      
      vm.makeChartNumberOfAddedInlinks = function() {
        if (angular.isUndefined(vm.numberOfAddedInlinksChart)) {
          vm.page.getNumberOfAddedInlinksList("2000-01-01", "2020-01-01")
              .then(function(numberOfAddedInlinksList) {
                  numberOfAddedInlinksList.sort(dateValueComparator);
                  vm.numberOfAddedInlinksChart = makeChart('chart-number-of-added-inlinks',
                      numberOfAddedInlinksList);
              });
        }
      }
      
      vm.makeChartNumberOfAddedOutlinks = function() {
        if (angular.isUndefined(vm.numberOfAddedOutlinksChart)) {
          vm.page.getNumberOfAddedOutlinksList("2000-01-01", "2020-01-01")
              .then(function(numberOfAddedOutlinksList) {
                  numberOfAddedOutlinksList.sort(dateValueComparator);
                  vm.numberOfAddedOutlinksChart = makeChart('chart-number-of-added-outlinks',
                      numberOfAddedOutlinksList);
              });
        }
      }
      
      vm.makeChartNumberOfRevertedRevisions = function() {
        if (angular.isUndefined(vm.numberOfRevertedRevisionsChart)) {
          vm.page.getNumberOfRevertedRevisionsList("2000-01-01", "2020-01-01")
              .then(function(numberOfRevertedRevisionsList) {
                  numberOfRevertedRevisionsList.sort(dateValueComparator);
                  vm.numberOfRevertedRevisionsChart = makeChart('chart-number-of-reverted-revisions',
                      numberOfRevertedRevisionsList);
              });
        }
      }
      
      vm.makeChartNumberOfRevisions = function() {
        if (angular.isUndefined(vm.numberOfRevisionsChart)) {
          vm.page.getNumberOfRevisionsList("2000-01-01", "2020-01-01")
              .then(function(numberOfRevisionsList) {
                  numberOfRevisionsList.sort(dateValueComparator);
                  vm.numberOfRevisionsChart = makeChart('chart-number-of-revisions',
                      numberOfRevisionsList);
              });
        }
      }
      
      vm.makeChartNumberOfTotalOutlinks = function() {
        if (angular.isUndefined(vm.numberOfTotalOutlinksChart)) {
          vm.page.getNumberOfTotalOutlinksList("2000-01-01", "2020-01-01")
              .then(function(numberOfTotalOutlinksList) {
                  numberOfTotalOutlinksList.sort(dateValueComparator);
                  vm.numberOfTotalOutlinksChart = makeChart('chart-number-of-total-outlinks',
                      numberOfTotalOutlinksList);
              });
        }
      }
      
      vm.makeChartNumberOfUniqueEditors = function() {
        if (angular.isUndefined(vm.numberOfUniqueEditorsChart)) {
          vm.page.getNumberOfUniqueEditorsList("2000-01-01", "2020-01-01")
              .then(function(numberOfUniqueEditorsList) {
                  numberOfUniqueEditorsList.sort(dateValueComparator);
                  vm.numberOfUniqueEditorsChart = makeChart('chart-number-of-unique-editors',
                      numberOfUniqueEditorsList);
              });
        }
      }
      
      vm.makeChartPageContentSize = function() {
        if (angular.isUndefined(vm.pageContentSizeChart)) {
          vm.page.getPageContentSizeList("2000-01-01", "2020-01-01")
              .then(function(pageContentSizeList) {
                  pageContentSizeList.sort(dateValueComparator);
                  vm.pageContentSizeChart = makeChart('chart-page-content-size',
                      pageContentSizeList);
              });
        }
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
          if (angular.isDefined(zoomedListenerTimer)) {
            $timeout.cancel(zoomedListenerTimer);
          }
          zoomedListenerTimer = $timeout(function() {
            $scope.$emit('periodSelection', {
              startDate: event.startDate,
              endDate: event.endDate
            });
          }, 50 /* zooomed event buffer wait */);
        }
      }
    }
  }

})();
