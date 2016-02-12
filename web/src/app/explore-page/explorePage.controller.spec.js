(function() {
  'use strict';

  describe('controller ExplorePageController', function(){
    var vm;

    beforeEach(module('yavi'));
    
    beforeEach(inject(function(_$controller_) {
      vm = _$controller_('ExplorePageController');
    }));

    it('controller should exist', function() {
      expect(vm).toEqual(jasmine.any(Object));
    });

  });
})();
