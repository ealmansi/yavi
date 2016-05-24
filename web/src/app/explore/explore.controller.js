(function() {
    'use strict';

    angular
        .module('yavi')
        .controller('ExploreController', controllerFunction);

    /** @ngInject */
    function controllerFunction(wikipediaPages,
                                $scope,
                                $stateParams,
                                $log) {
        var self = this;

        self.pageId = undefined;
        self.startDate = undefined;
        self.endDate = undefined;
        self.wikipediaSourceId = undefined;
        self.page = undefined;

        function init() {
            self.pageId = $stateParams.page;
            self.startDate = $stateParams.startDate;
            self.endDate = $stateParams.endDate;
            self.wikipediaSourceId = $stateParams.wiki;
            self.page = wikipediaPages.getPage(self.wikipediaSourceId, self.pageId);
        }

        $scope.$on('$stateChangeSuccess', init);

        return self;
    }
    
})();
