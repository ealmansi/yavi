!function(){"use strict";angular.module("yavi",["chart.js","daterangepicker","ngAnimate","ngAria","ngCookies","ngMessages","ngResource","ngSanitize","ngTouch","toastr","ui.bootstrap","ui.router"])}(),function(){"use strict";function e(e,a,t,i,r){function n(e,a,t){var i=this;if(e.isValidId(a.pageId)){i.page=e.getPageById(a.pageId),i.period=a.period;var r=t.$on("periodSelection",function(e,a){i.period.startDate=a.startDate,i.period.endDate=a.endDate,l(i.page,i.period.startDate,i.period.endDate)});a.$on("$destroy",r)}}function o(e){l(e.vm.page,e.vm.period.startDate,e.vm.period.endDate)}function l(t,n,o){function l(e,a,t){new d3.svg.BubbleChart({supportResponsive:!0,container:"#bubble-chart",size:600,innerRadius:600/3.5,radiusMin:50,data:e,plugins:[{name:"central-click",options:{text:"(See more detail)",style:{"font-size":"12px","font-style":"italic","font-family":"Source Sans Pro, sans-serif","text-anchor":"middle",fill:"black"},attr:{dy:"65px"},centralClick:function(e){i.go("explorePage",{pageId:e.pageId,startDate:a,endDate:t})}}},{name:"lines",options:{format:[{textField:"text",classed:{text:!0},style:{"font-size":"24px","font-family":"Source Sans Pro, sans-serif","text-anchor":"middle",fill:"black"},attr:{dy:"0px",x:function(e){return e.cx},y:function(e){return e.cy}}},{textField:"count",classed:{count:!0},style:{"font-size":"14px","font-family":"Source Sans Pro, sans-serif","text-anchor":"middle",fill:"black"},attr:{dy:"20px",x:function(e){return e.cx},y:function(e){return e.cy}}}],centralFormat:[{style:{"font-size":"50px"},attr:{}},{style:{"font-size":"30px"},attr:{dy:"40px"}}]}}]})}angular.element("#bubble-chart").empty(),t.getRelatedPages(n,o).then(function(t){function i(e){var a="related-page-{{pageId}}";return r(a)({pageId:e.pageId})}function d(e){return function(a){return e>0?100*a.score/e:1}}var s=[],p=[];angular.forEach(t,function(a){if(angular.isDefined(a)&&angular.isDefined(a.pageId)&&angular.isDefined(a.score)){var t=a.pageId,i=a.score,r=e.getPageById(t),n=r.getTitle().then(function(e){s.push({pageId:t,text:e,score:i})})["catch"](function(){});p.push(n)}}),a.all(p).then(function(){if(s.length>0){var e=0;angular.forEach(s,function(a){e=Math.max(e,a.score)}),s.sort(function(e,a){var t=e.score-a.score;return 0!=t?t:e.pageId-a.pageId}),s.reverse();var a=1;angular.forEach(s,function(e){e.count=a,a+=1}),l({classed:i,eval:d(e),items:s},n,o)}})})}var d={controller:n,controllerAs:"vm",link:o,restrict:"E",scope:{pageId:"=",period:"="},templateUrl:"app/explore-page/yv-explore-page-related-pages-card/yv-related-pages-bubble-chart/yvRelatedPagesBubbleChart.html"};return n.$inject=["wikipediaPages","$scope","$rootScope"],d}angular.module("yavi").directive("yvRelatedPagesBubbleChart",e),e.$inject=["wikipediaPages","$q","$location","$state","$interpolate"]}(),function(){"use strict";function e(e){function a(e,a,t){var i=this;i.page=e.getPageById(a.pageId),i.onCardClick=function(){t.go("explorePage",{pageId:i.page.pageId})}}function t(a,t){a.vm.page.getThumbnail().then(function(a){var i="url('{{ thumbnail }}')";t.find(".page-thumbnail").css("background-image",e(i)({thumbnail:a}))}),a.vm.page.getTitle().then(function(e){t.find(".page-title").html(e)}),a.vm.page.getDescription().then(function(e){var a=t.find(".page-description");a.html(e),a.dotdotdot({ellipsis:" ..."})}),a.vm.page.getCategoryList().then(function(a){var i=t.find(".page-category-list"),r='<li class="page-category-item">{{ category }}</li>';angular.forEach(a,function(a){i.append(e(r)({category:a}))})})}var i={controller:a,controllerAs:"vm",link:t,restrict:"E",scope:!0,templateUrl:"app/home/yv-home-search-results/yv-home-search-results-card/yvHomeSearchResultsCard.html"};return a.$inject=["wikipediaPages","$scope","$state"],i}angular.module("yavi").directive("yvHomeSearchResultsCard",e),e.$inject=["$interpolate"]}(),function(){"use strict";function e(){function e(e){var a=this;a.stateToHome=function(){e.go("home")}}var a={controller:e,controllerAs:"vm",restrict:"E",scope:!0,templateUrl:"app/page-not-found/yv-page-not-found-navbar/yvPageNotFoundNavbar.html"};return e.$inject=["$state"],a}angular.module("yavi").directive("yvPageNotFoundNavbar",e)}(),function(){"use strict";function e(e,a){function t(a,t,i){function r(e,a){var t=new Date(e.date).getTime(),i=new Date(a.date).getTime(),r=t-i;return 0!=r?r:e.value-a.value}function n(e,a){function t(){r.zoomToIndexes(r.dataProvider.length-40,r.dataProvider.length-1)}function i(e){}angular.element("#"+e).empty();var r=AmCharts.makeChart(e,{type:"serial",theme:"light",marginRight:40,marginLeft:40,autoMarginOffset:20,dataDateFormat:"YYYY-MM-DD",valueAxes:[{id:"v1",axisAlpha:0,position:"left",ignoreAxisWidth:!0}],balloon:{borderThickness:1,shadowAlpha:0},graphs:[{id:"g1",balloon:{drop:!0,adjustBorderColor:!1,color:"#ffffff"},bullet:"round",bulletBorderAlpha:1,bulletColor:"#FFFFFF",bulletSize:5,hideBulletsCount:50,lineThickness:2,title:"red line",useLineColorForBulletBorder:!0,valueField:"value",balloonText:"<span style='font-size:18px;'>[[value]]</span>"}],chartScrollbar:{graph:"g1",oppositeAxis:!1,offset:30,scrollbarHeight:80,backgroundAlpha:0,selectedBackgroundAlpha:.1,selectedBackgroundColor:"#888888",graphFillAlpha:0,graphLineAlpha:.5,selectedGraphFillAlpha:0,selectedGraphLineAlpha:1,autoGridCount:!0,color:"#AAAAAA"},chartCursor:{pan:!0,valueLineEnabled:!0,valueLineBalloonEnabled:!0,cursorAlpha:1,cursorColor:"#258cbb",limitToGraph:"g1",valueLineAlpha:.2},valueScrollbar:{oppositeAxis:!1,offset:50,scrollbarHeight:10},categoryField:"date",categoryAxis:{parseDates:!0,dashLength:1,minorGridEnabled:!0},"export":{enabled:!0},dataProvider:a});return r.invalidateSize(),r.addListener("rendered",t),t(),r.addListener("zoomed",i),r}var o=this,l=void 0;if(a.$on("$destroy",function(){angular.isDefined(l)&&i.cancel(l)}),o.numberOfAddedInlinksChart=void 0,o.numberOfAddedOutlinksChart=void 0,o.numberOfRevertedRevisionsChart=void 0,o.numberOfRevisionsChart=void 0,o.numberOfTotalOutlinksChart=void 0,o.numberOfUniqueEditorsChart=void 0,o.pageContentSizeChart=void 0,e.isValidId(a.pageId)){o.page=e.getPageById(a.pageId),o.period=a.period;var d=o.period.startDate,s=o.period.endDate,p=void 0;o.onSelect=function(e){switch(p=e){case"number-of-added-inlinks":o.makeChartNumberOfAddedInlinks(d,s);break;case"number-of-added-outlinks":o.makeChartNumberOfAddedOutlinks(d,s);break;case"number-of-reverted-revisions":o.makeChartNumberOfRevertedRevisions(d,s);break;case"number-of-revisions":o.makeChartNumberOfRevisions(d,s);break;case"number-of-total-outlinks":o.makeChartNumberOfTotalOutlinks(d,s);break;case"number-of-unique-editors":o.makeChartNumberOfUniqueEditors(d,s);break;case"page-content-size":o.makeChartPageContentSize(d,s)}};var u=t.$on("periodSelection",function(e,a){d=a.startDate,s=a.endDate,o.onSelect(p)});a.$on("$destroy",u),o.makeChartNumberOfAddedInlinks=function(e,a){o.page.getNumberOfAddedInlinksList(e,a).then(function(e){e.sort(r),o.numberOfAddedInlinksChart=n("chart-number-of-added-inlinks",e)})},o.makeChartNumberOfAddedOutlinks=function(e,a){o.page.getNumberOfAddedOutlinksList(e,a).then(function(e){e.sort(r),o.numberOfAddedOutlinksChart=n("chart-number-of-added-outlinks",e)})},o.makeChartNumberOfRevertedRevisions=function(e,a){o.page.getNumberOfRevertedRevisionsList(e,a).then(function(e){e.sort(r),o.numberOfRevertedRevisionsChart=n("chart-number-of-reverted-revisions",e)})},o.makeChartNumberOfRevisions=function(e,a){o.page.getNumberOfRevisionsList(e,a).then(function(e){e.sort(r),o.numberOfRevisionsChart=n("chart-number-of-revisions",e)})},o.makeChartNumberOfTotalOutlinks=function(e,a){o.page.getNumberOfTotalOutlinksList(e,a).then(function(e){e.sort(r),o.numberOfTotalOutlinksChart=n("chart-number-of-total-outlinks",e)})},o.makeChartNumberOfUniqueEditors=function(e,a){o.page.getNumberOfUniqueEditorsList(e,a).then(function(e){e.sort(r),o.numberOfUniqueEditorsChart=n("chart-number-of-unique-editors",e)})},o.makeChartPageContentSize=function(e,a){o.page.getPageContentSizeList(e,a).then(function(e){e.sort(r),o.pageContentSizeChart=n("chart-page-content-size",e)})}}}var i={controller:t,controllerAs:"vm",restrict:"E",scope:{pageId:"=",period:"="},templateUrl:"app/explore-page/yv-explore-page-signals-card/yvExplorePageSignalsCard.html"};return t.$inject=["$scope","$rootScope","$timeout"],i}angular.module("yavi").directive("yvExplorePageSignalsCard",e),e.$inject=["wikipediaPages","$log"]}(),function(){"use strict";function e(){function e(e,a){var t=this;e.isValidId(a.pageId)&&(t.page=e.getPageById(a.pageId),t.period=a.period)}var a={controller:e,controllerAs:"vm",restrict:"E",scope:{pageId:"=",period:"="},templateUrl:"app/explore-page/yv-explore-page-related-pages-card/yvExplorePageRelatedPagesCard.html"};return e.$inject=["wikipediaPages","$scope"],a}angular.module("yavi").directive("yvExplorePageRelatedPagesCard",e)}(),function(){"use strict";function e(){function e(e,a){var t=this;e.isValidId(a.pageId)&&(t.page=e.getPageById(a.pageId),t.period=a.period,t.radarLabels=["Eating","Drinking","Sleeping","Designing","Coding","Cycling","Running"],t.radarData=[[65,59,90,81,56,55,40],[28,48,40,19,96,27,100]],t.lineLabels=["January","February","March","April","May","June","July"],t.lineSeries=["Series A","Series B"],t.lineData=[[65,59,80,81,56,55,40],[28,48,40,19,86,27,90]])}var a={controller:e,controllerAs:"vm",restrict:"E",scope:{pageId:"=",period:"="},templateUrl:"app/explore-page/yv-explore-page-popularity-card/yvExplorePagePopularityCard.html"};return e.$inject=["wikipediaPages","$scope"],a}angular.module("yavi").directive("yvExplorePagePopularityCard",e)}(),function(){"use strict";function e(){function e(e,a,t){var i=this;e.isValidId(a.pageId)&&(i.page=e.getPageById(a.pageId),i.period=a.period,i.datePicker={date:{startDate:i.period.startDate,endDate:i.period.endDate}},i.onApply=function(){a.$emit("periodSelection",{startDate:i.datePicker.date.startDate.format("YYYY-MM-DD"),endDate:i.datePicker.date.endDate.format("YYYY-MM-DD")})})}var a={controller:e,controllerAs:"vm",restrict:"E",scope:{pageId:"=",period:"="},templateUrl:"app/explore-page/yv-explore-page-period-selector-card/yvExplorePagePeriodSelectorCard.html"};return e.$inject=["wikipediaPages","$scope","$log"],a}angular.module("yavi").directive("yvExplorePagePeriodSelectorCard",e)}(),function(){"use strict";function e(){function e(e,a,t){var i=this;i.navbarMenuIsCollapsed=!0,i.searchBoxInput="",i.onChange=function(){i.onSubmit()},i.onSubmit=function(){t.go("home",{query:i.searchBoxInput})},i.stateToHome=function(){t.go("home")},i.toggleNavbarMenu=function(){i.navbarMenuIsCollapsed=!i.navbarMenuIsCollapsed},e.isValidId(a.pageId)&&(i.page=e.getPageById(a.pageId),i.page.getTitle().then(function(e){i.searchBoxInput=e}))}var a={controller:e,controllerAs:"vm",restrict:"E",scope:{pageId:"="},templateUrl:"app/explore-page/yv-explore-page-navbar/yvExplorePageNavbar.html"};return e.$inject=["wikipediaPages","$scope","$state"],a}angular.module("yavi").directive("yvExplorePageNavbar",e)}(),function(){"use strict";function e(e,a,t){function i(t,i){function r(e){var t=void 0;return angular.forEach(a,function(a){a.wikipediaId==e&&(t=a)}),t}var n=this;n.carrouselSlides=[{image:"/assets/images/fallback-thumbnail.png",id:0}],n.carrouselNoWrap=!1,t.isValidId(i.pageId)&&(n.page=t.getPageById(i.pageId),n.period=i.period,n.activeWikipediaSource=r(e.wikipediaId))}function r(e,a){e.vm.page.getImagesList().then(function(a){if(a.length>0){e.vm.carrouselSlides=[],a.sort(function(e,a){return a.width*a.height-e.width*e.height});var t=0;angular.forEach(a,function(a){e.vm.carrouselSlides.push({image:a.url,id:t}),t+=1})}}),e.vm.page.getTitle().then(function(e){a.find("#page-title").html(e)}),e.vm.page.getDescription().then(function(e){var t=a.find("#page-description");t.html(e),t.dotdotdot({ellipsis:" ..."})}),e.vm.page.getCategoryList().then(function(e){var i=a.find("#page-category-list"),r='<li class="page-category-item">{{ category }}</li>';angular.forEach(e,function(e){i.append(t(r)({category:e}))})});var i=a.find("#page-wikipedia-link"),r="https://{{wikipediaId}}.wikipedia.org/?curid={{pageId}}";i.attr("href",t(r)({wikipediaId:e.vm.activeWikipediaSource.wikipediaId,pageId:e.vm.page.pageId})),e.vm.page.getTitle().then(function(e){var t=a.find("#page-google-link");t.attr("href","https://google.com/?q="+e)})}var n={controller:i,controllerAs:"vm",link:r,restrict:"E",scope:{pageId:"=",period:"="},templateUrl:"app/explore-page/yv-explore-page-main-card/yvExplorePageMainCard.html"};return i.$inject=["wikipediaPages","$scope"],n}angular.module("yavi").directive("yvExplorePageMainCard",e),e.$inject=["yaviConfig","wikipediaSources","$interpolate"]}(),function(){"use strict";function e(){function e(e){var a=this;a.searchResults=e.$parent.vm.searchResults}var a={controller:e,controllerAs:"vm",restrict:"E",scope:!0,templateUrl:"app/home/yv-home-search-results/yvHomeSearchResults.html"};return e.$inject=["$scope"],a}angular.module("yavi").directive("yvHomeSearchResults",e)}(),function(){"use strict";function e(){function e(e,a,t,i,r,n){var o=this;o.query=e.$parent.vm.query,o.searchResults=e.$parent.vm.searchResults,o.searchBoxInputDebounce=150,o.searchOngoing=!1;var l=void 0;o.onChange=function(){l=i(function(){if(o.query.value){o.searchOngoing=!0;var e=l;r.search(o.query.value).then(function(a){e==l&&(o.searchResults.value=a),o.searchOngoing=!1})["catch"](function(){o.searchOngoing=!1})}else o.searchResults.value=[]})},e.$on("$destroy",function(){angular.isDefined(l)&&i.cancel(l)}),o.onSubmit=function(){o.searchResults.value.length>0&&n.go("explorePage",{pageId:o.searchResults.value[0]})}}function a(e,a){a.find("#home-search-box-input").focus(),e.vm.onChange()}var t={controller:e,controllerAs:"vm",link:a,restrict:"E",scope:!0,templateUrl:"app/home/yv-home-search-box/yvHomeSearchBox.html"};return e.$inject=["$scope","$location","$anchorScroll","$timeout","wikipediaAPI","$state"],t}angular.module("yavi").directive("yvHomeSearchBox",e)}(),function(){"use strict";function e(){var e={restrict:"E",scope:!0,templateUrl:"app/home/yv-home-imagetype/yvHomeImagetype.html"};return e}angular.module("yavi").directive("yvHomeImagetype",e)}(),function(){"use strict";function e(){function e(e,a,t,i){function r(e){var t=void 0;return angular.forEach(a,function(a){a.wikipediaId==e&&(t=a)}),t}var n=this;n.query=e.$parent.vm.query,n.navbarMenuIsCollapsed=!0,n.toggleNavbarMenu=function(){n.navbarMenuIsCollapsed=!n.navbarMenuIsCollapsed},n.wikipediaSources=a,n.activeWikipediaSource=r(t.wikipediaId),n.selectWikipediaSource=function(e){var a=r(e);angular.isDefined(a)&&(t.wikipediaId=a.wikipediaId,i.go(i.current,{query:n.query.value},{reload:!0,inherit:!1}))}}var a={controller:e,controllerAs:"vm",restrict:"E",scope:!0,templateUrl:"app/home/yv-home-navbar/yvHomeNavbar.html"};return e.$inject=["$scope","wikipediaSources","yaviConfig","$state"],a}angular.module("yavi").directive("yvHomeNavbar",e)}(),function(){"use strict";function e(){function e(e,a){a.on("click",function(){angular.element("body").animate({scrollTop:angular.element("yv-home-imagetype").offset().top},"fast")})}var a={link:e,restrict:"A"};return a}angular.module("yavi").directive("yvScrollOnClick",e)}(),function(){"use strict";function e(e){function a(){return e(r)({pageTitle:o})}function t(e){o=e}function i(){t(n)}var r="Yavi - {{pageTitle}}",n="Visualize Wikipedia",o=n;return{getPageTitle:a,setPageTitle:t,setDefaultPageTitle:i}}angular.module("yavi").factory("yvPageTitleConfig",e),e.$inject=["$interpolate"]}(),function(){"use strict";function e(e){function a(a,t){a.$watch(function(){return e.getPageTitle()},function(e){t.find("title").html(e)})}var t={link:a,restrict:"E",scope:!0,template:"<title></title>"};return t}angular.module("yavi").directive("yvPageTitle",e),e.$inject=["yvPageTitleConfig"]}(),function(){"use strict";function e(e,a,t){function i(e,i,r,n){var o="";return o+="http://localhost:8080/yavi-server/signal?",o+="&pageid={{pageId}}",o+="&wikipediaid={{wikipediaId}}",o+="&datefrom={{dateFrom}}",o+="&dateto={{dateTo}}",o+="&signaltype={{signalType}}",o+="&callback=JSON_CALLBACK",t(o)({signalType:e,pageId:i,wikipediaId:a.wikipediaId,dateFrom:r,dateTo:n})}function r(e,i,r){var n="";return n+="http://localhost:8080/yavi-server/relatedpages?",n+="&pageid={{pageId}}",n+="&wikipediaid={{wikipediaId}}",n+="&datefrom={{dateFrom}}",n+="&dateto={{dateTo}}",n+="&callback=JSON_CALLBACK",t(n)({pageId:e,wikipediaId:a.wikipediaId,dateFrom:i,dateTo:r})}function n(e){throw t("Yavi Server: {{errorMessage}}.")({errorMessage:e})}var o={};return o.getPageSignal=function(a,t,r,o){function l(e){return angular.isDefined(e)&&angular.isDefined(e.data)?e.data:void d()}function d(){n("Signal could not be retrieved")}return e.jsonp(i(a,t,r,o)).then(l,d)},o.getPageRelatedPages=function(a,t,i){function o(e){return angular.isDefined(e)&&angular.isDefined(e.data)?e.data:void l()}function l(){n("RelatedPages could not be retrieved")}return e.jsonp(r(a,t,i)).then(o,l)},o}angular.module("yavi").factory("yaviServer",e),e.$inject=["$http","yaviConfig","$interpolate"]}(),function(){"use strict";function e(e){var a={};return new function(){this.isValidId=function(e){var a=parseInt(e,10);return a>0},this.getPageById=function(t){var i=parseInt(t,10);return a.hasOwnProperty(i)||(a[i]=new e(i)),a[i]}}}angular.module("yavi").factory("wikipediaPages",e),e.$inject=["WikipediaPage"]}(),function(){"use strict";function e(e,a,t){function i(i){var r=this;r.pageId=i;var n=void 0,o=void 0,l=void 0,d=void 0,s=void 0,p=void 0,u=void 0,c=void 0,g=void 0,v=void 0,h=void 0,m=void 0,f=void 0;r.getCategoryList=function(){return angular.isUndefined(n)?a.getPageCategories(i).then(function(e){return n=e}):e.when(n)},r.getDescription=function(){return angular.isUndefined(o)?a.getPageDescription(i).then(function(e){return o=e}):e.when(o)},r.getImagesList=function(){return angular.isUndefined(l)?a.getPageImagesList(i).then(function(e){return l=e}):e.when(l)},r.getNumberOfAddedInlinksList=function(e,a){return t.getPageSignal("numberofaddedinlinks",i,e,a).then(function(e){return d=e})},r.getNumberOfAddedOutlinksList=function(e,a){return t.getPageSignal("numberofaddedoutlinks",i,e,a).then(function(e){return s=e})},r.getNumberOfRevertedRevisionsList=function(e,a){return t.getPageSignal("numberofrevertedrevisions",i,e,a).then(function(e){return p=e})},r.getNumberOfRevisionsList=function(e,a){return t.getPageSignal("numberofrevisions",i,e,a).then(function(e){return u=e})},r.getNumberOfTotalOutlinksList=function(e,a){return t.getPageSignal("numberoftotaloutlinks",i,e,a).then(function(e){return c=e})},r.getNumberOfUniqueEditorsList=function(e,a){return t.getPageSignal("numberofuniqueeditors",i,e,a).then(function(e){return g=e})},r.getPageContentSizeList=function(e,a){return t.getPageSignal("pagecontentsize",i,e,a).then(function(e){return v=e})},r.getRelatedPages=function(e,a){return t.getPageRelatedPages(i,e,a).then(function(e){return h=e})},r.getThumbnail=function(){return angular.isUndefined(m)?a.getPageThumbnail(i).then(function(e){return m=e}):e.when(m)},r.getTitle=function(){return angular.isUndefined(f)?a.getPageTitle(i).then(function(e){return f=e}):e.when(f)}}return i}angular.module("yavi").service("WikipediaPage",e),e.$inject=["$q","wikipediaAPI","yaviServer"]}(),function(){"use strict";function e(e,a,t,i){function r(e){var t="";return t+="https://{{wikipediaId}}.wikipedia.org/w/api.php?",t+="&pageids={{pageId}}",t+="&action=query",t+="&prop=categories",t+="&clshow=!hidden",t+="&format=json",t+="&callback=JSON_CALLBACK",i(t)({wikipediaId:a.wikipediaId,pageId:e})}function n(e){var t="";return t+="https://{{wikipediaId}}.wikipedia.org/w/api.php?",t+="&pageids={{pageId}}",t+="&action=query",t+="&prop=extracts",t+="&exintro=",t+="&explaintext=",t+="&format=json",t+="&callback=JSON_CALLBACK",i(t)({wikipediaId:a.wikipediaId,pageId:e})}function o(e){var t="";return t+="https://{{wikipediaId}}.wikipedia.org/w/api.php?",t+="&pageids={{pageId}}",t+="&action=query",t+="&generator=images",t+="&prop=imageinfo",t+="&iiprop=url|dimensions",t+="&gimlimit=10",t+="&format=json",t+="&callback=JSON_CALLBACK",i(t)({wikipediaId:a.wikipediaId,pageId:e})}function l(e){var t="";return t+="https://{{wikipediaId}}.wikipedia.org/w/api.php?",t+="&pageids={{pageId}}",t+="&action=query",t+="&prop=pageimages",t+="&pithumbsize=500",t+="&format=json",t+="&callback=JSON_CALLBACK",i(t)({wikipediaId:a.wikipediaId,pageId:e})}function d(e){var t="";return t+="https://{{wikipediaId}}.wikipedia.org/w/api.php?",t+="&action=query",t+="&list=search",t+="&srsearch={{query}}",t+="&srnamespace=0",t+="&srwhat=text",t+="&srprop=size",t+="&indexpageids=",t+="&redirects=",t+="&srlimit=20",t+="&format=json",t+="&callback=JSON_CALLBACK",i(t)({wikipediaId:a.wikipediaId,query:e})}function s(e){var t="";return t+="https://{{wikipediaId}}.wikipedia.org/w/api.php?",t+="&titles={{title}}",t+="&action=query",t+="&format=json",t+="&callback=JSON_CALLBACK",i(t)({wikipediaId:a.wikipediaId,title:e})}function p(e){throw i("Wikipedia API: {{errorMessage}}.")({errorMessage:e})}var u={};return u.getPageCategories=function(a){function t(e){if(e&&e.data&&e.data.query&&e.data.query.pages&&e.data.query.pages[a]&&e.data.query.pages[a].categories){var t=e.data.query.pages[a].categories,r=[];return angular.forEach(t,function(e){var a=e.title,t=a.substr(a.indexOf(":")+1,a.length);this.push(t)},r),r}i()}function i(){p("Categories could not be retrieved")}return e.jsonp(r(a)).then(t,i)},u.getPageDescription=function(a){function t(e){return e&&e.data&&e.data.query&&e.data.query.pages&&e.data.query.pages[a]&&e.data.query.pages[a].extract?e.data.query.pages[a].extract:void i()}function i(){p("Description could not be retrieved")}return e.jsonp(n(a)).then(t,i)},u.getPageImagesList=function(a){function t(e){var a=["bmp","eps","gif","jpeg","jpg","pcd","pct","pdf","pict","png","ps","psd","pub","svg","thm"],t=["commons-logo.svg","ambox_scales.svg","ambox_current_red.svg","star_full.svg","star_empty.svg","searchtool.svg","crystal_clear_app_browser.png","padlock.svg","padlock-silver.svg","padlock-olive.svg","ambox_outdated_serious.svg","wikinews-logo.svg"];if(e&&e.data&&e.data.query&&e.data.query.pages){var r={};angular.forEach(e.data.query.pages,function(e){if(e.imageinfo&&e.imageinfo.length>0&&e.imageinfo[0].url&&e.imageinfo[0].width&&e.imageinfo[0].height){var i=e.imageinfo[0].url,n=e.imageinfo[0].width,o=e.imageinfo[0].height;if(!r.hasOwnProperty(i)&&n>=100&&1e3>=n&&o>=100&&1e3>=o){var l=i.toLowerCase(),d=!1;if(angular.forEach(t,function(e){-1!==l.indexOf(e)&&(d=!0)}),!d){var s=l.split(".").pop();-1!==a.indexOf(s)&&(r[i]={url:i,width:n,height:o})}}}});var n=[];return angular.forEach(r,function(e){n.push(e)}),n}i()}function i(){p("Images list could not be retrieved")}return e.jsonp(o(a)).then(t,i)},u.getPageThumbnail=function(a){function t(e){return e&&e.data&&e.data.query&&e.data.query.pages&&e.data.query.pages[a]&&e.data.query.pages[a].thumbnail&&e.data.query.pages[a].thumbnail.source?e.data.query.pages[a].thumbnail.source:void i()}function i(){p("Thumbnail could not be retrieved")}return e.jsonp(l(a)).then(t,i)},u.getPageTitle=function(a){function t(e){return e&&e.data&&e.data.query&&e.data.query.pages&&e.data.query.pages[a]&&e.data.query.pages[a].title?e.data.query.pages[a].title:void i()}function i(){p("Title could not be retrieved")}return e.jsonp(n(a)).then(t,i)},u.search=function(a){function i(e){if(e&&e.data&&e.data.query&&e.data.query.search&&angular.isArray(e.data.query.search)){var a=e.data.query.search,i=[],n=[];return angular.forEach(a,function(e){if(angular.isDefined(e.title)){var a=u.getPageIdByTitle(e.title).then(function(e){return u.getPageDescription(e).then(function(a){a.length>50&&i.push(e)})})["catch"](function(){});n.push(a)}}),t.all(n).then(function(){return i})}r()}function r(){p("Query results could not be retrieved")}return e.jsonp(d(a)).then(i,r)},u.getPageIdByTitle=function(a){function t(e){if(e&&e.data&&e.data.query&&e.data.query.pages){var a=Object.keys(e.data.query.pages);if(a.length>0)return a[0]}i()}function i(){p("Page Id could not be retrieved")}return e.jsonp(s(a)).then(t,i)},u}angular.module("yavi").factory("wikipediaAPI",e),e.$inject=["$http","yaviConfig","$q","$interpolate"]}(),function(){"use strict";function e(e,a){var t=this;e.setDefaultPageTitle(),t.stateToHome=function(){a.go("home")}}angular.module("yavi").controller("PageNotFoundController",e),e.$inject=["yvPageTitleConfig","$state"]}(),function(){"use strict";function e(e,a,t,i,r){var n=this;e.isValidId(a.pageId)||i.go("pageNotFound"),n.page=e.getPageById(a.pageId),n.period={startDate:a.startDate||"2014-01-01",endDate:a.endDate||"2014-03-01"},n.page.getTitle().then(function(e){t.setPageTitle(e)})["catch"](function(){i.go("pageNotFound")}),n.absoluteURL=r.absUrl()}angular.module("yavi").controller("ExplorePageController",e),e.$inject=["wikipediaPages","$stateParams","yvPageTitleConfig","$state","$location"]}(),function(){"use strict";function e(e,a){var t=this;e.setDefaultPageTitle(),t.query={value:a.query},t.searchResults={value:[]}}angular.module("yavi").controller("HomeController",e),e.$inject=["yvPageTitleConfig","$stateParams"]}(),function(){"use strict";angular.module("yavi").value("yaviConfig",{wikipediaId:"en"})}(),function(){"use strict";function e(){}angular.module("yavi").run(e)}(),function(){"use strict";function e(e,a,t){e.state("home",{url:"/",params:{query:null},templateUrl:"app/home/home.html",controller:"HomeController",controllerAs:"vm"}),e.state("explorePage",{url:"/explorePage/:pageId",params:{startDate:null,endDate:null},templateUrl:"app/explore-page/explorePage.html",controller:"ExplorePageController",controllerAs:"vm"}),e.state("pageNotFound",{url:"/pageNotFound/",templateUrl:"app/page-not-found/pageNotFound.html",controller:"PageNotFoundController",controllerAs:"vm"}),a.otherwise("/"),t.html5Mode(!0)}angular.module("yavi").config(e),e.$inject=["$stateProvider","$urlRouterProvider","$locationProvider"]}(),function(){"use strict";angular.module("yavi").constant("wikipediaSources",[{wikipediaId:"en",flagId:"gb",language:"English"},{wikipediaId:"de",flagId:"de",language:"Deutsch"},{wikipediaId:"ja",flagId:"jp",language:"日本語"},{wikipediaId:"ru",flagId:"ru",language:"Русский"},{wikipediaId:"es",flagId:"es",language:"Español"},{wikipediaId:"fr",flagId:"fr",language:"Français"},{wikipediaId:"it",flagId:"it",language:"Italiano"},{wikipediaId:"pt",flagId:"pt",language:"Português"},{wikipediaId:"zh",flagId:"cn",language:"中文"},{wikipediaId:"pl",flagId:"pl",language:"Polski"}])}(),function(){"use strict";function e(e,a,t){e.debugEnabled(!0),a.defaults.cache=!0,t.decorator("$exceptionHandler",["$log",function(e){return function(a){e.debug(a)}}])}angular.module("yavi").config(e),e.$inject=["$logProvider","$httpProvider","$provide"]}(),angular.module("yavi").run(["$templateCache",function(e){e.put("app/explore-page/explorePage.html",'<div id="explore-page-wrapper"><yv-explore-page-navbar page-id="vm.page.pageId"></yv-explore-page-navbar><div id="explore-page-cards-wrapper-1"><div id="explore-page-cards-wrapper-2"><div id="explore-page-cards-wrapper-3"><div id="explore-page-cards-left"><yv-explore-page-main-card page-id="vm.page.pageId" period="vm.period"></yv-explore-page-main-card><yv-explore-page-related-pages-card page-id="vm.page.pageId" period="vm.period"></yv-explore-page-related-pages-card></div><div id="explore-page-cards-right"><yv-explore-page-period-selector-card page-id="vm.page.pageId" period="vm.period"></yv-explore-page-period-selector-card><yv-explore-page-signals-card page-id="vm.page.pageId" period="vm.period"></yv-explore-page-signals-card><yv-explore-page-popularity-card page-id="vm.page.pageId" period="vm.period"></yv-explore-page-popularity-card></div></div></div></div></div>'),e.put("app/home/home.html",'<div id="home-wrapper"><yv-home-navbar></yv-home-navbar><yv-home-imagetype></yv-home-imagetype><yv-home-search-box yv-scroll-on-click=""></yv-home-search-box><yv-home-search-results></yv-home-search-results></div>'),e.put("app/page-not-found/pageNotFound.html",'<div id="page-not-found-wrapper"><yv-page-not-found-navbar></yv-page-not-found-navbar><div id="page-not-found-content" ng-click="vm.stateToHome()"><h1 id="page-not-found-header">Sorry, something went wrong...<hr><small>Click <em>here</em> to go back</small></h1><div id="page-not-found-isotype"></div></div></div>'),e.put("app/explore-page/yv-explore-page-main-card/yvExplorePageMainCard.html",'<div id="explore-page-main-card-wrapper"><div id="main-card-panel"><div id="main-card-panel-heading" uib-tooltip="General Information" tooltip-placement="bottom-right"><h3 id="main-card-panel-title"><span class="glyphicon glyphicon-globe" aria-hidden="true"></span></h3></div><div id="main-card-panel-body"><div id="main-card-panel-body-left"><h2 id="page-title"></h2><hr><div id="page-images-carrousel"><uib-carousel no-wrap="vm.carrouselNoWrap"><uib-slide ng-repeat="slide in vm.carrouselSlides" active="slide.active" index="slide.id"><img ng-src="{{slide.image}}"><div class="carousel-caption"></div></uib-slide></uib-carousel></div><div id="page-description"></div></div><div id="main-card-panel-body-right"><ul id="page-category-list"></ul><a id="page-wikipedia-link" target="_blank" href="#">Wikipedia</a> <a id="page-google-link" target="_blank" href="#">Google</a></div></div></div></div>'),e.put("app/explore-page/yv-explore-page-navbar/yvExplorePageNavbar.html",'<div id="explore-page-navbar-wrapper"><nav class="navbar navbar-default"><div class="container-fluid"><div class="navbar-header"><button type="button" class="navbar-toggle" ng-click="vm.toggleNavbarMenu()" aria-expanded="false"><span class="sr-only">Toggle navigation</span> <span class="icon-bar"></span> <span class="icon-bar"></span> <span class="icon-bar"></span></button> <a class="navbar-brand" href="#" ng-click="vm.stateToHome()"><img id="isotype" src="assets/images/isotype-small.png" alt="Yavi"></a></div><div class="collapse navbar-collapse" collapse="collapsed" uib-collapse="vm.navbarMenuIsCollapsed"><ul class="nav navbar-nav navbar-right"><li><a href="#">Home</a></li><li class="dropdown" uib-dropdown=""><a href="#" class="dropdown-toggle" uib-dropdown-toggle="" role="button" aria-haspopup="true" aria-expanded="false">Settings <span class="caret"></span></a><ul class="dropdown-menu" uib-dropdown-menu="" role="menu"><li><a href="#">Action</a></li><li><a href="#">Another action</a></li><li><a href="#">Something else here</a></li><li role="separator" class="divider"></li><li><a href="#">Separated link</a></li><li role="separator" class="divider"></li><li><a href="#">One more separated link</a></li></ul></li></ul><form class="navbar-form navbar-left" role="search"><div class="form-group"><div class="input-group"><input id="explore-page-search-box-input" type="text" class="form-control" ng-model="vm.searchBoxInput" ng-change="vm.onChange()" placeholder="Search for a Wikipedia page..." autocomplete="off" autofocus=""><div class="input-group-btn"><button id="explore-page-search-box-button" type="submit" class="btn btn-primary" ng-click="vm.onSubmit()"><span class="glyphicon glyphicon-search" aria-hidden="true"></span></button></div></div></div></form></div></div></nav></div>'),e.put("app/explore-page/yv-explore-page-period-selector-card/yvExplorePagePeriodSelectorCard.html",'<div id="explore-page-period-selector-card-wrapper"><div id="period-selector-card-panel"><div id="period-selector-card-panel-heading" uib-tooltip="Period selection" tooltip-placement="bottom-right"><h3 id="period-selector-card-panel-title"><span class="glyphicon glyphicon-calendar" aria-hidden="true"></span></h3></div><div id="period-selector-card-panel-body"><div class="row"><div class="col-xs-12 col-sm-8"><h5>Select period of interest:</h5></div><div class="col-xs-12 col-sm-4"><input date-range-picker="" class="form-control date-picker" type="text" ng-model="vm.datePicker.date" options="{eventHandlers: {\'apply.daterangepicker\': vm.onApply}}"></div></div></div></div></div>'),
e.put("app/explore-page/yv-explore-page-popularity-card/yvExplorePagePopularityCard.html",'<div id="explore-page-popularity-card-wrapper"><div id="popularity-card-panel"><div id="popularity-card-panel-heading" uib-tooltip="Compared Popularity" tooltip-placement="bottom-right"><h3 id="popularity-card-panel-title"><span class="glyphicon glyphicon-fire" aria-hidden="true"></span></h3></div><div id="popularity-card-panel-body"><canvas id="radar" class="chart chart-radar" chart-data="vm.radarData" chart-labels="vm.radarLabels"></canvas></div></div></div>'),e.put("app/explore-page/yv-explore-page-related-pages-card/yvExplorePageRelatedPagesCard.html",'<div id="explore-page-related-pages-card-wrapper"><div id="related-pages-card-panel"><div id="related-pages-card-panel-heading" uib-tooltip="Related Pages" tooltip-placement="bottom-right"><h3 id="related-pages-card-panel-title"><span class="glyphicon glyphicon-duplicate" aria-hidden="true"></span></h3></div><div id="related-pages-card-panel-body"><yv-related-pages-bubble-chart page-id="vm.page.pageId" period="vm.period"></yv-related-pages-bubble-chart></div></div></div>'),e.put("app/explore-page/yv-explore-page-signals-card/yvExplorePageSignalsCard.html",'<div id="explore-page-signals-card-wrapper"><div id="signals-card-panel"><div id="signals-card-panel-heading" uib-tooltip="Popularity Signals" tooltip-placement="bottom-right"><h3 id="signals-card-panel-title"><span class="glyphicon glyphicon-equalizer" aria-hidden="true"></span></h3></div><div id="signals-card-panel-body"><uib-tabset stacked="true"><uib-tab heading="Revisions" select="vm.onSelect(\'number-of-revisions\')"><div id="chart-number-of-revisions" style="width:100%;height:500px;"></div></uib-tab><uib-tab heading="Page Content Size" select="vm.onSelect(\'page-content-size\')"><div id="chart-page-content-size" style="width:100%;height:500px;"></div></uib-tab></uib-tabset></div></div></div>'),e.put("app/home/yv-home-imagetype/yvHomeImagetype.html",'<div id="home-imagetype-wrapper"><img id="imagetype" src="/assets/images/imagetype.png" alt="Yavi - Visualize Wikipedia"></div>'),e.put("app/home/yv-home-navbar/yvHomeNavbar.html",'<div id="home-navbar-wrapper"><nav class="navbar navbar-default"><div class="container-fluid"><div class="navbar-header"><button type="button" class="navbar-toggle" ng-click="vm.toggleNavbarMenu()" aria-expanded="false"><span class="sr-only">Toggle navigation</span> <span class="icon-bar"></span> <span class="icon-bar"></span> <span class="icon-bar"></span></button> <a class="navbar-brand" href="#"><img id="isotype" src="assets/images/isotype-small.png" alt="Yavi"></a></div><div class="collapse navbar-collapse" uib-collapse="vm.navbarMenuIsCollapsed"><ul class="nav navbar-nav navbar-right"><li><a href="#">About</a></li><li><a href="#">Contact</a></li><li class="dropdown" uib-dropdown=""><a href="#" class="dropdown-toggle" uib-dropdown-toggle="" role="button" aria-haspopup="true" aria-expanded="false">Wikipedia Source <span class="flag-icon flag-icon-{{vm.activeWikipediaSource.flagId}}"></span> <span class="caret"></span></a><ul class="dropdown-menu" uib-dropdown-menu="" role="menu"><li ng-repeat="wikipediaSource in vm.wikipediaSources"><a href="#" ng-click="vm.selectWikipediaSource(wikipediaSource.wikipediaId)"><span class="flag-icon flag-icon-{{wikipediaSource.flagId}}"></span> {{wikipediaSource.language}}</a></li></ul></li></ul></div></div></nav></div>'),e.put("app/home/yv-home-search-box/yvHomeSearchBox.html",'<div id="home-search-box-wrapper"><form class="form-horizontal"><div class="form-group"><div class="input-group"><input id="home-search-box-input" type="text" class="form-control" ng-model="vm.query.value" ng-change="vm.onChange()" ng-model-options="{debounce:vm.searchBoxInputDebounce}" placeholder="Search for a Wikipedia page..." autocomplete="off" autofocus=""><div class="input-group-btn"><button id="home-search-box-button" type="submit" class="btn btn-primary" ng-click="vm.onSubmit()"><span class="glyphicon glyphicon-search" aria-hidden="true"></span></button></div></div></div></form><div id="home-search-box-loading" ng-show="vm.searchOngoing"></div></div>'),e.put("app/home/yv-home-search-results/yvHomeSearchResults.html",'<div id="home-search-results-wrapper"><yv-home-search-results-card ng-repeat="pageId in vm.searchResults.value | limitTo: 11"></yv-home-search-results-card></div>'),e.put("app/page-not-found/yv-page-not-found-navbar/yvPageNotFoundNavbar.html",'<div id="page-not-found-navbar-wrapper"><nav class="navbar navbar-default"><div class="container-fluid"><div class="navbar-header"><a class="navbar-brand" href="#" ng-click="vm.stateToHome()"><img id="isotype" src="assets/images/isotype-small.png" alt="Yavi"></a></div></div></nav></div>'),e.put("app/explore-page/yv-explore-page-related-pages-card/yv-related-pages-bubble-chart/yvRelatedPagesBubbleChart.html",'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:ev="http://www.w3.org/2001/xml-events" width="0" height="0"><defs><pattern id="image1" x="0" y="0" patternunits="userSpaceOnUse" height="100" width="100"><image x="0" y="0" height="100" width="100" xlink:href="/assets/images/fallback-thumbnail.png"></image></pattern><pattern id="image2" x="0" y="0" patternunits="userSpaceOnUse" height="100" width="100"><image x="0" y="0" height="100" width="100" xlink:href="/assets/images/fallback-thumbnail.png"></image></pattern><pattern id="image3" x="0" y="0" patternunits="userSpaceOnUse" height="100" width="100"><image x="0" y="0" height="100" width="100" xlink:href="/assets/images/fallback-thumbnail.png"></image></pattern><pattern id="image4" x="0" y="0" patternunits="userSpaceOnUse" height="100" width="100"><image x="0" y="0" height="100" width="100" xlink:href="/assets/images/fallback-thumbnail.png"></image></pattern><pattern id="image5" x="0" y="0" patternunits="userSpaceOnUse" height="100" width="100"><image x="0" y="0" height="100" width="100" xlink:href="/assets/images/fallback-thumbnail.png"></image></pattern><pattern id="image6" x="0" y="0" patternunits="userSpaceOnUse" height="100" width="100"><image x="0" y="0" height="100" width="100" xlink:href="/assets/images/fallback-thumbnail.png"></image></pattern><pattern id="image7" x="0" y="0" patternunits="userSpaceOnUse" height="100" width="100"><image x="0" y="0" height="100" width="100" xlink:href="/assets/images/fallback-thumbnail.png"></image></pattern><pattern id="image8" x="0" y="0" patternunits="userSpaceOnUse" height="100" width="100"><image x="0" y="0" height="100" width="100" xlink:href="/assets/images/fallback-thumbnail.png"></image></pattern><pattern id="image9" x="0" y="0" patternunits="userSpaceOnUse" height="100" width="100"><image x="0" y="0" height="100" width="100" xlink:href="/assets/images/fallback-thumbnail.png"></image></pattern><pattern id="image10" x="0" y="0" patternunits="userSpaceOnUse" height="100" width="100"><image x="0" y="0" height="100" width="100" xlink:href="/assets/images/fallback-thumbnail.png"></image></pattern></defs></svg><div id="bubble-chart"></div>'),e.put("app/home/yv-home-search-results/yv-home-search-results-card/yvHomeSearchResultsCard.html",'<div class="home-search-results-card-wrapper"><div class="card" ng-click="vm.onCardClick()"><div class="card-body"><div class="card-body-left"><div class="page-thumbnail"></div></div><div class="card-body-right"><div class="card-text"><h4 class="page-title"></h4><hr><p class="page-description"></p></div></div></div><div class="card-footer"><ul class="page-category-list"></ul></div></div></div>')}]);
//# sourceMappingURL=../maps/scripts/app-7976c7f452.js.map
