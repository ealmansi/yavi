(function() {
  'use strict';

  angular
    .module('yavi')
    .directive('yvRelatedPagesBubbleChart', directiveFunction);

  /** @ngInject */
  function directiveFunction(wikipediaPages, $q, $location, $state, $interpolate) {
    var directive = {
      controller: controllerFunction,
      controllerAs: 'vm',
      link: linkFunction,
      restrict: 'E',
      scope: {
        'pageId': '=',
        'period': '='
      },
      templateUrl: 'app/explore-page/yv-explore-page-related-pages-card/yv-related-pages-bubble-chart/yvRelatedPagesBubbleChart.html'
    };

    return directive;
    
    /** @ngInject */
    function controllerFunction(wikipediaPages, $scope, $rootScope) {
      var vm = this;
      
      // Check if page id is valid.
      if (!wikipediaPages.isValidId($scope.pageId)) {
        return;
      }
      
      // Get page and period.
      vm.page = wikipediaPages.getPageById($scope.pageId);
      vm.period = $scope.period;

      var periodSelectionWatch = $rootScope.$on('periodSelection', function(event, newPeriod) {
        vm.period.startDate = newPeriod.startDate;
        vm.period.endDate = newPeriod.endDate;
        onPeriodSelection(vm.page, vm.period.startDate, vm.period.endDate);
      });

      $scope.$on('$destroy', periodSelectionWatch);
    }

    function linkFunction(scope) {
      onPeriodSelection(scope.vm.page, scope.vm.period.startDate, scope.vm.period.endDate);
    }

    function onPeriodSelection(page, startDate, endDate) {
      angular.element("#bubble-chart").empty();
      page.getRelatedPages(startDate, endDate).then(function(relatedPages) {
        var items = [], wrappedPromises = [];
        angular.forEach(relatedPages, function(pageIdScore) {
          if (angular.isDefined(pageIdScore)
              && angular.isDefined(pageIdScore.pageId)
              && angular.isDefined(pageIdScore.score)) {
            var pageId = pageIdScore.pageId;
            var score = pageIdScore.score;
            var relatedPage = wikipediaPages.getPageById(pageId);
            var wrappedPromise = relatedPage.getTitle()
                .then(function(title) {
                  items.push({
                    pageId: pageId,
                    text: title,
                    score: score
                  });
                })
                .catch(function() {
                  /* Skip if title cannot be retrieved. */
                });
            wrappedPromises.push(wrappedPromise);
          }
        });

        $q.all(wrappedPromises).then(function() {
          if (items.length > 0) {
            var maxScore = 0;
            angular.forEach(items, function(item) {
              maxScore = Math.max(maxScore, item.score);
            });

            items.sort(function(itemA, itemB) {
              var scoreDifference = itemA.score - itemB.score;
              if (scoreDifference != 0) {
                return scoreDifference;
              }
              return itemA.pageId - itemB.pageId;
            });
            items.reverse();

            var itemRanking = 1;
            angular.forEach(items, function(item) {
              item.count = itemRanking;
              itemRanking += 1;
            });

            makeChart({
                classed: classedFunction,
                eval: buildEvalFunction(maxScore),
                items: items
            }, startDate, endDate);
            
            // var absUrl = $location.absUrl();
            // angular.forEach(items, function(item) {
            //   var page = wikipediaPages.getPageById(item.pageId);
            //   var circleElement = element.find('.' + classedFunction(item) + ' > circle');
            //   circleElement.attr('style', 'fill: url(' + absUrl + '#image' + item.count + ')');
            //   page.getThumbnail().then(function(thumbnail) {
            //     element.find('#image' + item.count + ' > image').attr('xlink:href', thumbnail);
            //   });
            // });
            
          }
        });
        
        function classedFunction(item) {
          var itemClassTemplate = 'related-page-{{pageId}}';
          return $interpolate(itemClassTemplate)({pageId: item.pageId});
        }

        function buildEvalFunction(maxScore) {
          return function evalFunction(item) {
            if (maxScore > 0) {
              return 100 * item.score / maxScore;
            } else {
              return 1;
            }
            return item.score;
          }
        }
      });

      function makeChart(chartData, startDate, endDate) {
        new d3.svg.BubbleChart({
          supportResponsive: true,
          container: '#bubble-chart',
          size: 600,
          //viewBoxSize: => use @default
          innerRadius: 600 / 3.5,
          //outerRadius: => use @default
          radiusMin: 50,
          //radiusMax: use @default
          //intersectDelta: use @default
          //intersectInc: use @default
          //circleColor: use @default
          data: chartData,
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
                centralClick: function(item) {
                  $state.go('explorePage', {
                    pageId: item.pageId,
                    startDate: startDate,
                    endDate: endDate
                  });
                }
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
            }]
        });
      }
    }
  }

})();
