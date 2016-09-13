// server.js

// BASE SETUP
// =============================================================================

// General deps.
var _ = require('underscore');
var moment = require('moment');

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set up database.
var pgp = require('pg-promise')();
var db = pgp({
    host: 'localhost',
    port: 5434,
    database: 'emilio',
    user: 'emilio',
    password: 'qwertyuiop'
});

// ROUTES FOR OUR API
// =============================================================================

app.get('/stats', function(request, response) {
    var pageId = request.query.p % 10001;
    var startDay = moment(request.query.f, "DD-MM-YYYY");
    var endDay = moment(request.query.t, "DD-MM-YYYY");
    var signalId = request.query.s;
    var startDayNumber = moment.duration(startDay.diff(moment("01-01-2016", "DD-MM-YYYY"))).asDays();
    var endDayNumber = moment.duration(endDay.diff(moment("01-01-2016", "DD-MM-YYYY"))).asDays();
    var queryString = '';
    queryString += 'select ' + signalId + ' ';
    queryString += 'from data_demo_sm where page_id / 10 = ' + pageId + ' ';
    queryString += 'AND day_number >= ' + startDayNumber + ' ';
    queryString += 'AND day_number <= ' + endDayNumber;
    console.log(queryString)
    db.query(queryString)
    .then(function(result) {
        _.each(result, function(row) {
            row.day = moment("01-01-2016", "DD-MM-YYYY").add(row.day_number - 1, 'days').format("DD-MM-YYYY");
        })
        response.jsonp(result);   
    });
});

app.get('/feats', function(request, response) {
    var pageId = request.query.p % 10001;
    var startDay = moment(request.query.f, "DD-MM-YYYY");
    var endDay = moment(request.query.t, "DD-MM-YYYY");
    var signalId = "number_of_revisions";
    var startDayNumber = moment.duration(startDay.diff(moment("01-01-2016", "DD-MM-YYYY"))).asDays();
    var endDayNumber = moment.duration(endDay.diff(moment("01-01-2016", "DD-MM-YYYY"))).asDays();
    var queryString = '';
    queryString += 'select ' + signalId + ' ';
    queryString += 'from data_demo_sm where page_id / 10 = ' + pageId + ' ';
    queryString += 'AND day_number >= ' + startDayNumber + ' ';
    queryString += 'AND day_number <= ' + endDayNumber;
    console.log(queryString)
    db.query(queryString)
    .then(function(result) {
        var values = _.pluck(result, 'number_of_revisions');
        var maxPeakOrder1 = Math.max.apply(Math, values);
        var maxPeakOrder2 = computeMaxPeak(values, 2);
        var maxPeakOrder3 = computeMaxPeak(values, 3);
        var maxPeakOrder7 = computeMaxPeak(values, 7);
        response.jsonp({
            maxPeakOrder1: maxPeakOrder1,
            maxPeakOrder2: maxPeakOrder2,
            maxPeakOrder3: maxPeakOrder3,
            maxPeakOrder7: maxPeakOrder7
        });   
    });
});

function computeMaxPeak(array, order) {
    var windowSize = Math.min(array.length, order);
    var windowAccumulator = 0;
    var maxPeak = 0;
    for (var i = 0; i < array.length; ++i) {
        windowAccumulator += array[i];
        if (i > windowSize - 1) windowAccumulator -= array[i - windowSize];
        maxPeak = Math.max(windowAccumulator, maxPeak);
    }
    return maxPeak;
}

// START THE SERVER
// =============================================================================
var port = process.env.PORT || 8080;        // set our port
app.listen(port);
console.log('Magic happens on port ' + port);
