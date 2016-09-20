/**
 * Config and state.
 */

var allSignals = [
  {id: "num_revisions", label: "No. of edits", onMissing: "zero"},
  {id: "num_contributors", label: "No. of editors", onMissing: "zero"},
  {id: "text_size", label: "Content size", onMissing: "same"}/*,
  {id: "number_of_outlinks", label: "No. of Wikilinks"}*/
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
var startDate = moment("01-01-2015", dateFormat);
var endDate = moment("10-01-2015", dateFormat);

var rangeShortcuts = {
    'First Quarter 2015': [moment("01-01-2015", dateFormat), moment("01-04-2015", dateFormat)],
    'Second Quarter 2015': [moment("01-04-2015", dateFormat), moment("01-07-2015", dateFormat)],
    'Third Quarter 2015': [moment("01-07-2015", dateFormat), moment("01-10-2015", dateFormat)],
    'Fourth Quarter 2015': [moment("01-10-2015", dateFormat), moment("01-01-2016", dateFormat)]
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
  updateActiveChart();
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
  escapeMarkup: function (markup) { return markup; },
  minimumInputLength: 1,
  templateResult: formatPage,
  templateSelection: formatPageSelection
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
  $("#set-related-page-" + index + "-btn").text(page.title);
  updateActiveChart();
});

$('.page-select').on("select2:unselect", function (evt) {
});


/**
 * Download.
 */

var activeChartId = null;
var activeChart = null;

$("#download-csv-btn").on('click', function() {
  if (activeChartId != "lineChart") return;
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
  if (activeChartId != "lineChart") return;
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
  if (activeChartId !== null) {
    var srcCanvas = document.getElementById(activeChartId);
    var destinationCanvas = document.createElement("canvas");
    destinationCanvas.width = srcCanvas.width;
    destinationCanvas.height = srcCanvas.height;

    destCtx = destinationCanvas.getContext('2d');
    destCtx.fillStyle = "#FFFFFF";
    destCtx.fillRect(0,0,srcCanvas.width,srcCanvas.height);
    destCtx.drawImage(srcCanvas, 0, 0);

    var pngContent = destinationCanvas.toDataURL("image/png")
    download(pngContent, activeChart.options.title.text + ".png", "image/png");
  }
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
  "#001F3F",  // navy
  "#3D9970",  // olive
  "#0074D9",  // blue
  "#111111",  // black
  "#2ECC40",  // green
  "#DDDDDD",  // silver
  "#85144B",  // maroon
  "#39CCCC",  // teal
  "#AAAAAA",  // gray
  "#FFFFFF",  // white
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
      "Max Edits (Window of 2 Days)",
      "Max Edits (Window of 3 Days)",
      "Max Edits (Window of 5 Days)",
      "Max Edits in a Week",
      "Max Edits (Window of 10 Days)",
      "Max Edits in two Weeks"
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

$("#set-number-of-revisions-btn").on('click', function() {
  updateChartTypeToSignal('num_revisions');
  $("#chart-type-modal").modal('hide');
});

$("#set-number-of-editors-btn").on('click', function() {
  updateChartTypeToSignal('num_contributors');
  $("#chart-type-modal").modal('hide');
});

$("#set-content-size-btn").on('click', function() {
  updateChartTypeToSignal('text_size');
  $("#chart-type-modal").modal('hide');
});

// $("#set-number-of-outlinks-btn").on('click', function() {
//   updateChartTypeToSignal('number_of_outlinks');
//   $("#chart-type-modal").modal('hide');
// });

$("#set-page-0-btn").on('click', function() {
  updateChartTypeToPage(pageInvertedIndex[0]);
  $("#chart-type-modal").modal('hide');
});

$("#set-page-1-btn").on('click', function() {
  updateChartTypeToPage(pageInvertedIndex[1]);
  $("#chart-type-modal").modal('hide');
});

$("#set-page-2-btn").on('click', function() {
  updateChartTypeToPage(pageInvertedIndex[2]);
  $("#chart-type-modal").modal('hide');
});

$("#set-edit-features-btn").on('click', function() {
  var pageIds = $('.page-select').val() || [];
  updateRadarChart(pageIds);
  $("#chart-type-modal").modal('hide');
});

$("#set-related-page-0-btn").on('click', function() {
  updateBubbleChart(pageInvertedIndex[0]);
  $("#chart-type-modal").modal('hide');
});

$("#set-related-page-1-btn").on('click', function() {
  updateBubbleChart(pageInvertedIndex[1]);
  $("#chart-type-modal").modal('hide');
});

$("#set-related-page-2-btn").on('click', function() {
  updateBubbleChart(pageInvertedIndex[2]);
  $("#chart-type-modal").modal('hide');
});

function updateActiveChart() {
  var pageIds = $('.page-select').val() || [];
  if (pageIds.length > 0) {
    setTimeout(function() { $("#article-input").get(0).scrollIntoView({ behavior: "smooth" }); }, 500);
    if (activeChartId == null || activeChartId === "lineChart") {
      updateChartTypeToSignal(allSignals[0].id);
    } else if (activeChartId === "radarChart") {
      updateRadarChart(pageIds);
    } else if (activeChartId === "bubbleChart") {
      updateBubbleChart(pageInvertedIndex[pageIds.length - 1]);
    }
  }
}

function updateChartTypeToSignal(signalId) {
  var chartSpecs = {
    chartType: 'signal',
    data: {
      signalId: signalId,
      pageIds: $('.page-select').val() || []
    }
  };
  updateLineChart(chartSpecs);
}

function updateChartTypeToPage(pageId) {
  var chartSpecs = {
    chartType: 'page',
    data: {
      pageId: pageId,
      signalIds: _.map(allSignals, 'id')
    }
  };
  updateLineChart(chartSpecs);
}

function updateLineChart(chartSpecs) {
  var pageIds = $('.page-select').val() || [];
  if (pageIds.length > 0) {
    $("#lineChart").show(); $("#radarChart").hide(); $("#bubbleChart").hide();
    activeChartId = "lineChart"; activeChart = myLineChart;
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
}

function updateChartForSignal(signalId, pageIds) {
  var signalIndex = signalInvertedIndex[signalId];
  var signalLabel = allSignals[signalIndex].label;
  myLineChart.options.title.text = "Compare " + signalLabel + " for all pages";
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
      var dateToValue = {};
      _.each(response, function(data) { dateToValue[data['day']] = data[signalId]; });
      var values = [];
      for (var d = startDate.clone(); !d.isAfter(endDate); d.add(1, 'days')) {
        var key = d.format(dateFormat);
        if (key in dateToValue) {
          values.push(dateToValue[key]);
        } else {
          var signal = allSignals[signalInvertedIndex[signalId]];
          if (values.length == 0 || signal.onMissing == "zero") {
            values.push(0);
          } else if (signal.onMissing == "same") {
            values.push(values[values.length - 1]);
          }
        }
      }
      callback(pageId, signalId, values);
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
  var pageIds = $('.page-select').val() || [];
  if (pageIds.length > 0) {
    $("#lineChart").hide(); $("#radarChart").show(); $("#bubbleChart").hide();
    activeChartId = "radarChart"; activeChart = myRadarChart;
    myRadarChart.data.datasets = [];
    myRadarChart.options.scale.display = false;
    _.each(pageIds, function(pageId) {
      requestPageFeatures(pageId, startDate, endDate, addPageFeaturesToRadarChart);
    });
    myRadarChart.update();
  }
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
        features["maxPeakOrder5"],
        features["maxPeakOrder7"],
        features["maxPeakOrder10"],
        features["maxPeakOrder14"]
      ]
  });
  myRadarChart.options.scale.display = true;
  myRadarChart.update();
}

Chart.defaults.bubble.scales.xAxes[0].display = true;
Chart.defaults.bubble.scales.xAxes[0].ticks = {
  min: -1.5,
  max: 1.5,
  display: false
};

Chart.defaults.bubble.scales.yAxes[0].display = true;
Chart.defaults.bubble.scales.yAxes[0].ticks = {
  min: -1.5,
  max: 1.5,
  display: false
};

var myBubbleChart = new Chart($("#bubbleChart"),{
    type: 'bubble',
    data: {
      datasets: []
    },
    options: {
      title: {
        display: false,
        text: ""
      },
      responsive: true,
      onClick: bubbleChartOnClick,
      maintainAspectRatio: false,
      elements: {
          points: {
              borderWidth: 1,
              borderColor: 'rgb(0, 0, 0)'
          }
      },
      legend: {
        onClick: _.noop()
      },
      tooltips: {
        callbacks: {
          label: function(tooltipItem, data) {
            var datasetLabel = data.datasets[tooltipItem.datasetIndex].label || '';
            var dataPoint = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
            return datasetLabel + ' (' + Math.floor(dataPoint.r) + ')';
          }
        }
      }
    }
});

function bubbleChartOnClick(e) {
  var activePoints = myBubbleChart.getElementAtEvent(e);
  if (activePoints.length == 1) {
    var dataset = myBubbleChart.data.datasets[activePoints[0]._datasetIndex];
    console.log(dataset)
  }
}

function updateBubbleChart(pageId) {
  var pageIds = $('.page-select').val() || [];
  if (pageIds.length > 0) {
    $("#lineChart").hide(); $("#radarChart").hide(); $("#bubbleChart").show();
    activeChartId = "bubbleChart"; activeChart = myBubbleChart;
    myBubbleChart.data.datasets = [];
    myBubbleChart.options.title.display = true;
    myBubbleChart.options.title.text = "Popular pages related to " + pageData[pageId].title;
    myBubbleChart.update();
    requestPageRelatedPages(pageId, requestRelatedPagesData)
  }
}

function requestPageRelatedPages(pageId, callback) {
  var requestUrl = "http://localhost:8080/related/";
  var requestData = {
    p: pageId
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

function requestRelatedPagesData(pageId, relatedPages) {
  var relatedPageIds = _.map(relatedPages, 'page_id');
  if (relatedPageIds.length > 50) relatedPageIds.length = 50;
  var requestUrl = "https://en.wikipedia.org/w/api.php?";
  var requestData = {
    action: "query",
    format: "json",
    pageids: relatedPageIds.join("|"),
    prop: "pageprops|pageimages|pageterms",
    redirects: "",
    ppprop: "displaytitle",
    piprop: "thumbnail",
    pithumbsize: "80",
    pilimit: "6",
    wbptterms: "description"
  };
  $.ajax({
    url: requestUrl,
    data: requestData,
    dataType: 'jsonp',
    success: function(response) {
      var validRelatedPages = _.filter(relatedPages, function(relatedPage) {
        return response.query.pages[relatedPage['page_id']] &&
            response.query.pages[relatedPage['page_id']].ns === 0;
      });
      _.each(validRelatedPages, function(relatedPage) {
        pageData[relatedPage['page_id']] = response.query.pages[relatedPage['page_id']];
      });
      if (validRelatedPages.length > 10) validRelatedPages.length = 10;
      addRelatedPagesToBubbleChart(validRelatedPages);
    }
  });
}

function addRelatedPagesToBubbleChart(relatedPages) {
  var bubbleCoords = getCoords(relatedPages.length);
  var radiusScaleFactor = 50 / (_.max(_.map(relatedPages, 'score')) + 1);
  var datasets = _.map(relatedPages, function(page, index) {
    return {
      label: pageData[page['page_id']].title,
      data: [{ x: bubbleCoords[index].x, y: bubbleCoords[index].y, r: Math.max(page['score'] * radiusScaleFactor, 5)}],
      backgroundColor: chartColors[index],
      hoverBackgroundColor: chartColors[index]
    }
  });
  myBubbleChart.data.datasets = datasets;
  myBubbleChart.update();
}

function getCoords(n) {
    if (n == 0) return [];
    if (n == 1) return [{x: 0.0, y: 0.0}];
    var coords = [];
    var mult = 2 * Math.PI / n;
    for (var i = 0; i < n; ++i) {
        coords.push({
            x: Math.cos(mult * i),
            y: Math.sin(mult * i)
        });
    }
    return coords;
}


setTimeout(function() {
  $("#lineChart").hide();
  $("#radarChart").hide();
  $("#bubbleChart").hide();
}, 0);

