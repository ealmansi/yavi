this.CONFIG = (function() {
    'use strict';

    var data = {
        "YAVI_API_URL": "http://localhost",
        "YAVI_API_PORT": "3030"
        // "YAVI_API_URL": "https://yavi-mock-server.herokuapp.com"
        // "YAVI_API_PORT": "??"
    };

    return {
        get: function(name) { return data[name]; }
    };

})();
