(function() {
    'use strict';

    angular
        .module('yavi')
        .controller('StatsController', StatsController);

    /** @ngInject */
    function StatsController(
                $scope,
                $stateParams,
                $http,
                $log
            ) {

        var self = this;

        self.pageId = 346;//$stateParams.pageId;

        self.initialize = function() {
            $http.jsonp("http://localhost:8080/stats/" + self.pageId + '?callback=JSON_CALLBACK')
                .then(function(res) { return res.data; })
                .then(self.displayStats)
                .catch(console.log);
        }

        self.displayStats = function(stats) {
            $log.log(_.pluck(stats, 'day'));
            self.sampleChart(stats);
        }

        self.sampleChart = function(stats) {
            var ctx = angular.element("#sample-chart");
            var data = {
                labels: _.pluck(stats, 'day').slice(0, 20),
                datasets: [
                    {
                        label: "My First dataset",
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
                        pointBorderWidth: 5,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: "rgba(75,192,192,1)",
                        pointHoverBorderColor: "rgba(220,220,220,1)",
                        pointHoverBorderWidth: 2,
                        pointRadius: 5,
                        pointHitRadius: 5,
                        data: _.pluck(stats, 'number_of_revisions').slice(0, 20),
                        spanGaps: false,
                    }
                ]
            };
            var myLineChart = new Chart(ctx, {
                type: 'line',
                data: data,
                options: {
                    title: {
                        display: true,
                        text: 'Custom Chart Title'
                    }
                }
            });
        }
        
        $scope.$on('$stateChangeSuccess', self.initialize);

        return self;
    }
    
})();
