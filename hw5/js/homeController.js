// create the controller and inject Angular's $scope
dataViz.controller('homeController', function (
  $scope, $interval, $rootScope, $http, $log, $filter) {

  $scope.trends = []
  $scope.localities = []
  $scope.days = []
  $scope.selectedLocality = ""
  $scope.selectedSeverity = ""
  $scope.selectedDay = ""


  $scope.heatmapOver = {}
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

  $scope.selectDay = function () {
    $log.log("selectDay");
    $log.log($scope.selectedDay);
    $scope.loadTrends()

  }








  $scope.parseTrends = (d) => {
    $log.log("parseTrends");
    let rows = d.rows
    //$log.log(rows);
    rows.forEach(function (v) {
      v.date = $scope.parseDate(v.event_day)
      v.label = v.event_day
      //v.count = v.total
      v.count = v.trend
      v.radius = v.totalmuertos
    });
    $log.log(rows);
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

  $scope.parseDays = (d) => {
    $log.log("parseDays");
    let rows = d.rows
    //$log.log(rows);
    rows.forEach(function (v) {
      v.label = v.event_day_name + " (" + v.total + ")"
      v.id = v.event_day_name
      v.value = v.total
    });
    //$log.log(rows);
    $scope.days = rows
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
    //$log.log($scope.heatmapData);
    return rows
  }






  $scope.loadTrends = function () {
    var localityFilter = ($scope.selectedLocality == "") ? "" : "  and localidad = '" + $scope.selectedLocality + "' "
    var severityFilter = ($scope.selectedSeverity == "") ? "" : "  and gravedadnombre = '" + $scope.selectedSeverity + "' "
    var dayFilter = ($scope.selectedDay == "") ? "" : "  and event_day_name = '" + $scope.selectedDay + "' "



    let query = ` with events as (
      SELECT to_char(event_time, 'YYYY-MM-DD')  as event_day, cartodb_id as id, totalmuertos
      FROM kudosg.accidentes_bta where 1 = 1 ${localityFilter}  ${severityFilter} ${dayFilter} 
        )
      , events_agg as ( 
       select event_day, count(id) as total , sum(totalmuertos) as totalmuertos
       from events 
      group by event_day
      order by event_day
      )
      select  event_day, total, totalmuertos, avg(total) over 
        (order by event_day rows between ${$scope.slider.value} preceding and 0 following )::float as trend
      from events_agg
      order by 1 asc `

    //$log.log(query);
    $scope.trends = d3.json($scope.remoteServiceUrl + query).then($scope.parseTrends);
  }





  $scope.init = function () {
    $log.log("init - homeController");
    /*
    $scope.loadLocalities()
    $scope.loadTrends()
    $scope.loadLSeverity()
    $scope.loadLDays()
    */

    $scope.loadNetworkData()
  }

  window.onresize = function () {
    $log.log("onresize");
    $scope.width = window.innerWidth - margin.left - margin.right;
    $log.log($scope.width);
    return $scope.$apply();
  };



  $scope.drawNetwork = function (graph) {
    $log.log("drawNetwork");
    let links = graph.links
    let nodes = graph.nodes

    var svg = d3.select("#svgNetwork"),
      width = +svg.attr("width"),
      height = +svg.attr("height"),
      node,
      link, simulation;

    console.log(svg)

    var strengthScale = d3.scaleLinear()
      .domain([0, 1])
      .range([0.8, 1]);


    link = svg.selectAll(".link")
      .data(links)
      .enter()
      .append("line")
      .attr("class", "link")


    node = svg.selectAll(".node")
      .data(nodes)
      .enter()
      .append("g")
      .attr("class", "node")
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        //.on("end", dragended)
      )
      .append("circle")
      .attr("r", 5)
      .attr("fill", function (d) {
        return (d.group === 'c') ? '#66c2a5' : "#fc8d62";
      })
      .on("mouseover", mouseOver(.2))
      .on("mouseout", mouseOut)

     

    // hover text for the node
    node.append("title")
      .text(function (d) {
        console.log(d.label)
        return d.label;
      });

      /*
 node.append("text")
      .attr("dy", -3)
      .text(function (d) {return d.label;});

      // add a label to each node
    node.append("text")
        .attr("dx", 12)
        .attr("dy", ".35em")
        .text(function(d) {
            return d.label;
        })
        .style("stroke", "black")
        .style("stroke-width", 0.5)
        .style("fill", function(d) {
            return "#ff44ff"
        });

        
      */


    



    simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(function (d) { return d.id; })
          // .distance(120)
          .strength(customStrength)
        )
        .force("charge", d3.forceManyBody()
          .strength(-50)
          .distanceMin(1)
          .distanceMax(700)
        )
        .force("center", d3.forceCenter(width / 2, height / 2));

    simulation
      .nodes(nodes)
      .on("tick", ticked);

    simulation.force("link")
      .links(links);

    // force
    // https://bl.ocks.org/mbostock/aba1a8d1a484f5c5f294eebd353842da
    // http://bl.ocks.org/sathomas/774d02a21dc1c714def8 


    // cluster
    // https://bl.ocks.org/ericsoco/d2d49d95d2f75552ac64f0125440b35e

    // https://bl.ocks.org/martinjc/7aa53c7bf3e411238ac8aef280bd6581

    // build a dictionary of nodes that are linked
    var linkedByIndex = {};
    links.forEach(function (d) {
      linkedByIndex[d.source.index + "," + d.target.index] = 1;
    });

    function customStrength(d) {
      //console.log(strengthScale(d.percentaje.toFixed(4)))
      // return 1
      return strengthScale(d.percentaje.toFixed(4))
    }

    // check the dictionary to see if nodes are linked
    function isConnected(a, b) {
      return linkedByIndex[a.index + "," + b.index] || linkedByIndex[b.index + "," + a.index] || a.index == b.index;
    }

    // fade nodes on hover
    function mouseOver(opacity) {
      return function (d) {
        // check all other nodes to see if they're connected
        // to this one. if so, keep the opacity at 1, otherwise
        // fade
        node.style("stroke-opacity", function (o) {
          thisOpacity = isConnected(d, o) ? 1 : opacity;
          return thisOpacity;
        });
        node.style("fill-opacity", function (o) {
          thisOpacity = isConnected(d, o) ? 1 : opacity;
          return thisOpacity;
        });
        // also style link accordingly
        link.style("stroke-opacity", function (o) {
          return o.source === d || o.target === d ? 1 : opacity;
        });
        link.style("stroke", function (o) {
          return o.source === d || o.target === d ? o.source.colour : "#ddd";
        });
      };
    }

    function mouseOut() {
      node.style("stroke-opacity", 1);
      node.style("fill-opacity", 1);
      link.style("stroke-opacity", 1);
      link.style("stroke", "#ddd");
    }

    function dragstarted(d) {
      if (!d3.event.active) simulation.alphaTarget(0.3).restart()
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }


    function ticked() {
      link
        .attr("x1", function (d) { return d.source.x; })
        .attr("y1", function (d) { return d.source.y; })
        .attr("x2", function (d) { return d.target.x; })
        .attr("y2", function (d) { return d.target.y; });

      node
        .attr("transform", function (d) { return "translate(" + d.x + ", " + d.y + ")"; });


    }
  }


  $scope.loadNetworkData = function () {
    $log.log("loadNetworkData");

    d3.json("js/data.json").then($scope.drawNetwork)



  }






  $scope.init();



});