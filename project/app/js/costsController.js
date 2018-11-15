// create the controller and inject Angular's $scope
dataViz.controller('costsController', function (
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



  $scope.init = function () {
    $log.log("init - costsController");
    //$scope.loadNetworkData()
    //$scope.loadTree()
  }






  $scope.init();



});
