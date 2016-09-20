// server.js

// BASE SETUP
// =============================================================================

// Env variables.
require('dotenv').config()

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
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

// ROUTES FOR OUR API
// =============================================================================

var dayZero = moment("01-01-2000", "DD-MM-YYYY");

app.get('/stats', function(request, response) {
    var pageId = request.query.p;
    var startDay = moment(request.query.f, "DD-MM-YYYY");
    var endDay = moment(request.query.t, "DD-MM-YYYY");
    var signalId = request.query.s;
    var startDayNumber = Math.floor(moment.duration(startDay.diff(dayZero)).asDays());
    var endDayNumber = Math.ceil(moment.duration(endDay.diff(dayZero)).asDays());
    var queryString = '';
    queryString += 'select day_number, ' + signalId + ' ';
    queryString += 'from daily_signals where page_id = ' + pageId + ' ';
    queryString += 'AND day_number >= ' + startDayNumber + ' ';
    queryString += 'AND day_number <= ' + endDayNumber;
    console.log(queryString)
    db.query(queryString)
    .then(function(result) {
        _.each(result, function(row) {
            row.day = dayZero.clone().add(row.day_number - 1, 'days').format("DD-MM-YYYY");
        })
        response.jsonp(result);   
    })
    .catch(function(e) {console.log(e)});
});

app.get('/feats', function(request, response) {
    var pageId = request.query.p;
    var startDay = moment(request.query.f, "DD-MM-YYYY");
    var endDay = moment(request.query.t, "DD-MM-YYYY");
    var signalId = "num_revisions";
    var startDayNumber = Math.floor(moment.duration(startDay.diff(dayZero)).asDays());
    var endDayNumber = Math.ceil(moment.duration(endDay.diff(dayZero)).asDays());
    var queryString = '';
    queryString += 'select day_number, ' + signalId + ' ';
    queryString += 'from daily_signals where page_id = ' + pageId + ' ';
    queryString += 'AND day_number >= ' + startDayNumber + ' ';
    queryString += 'AND day_number <= ' + endDayNumber + ' ';
    queryString += 'ORDER BY day_number;'
    console.log(queryString)
    db.query(queryString)
    .then(function(dateValues) {
       var maxPeakOrder1 = computeMaxPeak(dateValues, 'num_revisions', 1);
       var maxPeakOrder2 = computeMaxPeak(dateValues, 'num_revisions', 2);
       var maxPeakOrder3 = computeMaxPeak(dateValues, 'num_revisions', 3);
       var maxPeakOrder5 = computeMaxPeak(dateValues, 'num_revisions', 5);
       var maxPeakOrder7 = computeMaxPeak(dateValues, 'num_revisions', 7);
       var maxPeakOrder10 = computeMaxPeak(dateValues, 'num_revisions', 10);
       var maxPeakOrder14 = computeMaxPeak(dateValues, 'num_revisions', 14);
        response.jsonp({
            maxPeakOrder1: maxPeakOrder1,
            maxPeakOrder2: maxPeakOrder2,
            maxPeakOrder3: maxPeakOrder3,
            maxPeakOrder5: maxPeakOrder5,
            maxPeakOrder7: maxPeakOrder7,
            maxPeakOrder10: maxPeakOrder10,
            maxPeakOrder14: maxPeakOrder14
        });   
    });
});

function computeMaxPeak(dateValues, valueName, order) {
    var accum = 0, best = 0;
    var start = 0;
    for (var end = 0; end < dateValues.length; ++end) {
        accum += dateValues[end][valueName];
        while (start < end && dateValues[start]['day_number'] + order - 1 < dateValues[end]['day_number']) {
            accum -= dateValues[start][valueName];
            ++start;
        }
        best = Math.max(best, accum);
    }
    return best;
}

app.get('/related', function(request, response) {
    var pageId = request.query.p % 10001;
    var queryString = '';
    queryString += 'select * ';
    queryString += 'from related_demo_sm where page_id / 10 = ' + pageId + ' ';
    console.log(queryString)
    db.query(queryString)
    .then(function(result) {
        var relatedPageIds = _.pluck(result, 'related_page_id');
        var result = _.map(relatedPageIds, function(pageId) {
            return {
                page_id: pageId,
                score: Math.floor(Math.random() * 5000)
            };
        });
        response.jsonp(result);
    });
});

// START THE SERVER
// =============================================================================
var port = process.env.PORT || 8080;        // set our port
app.listen(port);
console.log('Magic happens on port ' + port);
