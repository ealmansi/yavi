(function() {
  'use strict';

  angular
    .module('yavi')
    .controller('HomeController', controllerFunction);

  /** @ngInject */
  function controllerFunction(yvPageTitleConfig,
                              $scope,
                              $state,
                              $stateParams,
                              wikipediaAPI,
                              $q,
                              $interpolate,
                              $compile,
                              wikipediaPages,
                              toastr) {
    var vm = this;

    yvPageTitleConfig.setDefaultPageTitle();

    vm.showLoadingAnimation = true;
    
    vm.query = {value: $stateParams.query || ''};

    var searchResults = [];
    var searchResultsElement = angular.element('#home-search-results');

    vm.onSearchBoxChange = function() {
      var queryValue = vm.query.value;
      searchResults = [];
      searchResultsElement.empty();
      if (queryValue.length == 0) {
        vm.showLoadingAnimation = false;
      } else {
        vm.showLoadingAnimation = true;
        wikipediaAPI.searchQuery(queryValue)
        .then(function(pageIdPromises) {
          angular.forEach(pageIdPromises, function(pageIdPromise) {
            pageIdPromise
            .then(function(pageId) {
              if (queryValue == vm.query.value) {
                vm.showLoadingAnimation = false;
                searchResults.push(pageId);
                var searchResultElement = compileSearchResultCardElement($scope, pageId);
                searchResultsElement.append(searchResultElement);
              }
            });
          });
          $q.all(pageIdPromises)
          .then(function() {
            vm.showLoadingAnimation = false;
            if (searchResults.length == 0) {
              var noResultsMessageTemplate = 'Could not find any matches for the query: "{{queryValue}}".';
              var noResultsMessage = $interpolate(noResultsMessageTemplate)({queryValue: vm.query.value});
              toastr.info(noResultsMessage, "No results");
            }
          });
        })
        .catch(function() {
          vm.showLoadingAnimation = false;
        });
      }
    }

    vm.onSearchBoxSubmit = function() {
      angular.forEach(searchResults, function(pageId) {
        var page = wikipediaPages.getPageById(pageId);
        page.getTitle()
        .then(function(title) {
          if (vm.query.value.toLowerCase() == title.toLowerCase()) {
            $state.go('explorePage', {pageId: pageId});
          }
        });
      });
    }

    function compileSearchResultCardElement(scope, pageId) {
      var elementTemplate = '<yv-home-search-results-card page-id={{pageId}}></yv-home-search-results-card>';
      var elementHTML = $interpolate(elementTemplate)({pageId: pageId});
      var angularElement = angular.element(elementHTML);
      return $compile(angularElement)(scope);
    }
  }
})();
