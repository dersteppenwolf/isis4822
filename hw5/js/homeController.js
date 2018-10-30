// create the controller and inject Angular's $scope
dataViz.controller('homeController', function (
  $scope, $interval, $rootScope, $http, $log, $filter, ngProgressFactory) {

  $scope.progressbar = ngProgressFactory.createInstance();
  $scope.progressbar.setHeight("5px");

  $scope.datasets = []
  $scope.selectedNode = {}

  var margin = { top: 20, right: 40, bottom: 10, left: 20 }
  $scope.width = 800

  $scope.remoteServiceUrl = "https://kudosg.carto.com/api/v2/sql?q="


  $scope.parseDatasets = (d) => {
    $scope.progressbar.complete();
    $log.log("parseDatasets");
    $scope.datasets = d.rows
    $log.log($scope.datasets);
    $scope.$apply();
  }




  $scope.loadDatasets = function (d) {
    $scope.selectedNode = d

    var filterColumn = ""
    if (d.id.substring(0, 1) == 'o') {
      filterColumn = "organization_code"
    } else {
      filterColumn = "category_code"
    }

    let query = ` select resource_id as id, permalink as link, INITCAP(resource_name) as label, resource_createdat as creationDate
      from datos_gov where ${filterColumn} = '${d.id}' 
      order by resource_name  asc `

   // $log.log(query);

    $scope.progressbar.start();
    d3.json($scope.remoteServiceUrl + query).then($scope.parseDatasets);
  }


  $scope.init = function () {
    $log.log("init - homeController");
    $scope.loadNetworkData()
    $scope.loadTree()
  }

  $scope.loadTree = function (){
    d3.json("js/tree-layout2.vg.json").then((data) => {
      vegaEmbed("#treevis", data, { theme: 'white', actions: false });
    });
    
  }

  window.onresize = function () {
    //$log.log("onresize");
    $scope.width = window.innerWidth - margin.left - margin.right;
    //$log.log($scope.width);
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

    node.attr("class", "node")
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        //.on("end", dragended)
      )
      .append("circle")
      .attr("r", 7)
      .attr("fill", function (d) {
        return (d.group === 'c') ? '#66c2a5' : "#fc8d62";
      })
      .on("mouseover", mouseOver(.2))
      .on("mouseout", mouseOut)
      //.on("mousemove", function (d) { mousemove(d); })
      .on("click", handleClick)




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
      // add some collision detection so they don't overlap
      .force("collide", d3.forceCollide().radius(6))
      .force("center", d3.forceCenter(width / 2, height / 2));

    simulation
      .nodes(nodes)
      .on("tick", ticked);

    simulation.force("link")
      .links(links);



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

    function handleClick(d) {
      console.log(d)
      $scope.loadDatasets(d)
    }

    // fade nodes on hover
    function mouseOver(opacity) {
      return function (d) {
        // check all other nodes to see if they're connected
        // to this one. if so, keep the opacity at 1, otherwise
        // fade
        var dTip = false;

        node.style("stroke-opacity", function (o) {
          thisOpacity = isConnected(d, o) ? 1 : opacity;
          return thisOpacity;
        });
        node.style("fill-opacity", function (o) {
          var connected = isConnected(d, o)
          if (connected && d != o) {
            if (!dTip) {
              var div = d3.select("#nDiv").append("div")
                .attr("class", "tooltip")
                .style("opacity", 1)
                .style("left", (d.x + 10) + "px")
                .style("top", (d.y - 10) + "px")
                .html(d.label);
              dTip = true
            }

            var div = d3.select("#nDiv").append("div")
              .attr("class", "tooltip")
              .style("opacity", 1)
              .style("left", (o.x + 10) + "px")
              .style("top", (o.y - 10) + "px")
              .html(o.label);
          }
          thisOpacity = connected ? 1 : opacity;
          return thisOpacity;
        });

        link.attr("class", function (o) {
          return o.source === d || o.target === d ? "linkOver" : "link";
        });
      };
    }

    function mouseOut() {
      node.style("stroke-opacity", 0.6);
      node.style("fill-opacity", 1);
      // link.style("stroke-opacity", 1);
      // link.style("stroke", "#ddd");
      link.attr("class", "link");
      d3.select("body").selectAll('div.tooltip').remove();
    }

    function mousemove(d) {
      d3.select("body").selectAll('div.tooltip').style("opacity", 1);
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
