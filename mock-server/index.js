// Get dependencies.
var _ = require("underscore");
var bodyParser = require("body-parser");
var express = require("express");
var path = require("path");
var pgPromise = require('pg-promise')();
var QueryFile = require('pg-promise').QueryFile;

// Define database object.
var database = pgPromise({
  host: 'pg-19e90881.prj-l68cwb.aivencloud.com',
  port: 24143,
  database: 'd6h3a0r9',
  user: 'u9i6g3r1',
  password: 'i9po3nsdzszjjtgl',
  ssl: true
});

// Load database queries.
var relatedPagesQueryFile = new QueryFile('./sql/related_pages.sql', {minify: true});
var dailySignalsQueryFile = new QueryFile('./sql/daily_signals.sql', {minify: true});
var activePagesQueryFile = new QueryFile('./sql/active_pages.sql', {minify: true});

// Initialize server.
var app = express();
app.use(bodyParser.json());
var port = process.env.PORT || 8080;
var server = app.listen(port, function () {
  console.log("App now running on port", port);
});

// Define API.
app.get("/related/:page/:from/:to", function(request, response) {
  var pageId = request.params.page;
  var startDay = Math.min(request.params.from, request.params.to);
  var endDay = Math.max(request.params.from, request.params.to);
  var relatedPagesQueryArguments = {
    central_page_id: pageId
  };
  database.any(relatedPagesQueryFile, relatedPagesQueryArguments)
  .then(function (data) {
    var activePagesQueryArguments = {
      page_ids: _.pluck(data, 'page_id'),
      start_day: startDay,
      end_day: endDay,
      _: '_'
    };
    return database.any(activePagesQueryFile, activePagesQueryArguments);
  })
  // .then(function (data) {
  //   var dailySignalsQueryArguments = {
  //     page_ids: _.pluck(data, 'page_id')
  //   };
  //   return database.any(dailySignalsQueryFile, dailySignalsQueryArguments);
  // })
  .then(function(data) {
    response.status(200).jsonp(data);
  })
  .catch(function(err) {
    response.status(505).send('Internal server error.');
    console.log(err);
  });
});
