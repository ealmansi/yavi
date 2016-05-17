(function() {
  'use strict';

  describe('directive searchResultCard', function() {
    var element;

    beforeEach(module('yavi'));
    
    beforeEach(inject(function($compile, $rootScope) {
      element = angular.element('<yv-home-search-results-card></yv-home-search-results-card>');
      $compile(element)($rootScope.$new());
      $rootScope.$digest();
    }));

    it('should be compiled', function() {
      expect(element.html()).not.toEqual(null);
    });

  });
})();
