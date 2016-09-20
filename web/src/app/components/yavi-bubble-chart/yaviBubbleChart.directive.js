(function() {
    'use strict';

    angular
        .module('yavi')
        .directive('yaviBubbleChart', directiveFunction);

    /** @ngInject */
    function directiveFunction($q, $log) {

        var directive = {
            controller: controllerFunction,
            controllerAs: 'yaviBubbleChart',
            link: linkFunction,
            restrict: 'E',
            scope: {
                pageIds: '@'
            },
            templateUrl: 'html/yaviBubbleChart.html'
        };

        return directive;
        
        /** @ngInject */
        function controllerFunction(wikipediaPages, $scope, $state) {
            
            var self = this;

            self.pageIds = $scope.pageIds.split(",");
            self.wikipediaSourceId = $scope.$parent.explore.wikipediaSourceId;
            self.pages = _.map(self.pageIds, function(pageId) {
                return wikipediaPages.getPage(self.wikipediaSourceId, pageId);
            });

            self.onBubbleClick = function(pageId) {
                $state.go("explore", {page: pageId, wiki: self.wikipediaSourceId});
            };

            return self;
        }

        function linkFunction(scope, element, attrs, controller) {

            var pageTitlePromises = _.map(controller.pages, function(page) {
                return page.fetchTitle()
                    .then(function(title) {
                        return {pageId: page.pageId, title: title};
                    })
                    .catch(function() {
                        return {};
                    });
            });
            
            $q.all(pageTitlePromises)
                .then(function(pageTitles) {

                    var validPageTitles = _.filter(pageTitles, function(pageTitle) {
                        return _.has(pageTitle, 'pageId') && _.has(pageTitle, 'title');
                    });

                    var items = _.map(validPageTitles, function(pageTitle, index) {
                        return {pageId: pageTitle.pageId, text: pageTitle.title, count: index + 1};
                    });

                    if (items.length > 0) {
                        /*var bubbleChart = */new d3.svg.BubbleChart({
                            supportResponsive: true,
                            container: ".yavi-bubble-chart",
                            size: 600,
                            //viewBoxSize: => use @default
                            innerRadius: 600 / 3.5,
                            //outerRadius: => use @default
                            radiusMin: 50,
                            //radiusMax: use @default
                            //intersectDelta: use @default
                            //intersectInc: use @default
                            //circleColor: use @default
                            data: {
                                items: items,
                                eval: function (item) { return -item.count; },
                                classed: function (item) { return item.text.split(" ").join(""); }
                            },
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
                                            "fill": "white"
                                        },
                                        attr: {dy: "65px"},
                                        centralClick: function(item) {
                                            controller.onBubbleClick(item.pageId);
                                        }
                                    }
                                },
                                {
                                    name: "lines",
                                    options: {
                                        format: [
                                            {// Line #0
                                                textField: "count",
                                                classed: {count: true},
                                                style: {
                                                    "font-size": "28px",
                                                    "font-family": "Source Sans Pro, sans-serif",
                                                    "text-anchor": "middle",
                                                    fill: "white"
                                                },
                                                attr: {
                                                    dy: "0px",
                                                    x: function (d) {return d.cx;},
                                                    y: function (d) {return d.cy;}
                                                }
                                            },
                                            {// Line #1
                                                textField: "text",
                                                classed: {text: true},
                                                style: {
                                                    "font-size": "14px",
                                                    "font-family": "Source Sans Pro, sans-serif",
                                                    "text-anchor": "middle",
                                                    fill: "white"
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
                });
        }
    }

})();
