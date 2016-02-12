(function() {
  'use strict';
  
  beforeEach(module('yavi'));

  it('service should exist', inject(function(WikipediaPage) {
    expect(WikipediaPage).toBeDefined();
  }));

})();
