(function() {
  'use strict';
  
  beforeEach(module('yavi'));

  it('factory should exist', inject(function(wikipediaAPI) {
    expect(wikipediaAPI).toBeDefined();
  }));

})();
