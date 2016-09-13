/**
 * Config and state.
 */

var allSignals = [
  {id: "number_of_revisions", label: "No. of edits"},
  {id: "number_of_editors", label: "No. of editors"},
  {id: "content_size", label: "Article size"},
  {id: "number_of_outlinks", label: "Number of Wikilinks"}
];
var signalInvertedIndex = {};
_.each(allSignals, function(signal, index) { signalInvertedIndex[signal.id] = index; });



var pageData = {};
var pageIndex = {};
var pageInvertedIndex = {};


/**
 * Date range picker.
 */

var dateFormat = "DD-MM-YYYY";
var startDate = moment("01-01-2016", dateFormat);
var endDate = moment("10-01-2016", dateFormat);

var rangeShortcuts = {
    'First Quarter 2016': [moment("01-01-2016", dateFormat), moment("01-04-2016", dateFormat)],
    'Second Quarter 2016': [moment("01-04-2016", dateFormat), moment("01-07-2016", dateFormat)],
    'Third Quarter 2016': [moment("01-07-2016", dateFormat), moment("01-10-2016", dateFormat)],
    'Fourth Quarter 2016': [moment("01-10-2016", dateFormat), moment("01-01-2017", dateFormat)]
};

var dateRangePickerConfig = {
  startDate: startDate,
  endDate: endDate,
  ranges: rangeShortcuts,
  locale: {
    format: dateFormat
  }
};

$('#date-range-picker').daterangepicker(dateRangePickerConfig, onRangeSelect);

onRangeSelect(startDate, endDate);

function onRangeSelect(selectedStartDate, selectedEndDate) {
  startDate = selectedStartDate;
  endDate = selectedEndDate;
  var startDateText = startDate.format('MMM D, YYYY');
  var endDateText = endDate.format('MMM D, YYYY');
  var inputText = startDateText + ' - ' + endDateText;
  $('#date-range-picker span').html(inputText);
}


/**
 * Select2.
 */

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
  templateResult: formatPage, // omitted for brevity, see the source of this page
  templateSelection: formatPageSelection // omitted for brevity, see the source of this page
});

function formatPage (page) {
  if (page.loading) return "Searching ...";

  var markup = "<div class='select2-result-repository clearfix'>" +
    "<div class='select2-result-repository__avatar' style='float: left; margin-right: 10px; background: #ddddff; border-radius: 50%; overflow: hidden;width: 50px; height: 50px;'><img style='left: 50%;top: 50%;position: relative;transform: translate(-50%, -50%);' src='" + ((page.thumbnail || {}).source || "https://upload.wikimedia.org/wikipedia/en/thumb/8/80/Wikipedia-logo-v2.svg/60px-Wikipedia-logo-v2.svg.png") + "' /></div>" +
    "<div class='select2-result-repository__meta'>" +
      "<div class='select2-result-repository__title'><b>" + page.title + "</b></div>";

  if (page && page.terms && page.terms.description && page.terms.description.length > 0) {
    markup += "<div class='select2-result-repository__description'>" + page.terms.description[0] + "</div>";
  }

  markup += "</div></div>";

  return markup;
}

function formatPageSelection (page) {
  return page.title || page.text;
}

$('.page-select').on('select2:select', function (evt) {
  var page = _.get(evt, 'params.data');
  var index = $(".page-select").val().length - 1;
  pageData[page.pageid] = page;
  pageIndex[page.pageid] = index;
  pageInvertedIndex[index] = page.pageid;
  $("#set-page-" + index + "-btn").text(page.title);
});

$('.page-select').on("select2:unselect", function (evt) {
});


/**
 * Download.
 */

$("#download-csv-btn").on('click', function() {
  var dataLength = myLineChart.data.labels.length;
  var datasets = [];
  var dates = [];
  var values = [];
  _.each(getActiveDatasets(), function(dataset) {
    datasets = datasets.concat(_.map(_.range(dataLength), _.constant(dataset.label)));
    dates = dates.concat(myLineChart.data.labels);
    values = values.concat(dataset.data);
  });
  var csvMatrix = [["dataset", "date", "value"]];
  csvMatrix = csvMatrix.concat(_.zip(datasets, dates, values));
  var csvContent = new CSV(csvMatrix).encode();
  download(csvContent, myLineChart.options.title.text + ".csv", "text/csv");
});

$("#download-json-btn").on('click', function() {
  var jsonObject = {};
  jsonObject.label = myLineChart.options.title.text;
  jsonObject.dates = myLineChart.data.labels;
  jsonObject.datasets = {};
  _.each(getActiveDatasets(), function(dataset) {
    jsonObject.datasets[dataset.label] = dataset.data;
  });
  var jsonContent = JSON.stringify(jsonObject);
  download(jsonContent, myLineChart.options.title.text + ".json", "text/json");
});

function getActiveDatasets() {
  return _.filter(myLineChart.data.datasets, function(dataset, index) {
    var datasetMeta = myLineChart.getDatasetMeta(index);
    return !datasetMeta.hidden;
  });
}

$("#download-png-btn").on('click', function() {
  var srcCanvas = document.getElementById("lineChart");
  var destinationCanvas = document.createElement("canvas");
  destinationCanvas.width = srcCanvas.width;
  destinationCanvas.height = srcCanvas.height;

  destCtx = destinationCanvas.getContext('2d');
  destCtx.fillStyle = "#FFFFFF";
  destCtx.fillRect(0,0,srcCanvas.width,srcCanvas.height);
  destCtx.drawImage(srcCanvas, 0, 0);

  var pngContent = destinationCanvas.toDataURL("image/png")
  download(pngContent, myLineChart.options.title.text + ".png", "image/png");
});

/**
 * Chart.js
 */

var chartColors = [
  "#01FF70",  // lime
  "#7FDBFF",  // aqua
  "#FFDC00",  // yellow
  "#FF4136",  // red
  "#B10DC9",  // purple
  "#FFFFFF",  // white
  "#3D9970",  // olive
  "#0074D9",  // blue
  "#111111",  // black
  "#2ECC40",  // green
  "#DDDDDD",  // silver
  "#85144B",  // maroon
  "#39CCCC",  // teal
  "#AAAAAA",  // gray
  "#001F3F",  // navy
  "#FF851B",  // orange
  "#F012BE",  // fuchsia
];

var myLineChart = new Chart($("#lineChart"), {
  type: 'line',
  data: {
    labels: [],
    datasets: []
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    tooltips: {
      mode: 'x-axis'
    },
    hover: {
      mode: 'x-axis'
    },
    title: {
      display: true,
      text: ''
    },
    scales: {
      yAxes: _.map(allSignals, function(signal) {
        return {
          id: signal.id,
          type: 'linear',
          display: false,
          scaleLabel: {
            display: true,
            labelString: signal.label
          },
          ticks: {
            min: 0
          }
        };
      })
    },
    legend: {
      onClick: _.noop()
    }
  }
});

var myRadarChart = new Chart($("#radarChart"), {
  type: 'radar',
  data: {
    labels: [
      "Max Edits in a Day",
      "Max Edits (Window Size 2)",
      "Max Edits (Window Size 3)",
      "Max Edits (Window Size 7)"
    ],
    datasets: []
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    title: {
      display: true,
      text: ''
    },
    scale: {
        ticks: {
            beginAtZero: true
        },
        display: false
    }
  }
});

$("#lineChart").show();
$("#radarChart").show();

$("#set-number-of-revisions-btn").on('click', function() {
  updateChartTypeToSignal('number_of_revisions');
});

$("#set-number-of-editors-btn").on('click', function() {
  updateChartTypeToSignal('number_of_editors');
});

$("#set-content-size-btn").on('click', function() {
  updateChartTypeToSignal('content_size');
});

$("#set-number-of-outlinks-btn").on('click', function() {
  updateChartTypeToSignal('number_of_outlinks');
});

$("#set-page-0-btn").on('click', function() {
  updateChartTypeToPage(pageInvertedIndex[0]);
});

$("#set-page-1-btn").on('click', function() {
  updateChartTypeToPage(pageInvertedIndex[1]);
});

$("#set-page-2-btn").on('click', function() {
  updateChartTypeToPage(pageInvertedIndex[2]);
});

$("#set-edit-features-btn").on('click', function() {
  var pageIds = $('.page-select').val() || [];
  updateRadarChart(pageIds);
});

function updateChartTypeToSignal(signalId) {
  var chartSpecs = {
    chartType: 'signal',
    data: {
      signalId: signalId,
      pageIds: $('.page-select').val() || []
    }
  };
  updateChart(chartSpecs);
}

function updateChartTypeToPage(pageId) {
  var chartSpecs = {
    chartType: 'page',
    data: {
      pageId: pageId,
      signalIds: _.map(allSignals, 'id')
    }
  };
  updateChart(chartSpecs);
}

function updateChart(chartSpecs) {
  $("#lineChart").show(); $("#radarChart").hide();
  var periodLength = moment.duration(endDate.diff(startDate)).asDays();
  var dates = _.map(_.range(periodLength), function(dayOffset) {
    return startDate.clone().add(dayOffset, 'days').format(dateFormat);
  });
  myLineChart.data.labels = dates;
  myLineChart.data.datasets = [];
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
  myLineChart.options.title.text = "Compare " + signalId + " for all pages";
  _.each(myLineChart.options.scales.yAxes, function(yAxis) {
    yAxis.display = yAxis.id === signalId;
  });
  myLineChart.options.legend.onClick = onLegendClickForSignal;
  _.each(pageIds, function(pageId) {
    requestPageSignal(pageId, startDate, endDate, signalId, addPageDatasetToChart);
  });
}

function updateChartForPage(pageId, signalIds) {
  myLineChart.options.title.text = "View all data on " + pageData[pageId].title;
  _.each(myLineChart.options.scales.yAxes, function(yAxis) {
    yAxis.display = true;
  });
  myLineChart.options.legend.onClick = onLegendClickForPage;
  _.each(signalIds, function(signalId) {
    requestPageSignal(pageId, startDate, endDate, signalId, addSignalDatasetToChart);
  });
}

function onLegendClickForSignal(e, legendItem) {
  // Enable / disable dataset.
  Chart.defaults.global.legend.onClick.apply(this, [e, legendItem]);
}

function onLegendClickForPage(e, legendItem) {
  // Enable / disable corresponding y-axis.
  var yAxisId = myLineChart.data.datasets[legendItem.datasetIndex].yAxisID;
  var yAxis = _.find(myLineChart.options.scales.yAxes, function(axis) {
    return axis.id == yAxisId;
  });
  yAxis.display = !yAxis.display;
  // Enable / disable dataset.
  Chart.defaults.global.legend.onClick.apply(this, [e, legendItem]);
}

function requestPageSignal(pageId, startDate, endDate, signalId, callback) {
  var requestUrl = "http://localhost:8080/stats/";
  var requestData = {
    p: pageId,
    f: startDate.format(dateFormat),
    t: endDate.format(dateFormat),
    s: signalId
  };
  $.ajax({
    url: requestUrl,
    data: requestData,
    dataType: 'jsonp',
    success: function(response) {
      callback(pageId, signalId, _.map(response, signalId));
    }
  });
}

function addPageDatasetToChart(pageId, signalId, values) {
  var pageColor = chartColors[pageIndex[pageId] % chartColors.length];
  var dataset = {
    pageIndex: pageIndex[pageId],
    signalIndex: signalInvertedIndex[signalId],
    data: values,
    label: pageData[pageId].title,
    // xAxisID: null,
    yAxisID: signalId,
    fill: false,
    lineTension: 0,
    // backgroundColor: null,
    borderWidth: 1,
    borderColor: pageColor,
    borderCapStyle: "butt", // "round" "square"
    borderDash: [],
    borderDashOffset: 0.0,
    borderJoinStyle: "bevel", // "round" "miter"
    pointBackgroundColor: pageColor,
    pointBorderColor: pageColor,
    pointBorderWidth: 1,
    pointRadius: 2,
    pointHoverRadius: 3,
    pointHitRadius: 3,
    pointHoverBackgroundColor: pageColor,
    pointHoverBorderColor: pageColor,
    pointHoverBorderWidth: 2,
    pointStyle: "circle", // "triangle", "rect", "rectRot", "cross", "crossRot", "star", "line", "dash",
    showLine: true,
    spanGaps: false
    // steppedLine: null
  };
  myLineChart.data.datasets.splice(_.sortedIndexBy(myLineChart.data.datasets, dataset, function(dataset) {
    return dataset.pageIndex;
  }), 0, dataset);
  myLineChart.update();
}

function addSignalDatasetToChart(pageId, signalId, values) {
  var signalIndex = signalInvertedIndex[signalId];
  var signalColor = chartColors[signalIndex % chartColors.length];
  var dataset = {
    pageIndex: pageIndex[pageId],
    signalIndex: signalIndex,
    data: values,
    label: allSignals[signalIndex].label,
    // xAxisID: null,
    yAxisID: signalId,
    fill: false,
    lineTension: 0,
    // backgroundColor: null,
    borderWidth: 1,
    borderColor: signalColor,
    borderCapStyle: "butt", // "round" "square"
    borderDash: [],
    borderDashOffset: 0.0,
    borderJoinStyle: "bevel", // "round" "miter"
    pointBackgroundColor: signalColor,
    pointBorderColor: signalColor,
    pointBorderWidth: 1,
    pointRadius: 2,
    pointHoverRadius: 3,
    pointHitRadius: 3,
    pointHoverBackgroundColor: signalColor,
    pointHoverBorderColor: signalColor,
    pointHoverBorderWidth: 2,
    pointStyle: "circle", // "triangle", "rect", "rectRot", "cross", "crossRot", "star", "line", "dash",
    showLine: true,
    spanGaps: false
    // steppedLine: null
  };
  myLineChart.data.datasets.splice(_.sortedIndexBy(myLineChart.data.datasets, dataset, function(dataset) {
    return dataset.signalIndex;
  }), 0, dataset);
  myLineChart.update();
}

function updateRadarChart(pageIds) {
  $("#radarChart").show(); $("#lineChart").hide();
  myRadarChart.data.datasets = [];
  myRadarChart.options.scale.display = false;
  _.each(pageIds, function(pageId) {
    requestPageFeatures(pageId, startDate, endDate, addPageFeaturesToRadarChart);
  });
  myRadarChart.update();
}

function requestPageFeatures(pageId, startDate, endDate, callback) {
  var requestUrl = "http://localhost:8080/feats/";
  var requestData = {
    p: pageId,
    f: startDate.format(dateFormat),
    t: endDate.format(dateFormat)
  };
  $.ajax({
    url: requestUrl,
    data: requestData,
    dataType: 'jsonp',
    success: function(response) {
      callback(pageId, response);
    }
  });
}

function addPageFeaturesToRadarChart(pageId, features) {
  var pageColor = chartColors[pageIndex[pageId] % chartColors.length];
  myRadarChart.data.datasets.push({
      label: pageData[pageId].title,
      backgroundColor: "rgba(179,181,198,0.2)",
      borderColor: pageColor,
      pointBackgroundColor: pageColor,
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: pageColor,
      data: [
        features["maxPeakOrder1"],
        features["maxPeakOrder2"],
        features["maxPeakOrder3"],
        features["maxPeakOrder7"]
      ]
  });
  myRadarChart.options.scale.display = true;
  myRadarChart.update();
}
