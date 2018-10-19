// create the controller and inject Angular's $scope
dataViz.controller('homeController', function (
  $scope, $interval, $rootScope, $http, $log, $filter) {

  $scope.trends = []
  $scope.localities = []
  $scope.selectedLocality = ""
  $scope.selectedSeverity = ""

  

  $scope.remoteServiceUrl = "https://kudosg.carto.com/api/v2/sql?q="

  $scope.parseDate = d3.timeParse("%Y-%m-%d");
  $scope.parseYear = d3.timeParse("%Y");

  $scope.slider = {
    value: 1,
    options: {
      floor: 1,
      ceil: 30,
      onEnd: function (id, newValue, highValue, pointerType) {
        $log.log('change', id, newValue, pointerType)
        $scope.loadTrends();
      }
    },
  }

  
  $scope.selectLocality = function(){
    $log.log("selectLocality");
    $log.log($scope.selectedLocality);
    $scope.loadTrends()
  }

  $scope.selectSeverity = function(){
    $log.log("selectSeverity");
    $log.log($scope.selectedSeverity);
    $scope.loadTrends()
  }


  


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

  $scope.parseLocalities = (d) => {
    $log.log("parseLocalities");
    let rows = d.rows
    //$log.log(rows);
    rows.forEach(function (v) {
      v.label = v.localidad + " (" + v.total + ")"
      v.id = v.localidad
      v.value = v.total
    });
    //$log.log(rows);
    $scope.localities = rows
    return rows
  }

  $scope.parseSeverity = (d) => {
    $log.log("parseSeverity");
    let rows = d.rows
    //$log.log(rows);
    rows.forEach(function (v) {
      v.label = v.gravedadnombre + " (" + v.total + ")"
      v.id = v.gravedadnombre
      v.value = v.total
    });
    //$log.log(rows);
    $scope.severity = rows
    return rows
  }

  

  $scope.loadTrends = function () {
    var localityFilter = ( $scope.selectedLocality == "")? "" : "  and localidad = '"+$scope.selectedLocality+"' "
    var severityFilter = ( $scope.selectedSeverity == "")? "" : "  and gravedadnombre = '"+$scope.selectedSeverity+"' "


    let query = ` with events as (
      SELECT to_char(event_time, 'YYYY-MM-DD')  as event_day, cartodb_id as id
      FROM kudosg.accidentes_bta where 1 = 1 ${localityFilter}  ${severityFilter} 
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
    $scope.trends = d3.json($scope.remoteServiceUrl + query).then($scope.parseTrends);
  }

  $scope.loadLocalities = function () {
    let query = ` SELECT localidad, count(cartodb_id) as total FROM kudosg.accidentes_bta
    group by localidad order by count(cartodb_id) desc `
    $log.log(query);
    d3.json($scope.remoteServiceUrl + query)
      .then($scope.parseLocalities).then( (d) => $scope.$apply() )
  }

  $scope.loadLSeverity= function () {
    let query = ` SELECT gravedadnombre, count(cartodb_id) as total FROM kudosg.accidentes_bta
    group by gravedadnombre order by count(cartodb_id) desc `
    $log.log(query);
    d3.json($scope.remoteServiceUrl + query)
      .then($scope.parseSeverity).then( (d) => $scope.$apply() )
  }

  





  $scope.init = function () {
    $log.log("init - homeController");
    $scope.loadLocalities()
    $scope.loadTrends()
    $scope.loadLSeverity()

  }

  $scope.init();



});
