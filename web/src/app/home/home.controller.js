(function() {
  'use strict';

  angular
    .module('yavi')
    .controller('HomeController', controllerFunction);

  /** @ngInject */
  function controllerFunction($compile,
                              $interpolate,
                              $q,
                              $scope,
                              $state,
                              $stateParams,
                              wikipediaAPI,
                              toastr,
                              wikipediaPages,
                              yvPageTitleConfig) {
    var vm = this;

    yvPageTitleConfig.setDefaultPageTitle();

    vm.showLoadingAnimation = true;
    
    vm.query = {value: $stateParams.query || ''};

    var searchResults = [];
    var searchResultsElement = angular.element('#home-search-results');
    var searchResultsLimit = 14;

    vm.onSearchBoxChange = function() {
      var queryValue = vm.query.value;
      searchResults = [];
      searchResultsElement.empty();
      if (queryValue.length == 0) {
        vm.showLoadingAnimation = false;
      } else {
        vm.showLoadingAnimation = true;
        wikipediaAPI.searchQuery(queryValue)
        .then(function(pageIdTitlePromises) {
          var searchResultResolvedPromises = [];
          angular.forEach(pageIdTitlePromises, function(pageIdTitlePromise) {
            var searchResultResolvedPromise =
                pageIdTitlePromise
                .then(function(pageIdTitle) {
                  var pageId = pageIdTitle[0];
                  var title = pageIdTitle[1];
                  var levenshteinDistance = new Levenshtein(queryValue.slice(0, 50), title.slice(0, 50)).distance;
                  if (queryValue == vm.query.value && searchResults.length < searchResultsLimit) {
                    vm.showLoadingAnimation = false;
                    searchResults.push(pageId);
                    var searchResultElement = compileSearchResultCardElement($scope, pageId, levenshteinDistance);
                    searchResultsElement.append(searchResultElement);
                  }
                })
                .catch(function() { /* Skip result if pageIdTitle cannot be resolved. */ });
            searchResultResolvedPromises.push(searchResultResolvedPromise);
          });
          $q.all(searchResultResolvedPromises)
          .then(function() {
            if (queryValue == vm.query.value) {
              vm.showLoadingAnimation = false;
              if (queryValue.length > 0 && searchResults.length == 0) {
                var noResultsMessageTemplate = 'Could not find any matches for the query: "{{queryValue}}".';
                var noResultsMessage = $interpolate(noResultsMessageTemplate)({queryValue: queryValue});
                toastr.info(noResultsMessage, "No results");
              } else {
                // Cards were loaded asynchronically, now sort them according to Levenshtein distance to query.
                var searchResultsCards = searchResultsElement.children('yv-home-search-results-card');
                searchResultsCards.sort(function(cardA, cardB) {
                  var distanceA = parseInt(cardA.getAttribute('distance'), 10) || 100;
                  var distanceB = parseInt(cardB.getAttribute('distance'), 10) || 100;
                  if (distanceA < distanceB) {
                    return -1;
                  }
                  if (distanceB < distanceA) {
                    return 1;
                  }
                  return 0;
                });
                searchResultsCards.detach().appendTo(searchResultsElement);
              }
            }
          });
        })
        .catch(function() {
          if (queryValue == vm.query.value) {
            vm.showLoadingAnimation = false;
          }
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

    function compileSearchResultCardElement(scope, pageId, levenshteinDistance) {
      var elementTemplate = '<yv-home-search-results-card page-id={{pageId}} distance={{distance}}></yv-home-search-results-card>';
      var elementHTML = $interpolate(elementTemplate)({pageId: pageId, distance: levenshteinDistance});
      var angularElement = angular.element(elementHTML);
      return $compile(angularElement)(scope);
    }
  }
})();
