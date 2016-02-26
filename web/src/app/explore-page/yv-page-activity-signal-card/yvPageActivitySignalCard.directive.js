(function() {
  'use strict';

  angular
    .module('yavi')
    .directive('yvPageActivitySignalCard', directiveFunction);

  /** @ngInject */
  function directiveFunction($log, $interpolate) {
    var directive = {
      controller: controllerFunction,
      controllerAs: 'vm',
      link: linkFunction,
      restrict: 'E',
      scope: true,
      templateUrl: 'app/explore-page/yv-page-activity-signal-card/yvPageActivitySignalCard.html'
    };

    return directive;
    
    /** @ngInject */
    function controllerFunction($scope) {
      var vm = this;

      // Get page and period.
      vm.getPageActivitySignalTitle = $scope.$parent.vm.getPageActivitySignalTitle;
      vm.pageActivitySignals = $scope.$parent.vm.pageActivitySignals;
    }

    function linkFunction(scope, element) {
      if (element.length > 0
          && angular.isDefined(element[0].getAttribute('signal-type'))
          && angular.isDefined(scope.vm.pageActivitySignals))
      var signalType = element[0].getAttribute('signal-type');
      if (scope.vm.pageActivitySignals.hasOwnProperty(signalType)) {
        // Get data to display.
        var pageActivitySignal = scope.vm.pageActivitySignals[signalType];
        var pageActivitySignalTitle = scope.vm.getPageActivitySignalTitle(signalType);
        // Set card title.
        var pageActivitySignalTitleElement = element.find('.page-activity-signal-title');
        pageActivitySignalTitleElement.html(pageActivitySignalTitle);
        // Create chart.
        var pageActivitySignalChartIdTemplate = 'page-activity-signal-chart-{{signalType}}';
        var pageActivitySignalChartId = $interpolate(pageActivitySignalChartIdTemplate)({signalType: signalType});
        var pageActivitySignalChartWrapperElement = element.find('.page-activity-signal-chart-wrapper');
        var pageActivitySignalChartElementHTMLTemplate = '<div id={{chartId}} class="page-activity-signal-chart"></div>';
        var pageActivitySignalChartElementHTML = $interpolate(pageActivitySignalChartElementHTMLTemplate)({chartId: pageActivitySignalChartId});
        var pageActivitySignalChartElement = angular.element(pageActivitySignalChartElementHTML);
        pageActivitySignalChartWrapperElement.append(pageActivitySignalChartElement);
        createPageActivitySignalChart(pageActivitySignalChartId, pageActivitySignal);
      }
    }

    function createPageActivitySignalChart(chartId, dataProvider) {
      var chart = AmCharts.makeChart(chartId, {
        "type": "serial",
        "theme": "light",
        "marginRight": 40,
        "marginLeft": 40,
        "autoMarginOffset": 20,
        "dataDateFormat": "YYYY-MM-DD",
        "path": 'assets/images/amcharts/',
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
        // "valueScrollbar":{
        //   "oppositeAxis":false,
        //   "offset":50,
        //   "scrollbarHeight":10
        // },
        "categoryField": "date",
        "categoryAxis": {
          "parseDates": true,
          "dashLength": 1,
          "minorGridEnabled": true
        },
        "export": {
          "enabled": true
        },
        "dataProvider": dataProvider
      });

      chart.invalidateSize();
      
      chart.addListener("rendered", renderedListener);
      renderedListener();

      return chart;

      function renderedListener() {
        chart.zoomToIndexes(chart.dataProvider.length - 40, chart.dataProvider.length - 1);
      }
    }
  }

})();
