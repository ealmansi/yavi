(function() {
  'use strict';

  describe('directive yvExplorePageRelatedPagesCard', function() {
    var element;

    beforeEach(module('yavi'));

    beforeEach(inject(function($compile, $rootScope) {
      element = angular.element('<yv-explore-page-related-pages-card></yv-explore-page-related-pages-card>');
      $compile(element)($rootScope.$new());
      $rootScope.$digest();
    }));

    it('should be compiled', function() {
      expect(element.html()).not.toEqual(null);
    });

  });
})();
