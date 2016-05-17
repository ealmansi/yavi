(function() {
  'use strict';
  
  beforeEach(module('yavi'));

  it('factory should exist', inject(function(yaviServer) {
    expect(yaviServer).toBeDefined();
  }));

})();
