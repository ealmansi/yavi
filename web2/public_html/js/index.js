

var pageData = {};

var allDates = _.map(_.range(365), function(dayNumber) {
  return moment("01-01-2016", "DD-MM-YYYY").add(dayNumber, 'days').format("DD-MM-YYYY");
});

var defaultStart = moment("01-01-2016", "DD-MM-YYYY");
var defaultEnd = moment("01-04-2016", "DD-MM-YYYY");

var startDate = defaultStart;
var endDate = defaultEnd;

function cb(start, end) {

  startDate = start;
  endDate = end;
  
  $('#reportrange span').html(start.format('MMM D, YYYY') + ' - ' + end.format('MMM D, YYYY'));
}

$('#reportrange').daterangepicker({
  startDate: defaultStart,
  endDate: defaultEnd,
  ranges: {
      'Last 7 Days': [moment().subtract(6, 'days'), moment()],
      'Last 30 Days': [moment().subtract(29, 'days'), moment()],
      'This Month': [moment().startOf('month'), moment().endOf('month')],
      'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
  }
}, cb);

cb(defaultStart, defaultEnd);

function formatRepo (repo) {
  if (repo.loading) return "Searching ...";

  var markup = "<div class='select2-result-repository clearfix'>" +
    "<div class='select2-result-repository__avatar' style='float: left; margin-right: 10px; background: #ddddff; border-radius: 50%; overflow: hidden;width: 50px; height: 50px;'><img style='left: 50%;top: 50%;position: relative;transform: translate(-50%, -50%);' src='" + ((repo.thumbnail || {}).source || "https://upload.wikimedia.org/wikipedia/en/thumb/8/80/Wikipedia-logo-v2.svg/60px-Wikipedia-logo-v2.svg.png") + "' /></div>" +
    "<div class='select2-result-repository__meta'>" +
      "<div class='select2-result-repository__title'><b>" + repo.title + "</b></div>";

  if (repo && repo.terms && repo.terms.description && repo.terms.description.length > 0) {
    markup += "<div class='select2-result-repository__description'>" + repo.terms.description[0] + "</div>";
  }

  markup += "</div></div>";

  return markup;
}

function formatRepoSelection (repo) {
  return repo.title || repo.text;
}

$(".page-select").select2({
  placeholder: "Search for a Wikipedia article ...",
  ajax: {
    url: "https://en.wikipedia.org/w/api.php",
    dataType: 'jsonp',
    delay: 250,
    data: function (queryState) {
      return {
        action: "query",
        format: "json",
        generator: "prefixsearch",
        prop: "pageprops|pageimages|pageterms",
        redirects: "",
        ppprop: "displaytitle",
        piprop: "thumbnail",
        pithumbsize: "80",
        pilimit: "6",
        wbptterms: "description",
        gpssearch: queryState.term,
        gpsnamespace: "0",
        gpslimit: "6",
        gpsoffset: _.get(queryState, 'paginationOffset', 0)
      };
    },
    processResults: function (data, queryState) {
      queryState.pageIds = _.get(queryState, 'pageIds', {});
      var pages = _.filter(_.values(data.query.pages), function(page) {
        return !(page.pageid in queryState.pageIds);
      });
      _.each(pages, function(page) {queryState.pageIds[page.pageid] = true;});
      _.each(pages, function(page) {page.id = page.pageid;});
      var prevPaginationOffset = queryState.paginationOffset || 0;
      queryState.paginationOffset = ((data.continue || {}).gpsoffset || 0);
      return {
        results: pages,
        pagination: {
          more: prevPaginationOffset < queryState.paginationOffset
        }
      };
    },
    cache: true
  },
  maximumSelectionLength: 3,
  escapeMarkup: function (markup) { return markup; }, // let our custom formatter work
  minimumInputLength: 1,
  templateResult: formatRepo, // omitted for brevity, see the source of this page
  templateSelection: formatRepoSelection // omitted for brevity, see the source of this page
});

function onPageSelect(page) {
  $.ajax({
    url: "http://localhost:8080/stats/" + page.pageid,
    data: {
      fr: startDate.format("DD-MM-YYYY"),
      to: endDate.format("DD-MM-YYYY")
    },
    dataType: 'jsonp',
    success: function(stats) {
      var dailyStats = _.map(stats, function(statObject) {
        return _.pick(statObject, 'day', 'number_of_revisions');
      });
      updateChart(page.pageid, dailyStats);
    }
  });
}

function onPageUnselect(page) {
  console.log(page)
}

function updateChart(pageId, dailyStats) {
  //myLineChart.data.datasets[0].data = _.map(dailyStats, 'number_of_revisions');
  //myLineChart.options.scales.yAxes[0].display = true;
  //myLineChart.update();
}

$('.page-select').on('select2:select', function (evt) {
  var page = _.get(evt, 'params.data');
  pageData[page.pageid] = page;
});

$('.page-select').on("select2:unselect", function (evt) {
  // var page = _.get(evt, 'params.data');
  // onPageUnselect(page);
});


var lineChartElement = $("#lineChart");

var lineChartData = {
  labels: [],
  datasets: []
};

var lineChartOptions = {
  responsive: true,
  maintainAspectRatio: false
};

var myLineChart = new Chart(lineChartElement, {
  type: 'line',
  data: lineChartData,
  options: lineChartOptions
});

function requestPageData(pageId, startDate, endDate, signalId, callback) {
  var requestUrl = "http://localhost:8080/stats/";
  var requestData = {
    p: pageId,
    f: startDate.format("DD-MM-YYYY"),
    t: endDate.format("DD-MM-YYYY"),
    s: signalId
  };
  $.ajax({
    url: requestUrl,
    data: requestData,
    dataType: 'jsonp',
    success: function(response) {
      callback(pageId, _.map(response, signalId));
    }
  });
}

function addDatasetToChart(pageId, values) {
  lineChartData.datasets.push({
    label: pageData[pageId].title,
    fill: false,
    lineTension: 0.1,
    backgroundColor: "rgba(75,192,192,0.4)",
    borderColor: "rgba(75,192,192,1)",
    borderCapStyle: 'butt',
    borderDash: [],
    borderDashOffset: 0.0,
    borderJoinStyle: 'miter',
    pointBorderColor: "rgba(75,192,192,1)",
    pointBackgroundColor: "#fff",
    pointBorderWidth: 1,
    pointHoverRadius: 5,
    pointHoverBackgroundColor: "rgba(75,192,192,1)",
    pointHoverBorderColor: "rgba(220,220,220,1)",
    pointHoverBorderWidth: 2,
    pointRadius: 1,
    pointHitRadius: 10,
    data: values,
    spanGaps: false,
  });
  myLineChart.update();
}

function updateChart(chartSpecs) {
  if (chartSpecs.chartType === 'signal') {
    var signalId = chartSpecs.data.signalId;
    var pageIds = chartSpecs.data.pageIds;
    updateChartForSignal(signalId, pageIds);
  } else {
    var pageId = chartSpecs.data.pageId;
    var signalIds = chartSpecs.data.signalIds;
    updateChartForPage(pageId, signalIds);
  }
}

function updateChartForSignal(signalId, pageIds) {
  var periodLength = moment.duration(endDate.diff(startDate)).asDays();
  var dates = _.map(_.range(periodLength), function(dayOffset) {
    return startDate.clone().add(dayOffset, 'days').format("DD-MM-YYYY");
  });
  lineChartData.labels = dates;
  lineChartData.datasets = [];
  _.each(pageIds, function(pageId) {
    requestPageData(pageId, startDate, endDate, signalId, addDatasetToChart);
  });
}

function updateChartForPage(pageId, signalIds) {

}

$("#set-number-of-revisions-btn").on('click', function() {
  updateChartType('number_of_revisions');
});

$("#set-number-of-editors-btn").on('click', function() {
  updateChartType('number_of_editors');
});

$("#set-content-size-btn").on('click', function() {
  updateChartType('content_size');
});

function updateChartType(signalId) {
  var chartSpecs = {
    chartType: 'signal',
    data: {
      signalId: signalId,
      pageIds: $('.page-select').val() || []
    }
  };
  updateChart(chartSpecs);
}
