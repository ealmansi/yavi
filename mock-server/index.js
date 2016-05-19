var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");

var app = express();
app.use(bodyParser.json());

// Initialize the app.
var server = app.listen(process.env.PORT || 8080, function () {
  var port = server.address().port;
  console.log("App now running on port", port);
});

// Define API.
app.get("/pages", function(req, res) {
  var jsonResult = [{'id': 0}, {'id': 1}, {'id': 2}, {'id': 3}];
  res.status(200).json(jsonResult);
});

//
function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}
