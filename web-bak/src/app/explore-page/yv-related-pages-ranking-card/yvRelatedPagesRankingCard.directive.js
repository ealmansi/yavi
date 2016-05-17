(function() {
  'use strict';

  angular
    .module('yavi')
    .directive('yvRelatedPagesRankingCard', directiveFunction);

  /** @ngInject */
  function directiveFunction($interpolate) {
    var directive = {
      controller: controllerFunction,
      controllerAs: 'vm',
      link: linkFunction,
      restrict: 'E',
      scope: true,
      templateUrl: 'app/explore-page/yv-related-pages-ranking-card/yvRelatedPagesRankingCard.html'
    };

    return directive;
  
    /** @ngInject */
    function controllerFunction(wikipediaPages, $scope, $state) {
      var vm = this;

      // Get page and period.
      vm.page = $scope.$parent.vm.page;
      vm.period = $scope.$parent.vm.period;

      // Get related pages ranking data.
      vm.relatedPagesRanking = $scope.$parent.vm.relatedPagesRanking;

      vm.onItemClickFunction = function(item) {
        $state.go('explorePage', {
          pageId: item.pageId,
          startDate: vm.period.startDate,
          endDate: vm.period.endDate
        });
      }
    }

    function linkFunction(scope) {
      var bubbleChartContainerSelector = '#related-pages-ranking-chart';
      var bubbleChartData = {
          items: buildChartItems(scope.vm.relatedPagesRanking),
          classed: classedFunction,
          eval: evalFunction
      };
      var onItemClickFunction = scope.vm.onItemClickFunction;
      createBubbleChart(bubbleChartContainerSelector, bubbleChartData, onItemClickFunction);
    }

    function buildChartItems(relatedPagesRanking) {
      var items = [];
      var itemRanking = 1;
      angular.forEach(relatedPagesRanking, function(pageIdTitleScore) {
        items.push({
          pageId: pageIdTitleScore.pageId,
          text: pageIdTitleScore.title,
          score: Math.min(pageIdTitleScore.score, 100000.0),
          count: itemRanking
        });
        itemRanking += 1;
      });
      return items;
    }

    function classedFunction(item) {
      var itemClassTemplate = 'related-page-{{pageId}}';
      return $interpolate(itemClassTemplate)({pageId: item.pageId});
    }

    function evalFunction(item) {
      return item.score;
    }

    function createBubbleChart(bubbleChartContainerSelector, bubbleChartData, onItemClickFunction) {
      new d3.svg.BubbleChart({
        supportResponsive: true,
        container: bubbleChartContainerSelector,
        size: 600,
        //viewBoxSize: => use @default
        innerRadius: 600 / 3.5,
        //outerRadius: => use @default
        radiusMin: 50,
        //radiusMax: use @default
        //intersectDelta: use @default
        //intersectInc: use @default
        //circleColor: use @default
        data: bubbleChartData,
        plugins: [
          {
            name: "central-click",
            options: {
              text: "(See more detail)",
              style: {
                "font-size": "12px",
                "font-style": "italic",
                "font-family": "Source Sans Pro, sans-serif",
                //"font-weight": "700",
                "text-anchor": "middle",
                "fill": "black"
              },
              attr: {dy: "65px"},
              centralClick: onItemClickFunction
            }
          },
          {
            name: "lines",
            options: {
              format: [
                {// Line #0
                  textField: "text",
                  classed: {text: true},
                  style: {
                    "font-size": "24px",
                    "font-family": "Source Sans Pro, sans-serif",
                    "text-anchor": "middle",
                    fill: "black"
                  },
                  attr: {
                    dy: "0px",
                    x: function (d) {return d.cx;},
                    y: function (d) {return d.cy;}
                  }
                },
                {// Line #1
                  textField: "count",
                  classed: {count: true},
                  style: {
                    "font-size": "14px",
                    "font-family": "Source Sans Pro, sans-serif",
                    "text-anchor": "middle",
                    fill: "black"
                  },
                  attr: {
                    dy: "20px",
                    x: function (d) {return d.cx;},
                    y: function (d) {return d.cy;}
                  }
                }
              ],
              centralFormat: [
                {// Line #0
                  style: {"font-size": "50px"},
                  attr: {}
                },
                {// Line #1
                  style: {"font-size": "30px"},
                  attr: {dy: "40px"}
                }
              ]
            }
          }
        ]
      });
    }
  }

})();
