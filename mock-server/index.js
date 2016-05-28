// Get dependencies.
var _ = require("underscore");
var bodyParser = require("body-parser");
var express = require("express");
var path = require("path");
var pgp = require('pg-promise')();
var pgpPS = require('pg-promise').PreparedStatement;

// Define database object.
var db = pgp({
  host: 'pg-19e90881.prj-l68cwb.aivencloud.com',
  port: 24143,
  database: 'd6h3a0r9',
  user: 'u9i6g3r1',
  password: 'i9po3nsdzszjjtgl',
  ssl: true
});

// Build prepared statements.
var getRelatedPagesQuery = "";
getRelatedPagesQuery += "SELECT ";
getRelatedPagesQuery += "  po1.page_id AS page_id, ";
getRelatedPagesQuery += "  COUNT(po4.page_id) * 1.0 / (COUNT(*) + ";
getRelatedPagesQuery += "    (SELECT COUNT(*) FROM enwiki20160501.page_outlinks WHERE page_id = $1)) as score ";
getRelatedPagesQuery += "FROM enwiki20160501.page_outlinks po1 ";
getRelatedPagesQuery += "LEFT join enwiki20160501.page_outlinks po4 ";
getRelatedPagesQuery += "ON po4.page_id = $1 and po1.outlink = po4.outlink ";
getRelatedPagesQuery += "WHERE po1.page_id IN ( ";
getRelatedPagesQuery += "  SELECT outlink ";
getRelatedPagesQuery += "  FROM enwiki20160501.page_outlinks po2 ";
getRelatedPagesQuery += "  WHERE page_id = $1 ";
getRelatedPagesQuery += ") AND po1.page_id IN ( ";
getRelatedPagesQuery += "  SELECT page_id ";
getRelatedPagesQuery += "  FROM enwiki20160501.page_outlinks po3 ";
getRelatedPagesQuery += "  WHERE outlink = $1 ";
getRelatedPagesQuery += ") AND po1.page_id <> $1 ";
getRelatedPagesQuery += "GROUP BY po1.page_id ";
getRelatedPagesQuery += "ORDER BY score desc ";
getRelatedPagesQuery += "LIMIT 10 ";
var getRelatedPagesStatement = new pgpPS('get-related-pages', getRelatedPagesQuery);

// Initialize server.
var app = express();
app.use(bodyParser.json());
var port = process.env.PORT || 8080;
var server = app.listen(port, function () {
  console.log("App now running on port", port);
});

// Define API.
app.get("/related/:page", function(req, res) {
  var pageId = req.params.page;
  getRelatedPagesStatement.values = pageId;
  db.any(getRelatedPagesStatement)
    .then(function (data) {
        var pageIds = _.pluck(data, 'page_id');
        res.status(200).jsonp(pageIds);
    })
});
