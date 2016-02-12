(function() {
  'use strict';
  
  beforeEach(module('yavi'));

  it('factory should exist', inject(function(yvPageTitleConfig) {
    expect(yvPageTitleConfig).toBeDefined();
  }));

})();
