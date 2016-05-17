(function() {
  'use strict';

  describe('directive yvScrollOnClick', function() {
    var element;

    beforeEach(module('yavi'));

    beforeEach(inject(function($compile, $rootScope) {
      element = angular.element('<yv-scroll-on-click></yv-scroll-on-click>');
      $compile(element)($rootScope.$new());
      $rootScope.$digest();
    }));

    it('should be compiled', function() {
      expect(element.html()).not.toEqual(null);
    });

  });
})();
