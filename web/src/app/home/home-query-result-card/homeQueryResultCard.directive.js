(function() {
    'use strict';

    angular
        .module('yavi')
        .directive('yvHomeQueryResultCard', directiveFunction);

    /** @ngInject */
    function directiveFunction($compile, $interpolate, $q, $timeout, $log) {

        var directive = {
            link: linkFunction,
            controller: controllerFunction,
            controllerAs: 'homeQueryResultCard',
            restrict: 'E',
            scope: {
                wikipediaId: '@',
                pageId: '@'
            },
            templateUrl: 'html/homeQueryResultCard.html'
        };

        return directive;
        
        /** @ngInject */
        function controllerFunction(wikipediaPageProvider, $scope, $state) {
            
            var self = this;

            // Directive params.
            self.wikipediaId = $scope.wikipediaId;
            self.pageId = $scope.pageId;

            // Page corresponding to this card.
            self.page = wikipediaPageProvider.getPage(self.wikipediaId, self.pageId);
            
            // Fetch data.
            self.titlePromise = self.page.getTitlePromise();
            self.descriptionPromise = self.page.getDescriptionPromise();
            self.categoryListPromise = self.page.getCategoryListPromise();
            self.thumbnailPromise = self.page.getThumbnailPromise();

            // Directive state.
            self.showCard = false;
            
            /**
             *
             */
            self.onLinkReady = function() {
                self.showCard = true;
            }

            /**
             *
             */
            self.onCardClick = function() {
                $log.log("click");
                // $state.go("explore", {
                //     w: self.wikipediaId,
                //     p: self.pageId
                // });
            }

            return self;
        }

        function linkFunction(scope, element, attributes, controller) {

            // Card elements.
            var wrapperElement = element.find('.home-query-result-card-wrapper');
            var titleElement = element.find('.home-query-result-card-title');
            var descriptionElement = element.find('.home-query-result-card-description');
            var categoryListElement = element.find('.home-query-result-card-category-list');
            var thumbnailElement = element.find('.home-query-result-card-thumbnail');

            // Bind event handlers.
            $log.log(wrapperElement);
            $log.log(controller.onCardClick);
            wrapperElement.on('click', controller.onCardClick);
            wrapperElement.click();

            // Page data promises.
            var linkPromises = [
                controller.titlePromise.then(linkTitle),
                controller.descriptionPromise.then(linkDescription),
                controller.categoryListPromise.then(linkCategoryList),
                controller.thumbnailPromise.then(linkThumbnail).catch(deleteThumbnailElement)
            ];

            // When the card is fully linked, set for display. Else, remove.
            $q.all(linkPromises).then(controller.onLinkReady).catch(element.remove);

            /**
             *
             */
            function linkTitle(title) {
                titleElement.text(title);
                thumbnailElement.attr("alt", title);
            }

            /**
             *
             */
            function linkDescription(description) {
                var descriptionTextElements = $compile(description)(scope);
                descriptionElement.html(descriptionTextElements);
            }

            /**
             *
             */
            function linkCategoryList(categoryList) {
                _.each(categoryList, function(categoryTitle) {
                    var itemTemplate = '<li>{{category}}</li>';
                    var itemScope = { category: categoryTitle };
                    var itemHtml = $interpolate(itemTemplate)(itemScope);
                    var itemElement = $compile(itemHtml)(scope);
                    categoryListElement.append(itemElement);
                });
            }

            /**
             *
             */
            function linkThumbnail(thumbnail) {
                thumbnailElement.attr("src", thumbnail);
            }

            /**
             *
             */
            function deleteThumbnailElement() {
                thumbnailElement.remove();
            }
        }
    }

})();
