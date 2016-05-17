(function() {
  'use strict';

  describe('controller HomeController', function(){
    var vm;

    beforeEach(module('yavi'));
    
    beforeEach(inject(function(_$controller_) {
      vm = _$controller_('HomeController');
    }));

    it('controller should exist', function() {
      expect(vm).toEqual(jasmine.any(Object));
    });

  });
})();
