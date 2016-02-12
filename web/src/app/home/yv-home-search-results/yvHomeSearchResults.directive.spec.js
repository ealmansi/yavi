(function() {
  'use strict';

  describe('directive yvHomeSearchResults', function() {
    var element;

    beforeEach(module('yavi'));

    beforeEach(inject(function($compile, $rootScope) {
      element = angular.element('<yv-home-search-results></yv-home-search-results>');
      $compile(element)($rootScope.$new());
      $rootScope.$digest();
    }));

    it('should be compiled', function() {
      expect(element.html()).not.toEqual(null);
    });

  });
})();
