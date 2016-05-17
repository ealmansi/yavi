(function() {
  'use strict';

  describe('directive yvPageNotFoundNavbar', function() {
    var element;

    beforeEach(module('yavi'));

    beforeEach(inject(function($compile, $rootScope) {
      element = angular.element('<yv-page-not-found-navbar></yv-page-not-found-navbar>');
      $compile(element)($rootScope.$new());
      $rootScope.$digest();
    }));

    it('should be compiled', function() {
      expect(element.html()).not.toEqual(null);
    });

  });
})();