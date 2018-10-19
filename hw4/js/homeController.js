// create the controller and inject Angular's $scope
dataViz.controller('homeController', function (
  $scope, $interval, $rootScope, $http, $log, $filter) {

  $scope.trends = []
  $scope.localities = []
  $scope.selectedLocality = ""
  $scope.selectedSeverity = ""
  $scope.heatmapOver  = {}
  var margin = { top: 20, right: 40, bottom: 10, left: 20 }
  $scope.width = 800



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


  $scope.selectLocality = function () {
    $log.log("selectLocality");
    $log.log($scope.selectedLocality);
    $scope.loadTrends()
  }

  $scope.selectSeverity = function () {
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

  $scope.parseHeatmapData = (d) => {
    $log.log("parseHeatmapData");
    let rows = d.rows
    //$log.log(rows);
    rows.forEach(function (v) {
      v.end = v.start + 1
    });
    
    $scope.heatmapData = rows
    $log.log($scope.heatmapData);
    return rows
  }


  



  $scope.loadTrends = function () {
    var localityFilter = ($scope.selectedLocality == "") ? "" : "  and localidad = '" + $scope.selectedLocality + "' "
    var severityFilter = ($scope.selectedSeverity == "") ? "" : "  and gravedadnombre = '" + $scope.selectedSeverity + "' "


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

    //$log.log(query);
    $scope.trends = d3.json($scope.remoteServiceUrl + query).then($scope.parseTrends);
  }

  $scope.loadLocalities = function () {
    let query = ` SELECT localidad, count(cartodb_id) as total FROM kudosg.accidentes_bta
    group by localidad order by count(cartodb_id) desc `
    //$log.log(query);
    d3.json($scope.remoteServiceUrl + query)
      .then($scope.parseLocalities)
  }

  $scope.loadLSeverity = function () {
    let query = ` SELECT gravedadnombre, count(cartodb_id) as total FROM kudosg.accidentes_bta
    group by gravedadnombre order by count(cartodb_id) desc `
    //$log.log(query);
    d3.json($scope.remoteServiceUrl + query)
      .then($scope.parseSeverity)
  }

  $scope.loadHeatmapData = function (){

    let query = ` with data as (
          SELECT cartodb_id, 
          to_char(event_time, 'YYYY-MM-DD') as event_date  , event_day_name, 
          lower(event_month_name) as block_id,
          date_part('day', event_time) as start
          FROM kudosg.accidentes_bta  )
      select block_id, event_date, count(cartodb_id) as value , start, event_day_name
      from data  group by block_id, event_date, event_day_name, start order by event_date  `
    $log.log(query);
    d3.json($scope.remoteServiceUrl + query)
      .then($scope.parseHeatmapData)
      .then($scope.drawHeatmap)

  }







  $scope.init = function () {
    $log.log("init - homeController");
    $scope.loadLocalities()
    $scope.loadTrends()
    $scope.loadLSeverity()
    $scope.loadHeatmapData() 
    //$scope.drawRadial()




  }

  window.onresize = function () {
    $log.log("onresize");
    $scope.width = window.innerWidth - margin.left - margin.right;
    $log.log($scope.width);
    return scope.$apply();
  };


  $scope.drawHeatmap = function () {

    var width = $scope.width


    var circosHeatmap = new Circos({
      container: '#heatmapChart',
      width: width,
      height: width
    });

    var months = [
      { "len": 31, "color": "#8dd3c7", "label": "January", "id": "january" },
      { "len": 28, "color": "#ffffb3", "label": "February", "id": "february" },
      { "len": 31, "color": "#bebada", "label": "March", "id": "march" },
      { "len": 30, "color": "#fb8072", "label": "April", "id": "april" },
      { "len": 31, "color": "#80b1d3", "label": "May", "id": "may" },
      { "len": 30, "color": "#fdb462", "label": "June", "id": "june" },
      { "len": 31, "color": "#b3de69", "label": "July", "id": "july" },
      { "len": 31, "color": "#fccde5", "label": "August", "id": "august" },
      { "len": 30, "color": "#d9d9d9", "label": "September", "id": "september" },
      { "len": 31, "color": "#bc80bd", "label": "October", "id": "october" },
      { "len": 30, "color": "#ccebc5", "label": "November", "id": "november" },
      { "len": 31, "color": "#ffed6f", "label": "December", "id": "december" }
    ]



    var heatmapData = $scope.heatmapData 
    
    

    circosHeatmap
      .layout(
        months,
        {
          innerRadius: width / 2 - 80,
          outerRadius: width / 2 - 30,
          ticks: { display: false },
          labels: {
            position: 'center',
            display: true,
            size: 14,
            color: '#000',
            radialOffset: 25
          }
        }
      )
      .heatmap('electricalConsumption', heatmapData, {
        innerRadius: 0.6,
        outerRadius: 0.98,
        logScale: false,
        color: 'YlOrRd',
        events: {
          'mouseover.demo': function (d, i, nodes, event) {
            console.log(d, i, nodes, event)
            $scope.heatmapOver = d;
            $log.log($scope.heatmapOver );
            $scope.$apply()
          }
        }, tooltipContent: function (d) {
          return d.event_day_name  +"  " +  d.event_date +" : " + d.value 
        }
      })
      .render()


  }




  $scope.init();



});
