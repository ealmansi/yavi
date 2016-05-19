var express = require('express');
var path = require('path');
var app = express();

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname));

app.route('/*').get(function(req, res) { 
    return res.sendFile(path.join(__dirname, 'index.html')); 
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
});
