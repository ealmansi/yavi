(function() {
  'use strict';

  describe('directive yvRelatedPagesRankingCard', function() {
    var element;

    beforeEach(module('yavi'));

    beforeEach(inject(function($compile, $rootScope) {
      element = angular.element('<yv-related-pages-ranking-card></yv-related-pages-ranking-card>');
      $compile(element)($rootScope.$new());
      $rootScope.$digest();
    }));

    it('should be compiled', function() {
      expect(element.html()).not.toEqual(null);
    });

  });
})();
