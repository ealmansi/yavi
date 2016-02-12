(function() {
  'use strict';

  describe('directive yvExplorePageNavbar', function() {
    var element;

    beforeEach(module('yavi'));

    beforeEach(inject(function($compile, $rootScope) {
      element = angular.element('<yv-explore-page-navbar></yv-explore-page-navbar>');
      $compile(element)($rootScope.$new());
      $rootScope.$digest();
    }));

    it('should be compiled', function() {
      expect(element.html()).not.toEqual(null);
    });

  });
})();
