(function() {
    'use strict';

    angular
        .module('yavi')
        .directive('yvHomeQueryResultCard', directiveFunction);

    /** @ngInject */
    function directiveFunction($compile, $interpolate, $q, $log) {

        var directive = {
            link: linkFunction,
            controller: controllerFunction,
            controllerAs: 'homeQueryResultCard',
            restrict: 'E',
            scope: {
                pageId: '@'
            },
            templateUrl: 'html/homeQueryResultCard.html'
        };

        return directive;
        
        /** @ngInject */
        function controllerFunction(wikipediaPages, $scope, $log) {
            
            var self = this;

            self.pageId = $scope.pageId;
            
            self.page = wikipediaPages.getPage(self.pageId);

            self.showCard = false;
            
            self.onLinkReady = function() {
                self.showCard = true;
            }

            return self;
        }

        function linkFunction(scope, element, attributes, controller) {

            var page = controller.page;

            var pagePromises = [
                page.fetchCategoryList(),
                page.fetchDescription(),
                page.fetchThumbnail().catch(function() { /* ignore */ }),
                page.fetchTitle()
            ];

            $q.all(pagePromises)
            .then(function(values) {
                linkElements(values[0], values[1], values[2], values[3], scope, element);
                controller.onLinkReady();
            })
            .catch(function() {
                element.remove();
            });
        }

        function linkElements(categoryList, description, thumbnail, title, scope, element) {

            var categoryListElement = element.find('.home-query-result-card-category-list');
            var descriptionElement = element.find('.home-query-result-card-description');
            var thumbnailElement = element.find('.home-query-result-card-thumbnail');
            var titleElement = element.find('.home-query-result-card-title');

            // Link category list.7
            _.each(categoryList, function(categoryTitle) {
                var itemTemplate = $interpolate("<li>{{text}}</li>")({text: categoryTitle});
                var itemElement = $compile(itemTemplate)(scope);
                categoryListElement.append(itemElement);
            })
            // Link description.
            var descriptionTextElement = $compile(description)(scope);
            descriptionElement.html(descriptionTextElement);
            // Link thumbnail.
            if (angular.isDefined(thumbnail)) {
                thumbnailElement.attr("src", thumbnail);
                thumbnailElement.attr("alt", title);
            } else {
                thumbnailElement.remove();
            }
            // Link title.
            titleElement.text(title);
        }
    }

})();
