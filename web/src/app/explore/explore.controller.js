(function() {
    'use strict';

    angular
        .module('yavi')
        .controller('ExploreController', controllerFunction);

    /** @ngInject */
    function controllerFunction(wikipediaPages,
                                $compile,
                                $interpolate,
                                $q,
                                $scope,
                                $state,
                                $timeout,
                                $stateParams,
                                $log) {
        var self = this;

        self.wikipediaSourceId = undefined;
        self.pageId = undefined;
        self.startDate = undefined;
        self.endDate = undefined;
        self.page = undefined;

        function init() {
            //
            self.wikipediaSourceId = 'en'; /*$stateParams.wiki;*/
            self.pageId = 5843419; /*$stateParams.page;*/
            self.startDate = '2015-11-01'; /*$stateParams.startDate;*/
            self.endDate = '2015-12-01'; /*$stateParams.endDate;*/

            //            
            self.page = wikipediaPages.getPage(self.wikipediaSourceId, self.pageId);
            //
            renderPageCarousel();
            self.page.fetchExploreData().then(function(exploreData) {
                renderFeatureChart(exploreData);
                renderPageSignalChart(exploreData);
                renderPageBubbleChart(exploreData);
            });
        }

        function renderPageCarousel() {
            self.myInterval = 5000;
            self.noWrapSlides = false;
            self.active = 0;
            var slides = self.slides = [];
            var currIndex = 0;

            self.addSlide = function() {
                var newWidth = 600 + slides.length + 1;
                slides.push({
                    image: 'http://lorempixel.com/' + newWidth + '/300',
                    text: ['Nice image','Awesome photograph','That is so cool','I love that'][slides.length % 4],
                    id: currIndex++
                });
            };

            self.randomize = function() {
                var indexes = generateIndexesArray();
                assignNewIndexesToSlides(indexes);
            };

            for (var i = 0; i < 4; i++) {
                self.addSlide();
            }

            // Randomize logic below

            function assignNewIndexesToSlides(indexes) {
                for (var i = 0, l = slides.length; i < l; i++) {
                    slides[i].id = indexes.pop();
                }
            }

            function generateIndexesArray() {
                var indexes = [];
                for (var i = 0; i < currIndex; ++i) {
                    indexes[i] = i;
                }
                return shuffle(indexes);
            }

            // http://stackoverflow.com/questions/962802#962890
            function shuffle(array) {
                var tmp, current, top = array.length;

                if (top) {
                    while (--top) {
                        current = Math.floor(Math.random() * (top + 1));
                        tmp = array[current];
                        array[current] = array[top];
                        array[top] = tmp;
                    }
                }

                return array;
            }

        }

        function renderFeatureChart() {
            var data = {
                labels: ["No. of revisions", "Peak no. revisions (3)", "Peak no. revisions (5)", "Peak no. revisions (7)", "Peak no. revisions (11)", "Peak no. revisions (15)", "No. reverted revisions"],
                datasets: [
                    {
                        label: "France",
                        backgroundColor: "rgba(179,181,198,0.2)",
                        borderColor: "rgba(179,181,198,1)",
                        pointBackgroundColor: "rgba(179,181,198,1)",
                        pointBorderColor: "#fff",
                        pointHoverBackgroundColor: "#fff",
                        pointHoverBorderColor: "rgba(179,181,198,1)",
                        data: [65, 59, 90, 81, 56, 55, 40]
                    },
                    {
                        label: "Paris",
                        backgroundColor: "rgba(255,99,132,0.2)",
                        borderColor: "rgba(255,99,132,1)",
                        pointBackgroundColor: "rgba(255,99,132,1)",
                        pointBorderColor: "#fff",
                        pointHoverBackgroundColor: "#fff",
                        pointHoverBorderColor: "rgba(255,99,132,1)",
                        data: [28, 48, 40, 19, 96, 27, 100]
                    }
                ]
            };

            var ctx = angular.element('#page-feature-chart');

            /*var myRadarChart = */new Chart(ctx, {
                type: 'radar',
                data: data,
                options: {}
            });
        }

        function renderPageSignalChart() {
            var data = {
                labels: ["January", "February", "March", "April", "May", "June", "July"],
                datasets: [
                    {
                        label: "France",
                        fill: false,
                        lineTension: 0.1,
                        backgroundColor: "rgba(75,192,192,0.4)",
                        borderColor: "rgba(75,192,192,1)",
                        borderCapStyle: 'butt',
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: 'miter',
                        pointBorderColor: "rgba(75,192,192,1)",
                        pointBackgroundColor: "#fff",
                        pointBorderWidth: 1,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: "rgba(75,192,192,1)",
                        pointHoverBorderColor: "rgba(220,220,220,1)",
                        pointHoverBorderWidth: 2,
                        pointRadius: 1,
                        pointHitRadius: 10,
                        data: [65, 59, 80, 81, 56, 55, 40]
                    },
                    {
                        label: "Paris",
                        fill: false,
                        lineTension: 0.1,
                        backgroundColor: "rgba(192,192,75,0.4)",
                        borderColor: "rgba(192,192,75,1)",
                        borderCapStyle: 'butt',
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: 'miter',
                        pointBorderColor: "rgba(192,192,75,1)",
                        pointBackgroundColor: "#fff",
                        pointBorderWidth: 1,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: "rgba(192,192,75,1)",
                        pointHoverBorderColor: "rgba(220,220,220,1)",
                        pointHoverBorderWidth: 2,
                        pointRadius: 1,
                        pointHitRadius: 10,
                        data: [55, 56, 59, 45, 65, 40, 80]
                    }
                ]
            };

            var ctx = angular.element('#page-signal-chart');

            /*var myLineChart = */new Chart(ctx, {
                type: 'line',
                data: data,
                options: {}
            });
        }

        function renderPageBubbleChart(exploreData) {
            var itemPromises = [];
            _.each(exploreData.rankedRelatedPages, function(relatedPageData) {
                if (relatedPageData.pageId != self.pageId) {
                    var page = wikipediaPages.getPage(self.wikipediaSourceId, relatedPageData.pageId);
                    var itemPromise = page.fetchTitle().then(function(title) {
                        return {
                            pageId: relatedPageData.pageId,
                            text: title,
                            count: relatedPageData.activityScore
                        };
                    });
                    itemPromises.push(itemPromise);
                }
            });
            $q.all(itemPromises).then(function(items) {
                /*var bubbleChart = */new d3.svg.BubbleChart({
                    supportResponsive: true,
                    container: '#page-bubble-chart',
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
                        eval: function (item) {return item.count;},
                        classed: function (item) {return item.text.split(" ").join("");}
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
                                    var stateParams = {
                                        wiki: self.wikipediaSourceId,
                                        page: item.pageId,
                                        startDate: self.startDate,
                                        endDate: self.endDate
                                    };
                                    $state.go('explore', stateParams, {reload: true});
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
                        }]
                });
            }).catch(function(err) {$log.log(err);});
        }

        $scope.$on('$stateChangeSuccess', init);

        return self;
    }
    
})();
