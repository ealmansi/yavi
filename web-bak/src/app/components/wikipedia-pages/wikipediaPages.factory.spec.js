(function() {
  'use strict';
  
  beforeEach(module('yavi'));

  it('factory should exist', inject(function(wikipediaPages) {
    expect(wikipediaPages).toBeDefined();
  }));

})();
