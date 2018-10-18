// create the controller and inject Angular's $scope
dataViz.controller('homeController', function (
  $scope, $interval, $rootScope, $http, $log, $filter) {

  $scope.remoteServiceUrl = "https://kudosg.carto.com/api/v2/sql?q="

  $scope.slider = {
    value: 1,
    options: {
      floor: 1,
      ceil: 30,
      onEnd: function(id, newValue, highValue, pointerType) {
        $log.log('change', id, newValue, pointerType)
        $scope.loadTrends();
      }
    },
  }


  $scope.parseDate = d3.timeParse("%Y-%m-%d");
  $scope.parseYear = d3.timeParse("%Y");


    /*
  $scope.loadData = function () {
    $log.log("loadData - homeController");

    var dataUrl = "data/defunciones_year.TSV";
    $scope.datasetYear = d3.tsv(dataUrl)
      .then($scope.parseData)
      .then((a) => {
        $scope.maxScaleRef = d3.max(a, d => d["count"]);
        console.log($scope.maxScaleRef);
        return a;
      });

    var dataUrl = "data/defunciones_year_sex.TSV";
    $scope.datasetYearSex = d3.tsv(dataUrl)
      .then($scope.parseData)
      .then($scope.splitBySex);
  }
  */


  $scope.parseTrends = (d) => {
    $log.log("parseTrends");
    let rows = d.rows
    //$log.log(rows);
    rows.forEach(function (v) {
      v.date = $scope.parseDate(v.event_day)
      v.label = v.event_day
      v.count = v.total
      v.count = v.trend
    });
    //$log.log(rows);
    return rows
  }

  $scope.loadTrends = function () {
    let query = ` with events as (
      SELECT to_char(event_time, 'YYYY-MM-DD')  as event_day, cartodb_id as id
      FROM kudosg.accidentes_bta
        )
      , events_agg as ( 
       select event_day, count(id) as total 
       from events 
      group by event_day
      order by event_day
      )
      select  event_day, total, avg(total) over 
        (order by event_day rows between ${$scope.slider.value} preceding and 0 following )::float as trend
      from events_agg
      order by 1 asc `

    $log.log(query);
    $scope.datasetTrends  = d3.json($scope.remoteServiceUrl + query).then($scope.parseTrends);
  }

  $scope.init = function () {
    $log.log("init - homeController");
    $scope.loadTrends();
  }

  $scope.init();



});
