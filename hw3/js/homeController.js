// create the controller and inject Angular's $scope
dataViz.controller('homeController', function(
  $scope,$interval, $rootScope, $http, $log, $filter) {
  

  $scope.parseData = (d) => { 
    //$log.log("parseData");
    d.forEach(function(v) {
      v.anio = $scope.parseYear(v.anio)
      v.count = +v.count
      //$log.log(v);
    }); 
    //$log.log(d);
    return d
  }

  $scope.splitBySex = (d) => {
    $scope.datasetYearSexF =  d.filter(function(a) {
      return a.sexo == "Femenino";
    });

    $scope.datasetYearSexM =  d.filter(function(a) {
      return a.sexo == "Masculino";
    });
  }

  $scope.splitByAge = (d) => {
    //$log.log(d)

    $scope.edades = {}

    for (var i in d) {
      var o = d[i];
      if(!o.categoria_edad){
        continue
      }
      
      if(!$scope.edades[o.categoria_edad]){
        $scope.edades[o.categoria_edad] = []
      }
      $scope.edades[o.categoria_edad].push(o);
    }

    //$log.log($scope.edades)
  }

  
  $scope.splitByCause = (d) => {
    //$log.log(d)

    $scope.causas = {}

    for (var i in d) {
      var o = d[i];
      if(!o.dec10){
        continue
      }
      
      if(!$scope.causas[o.dec10]){
        $scope.causas[o.dec10] = []
      }
      $scope.causas[o.dec10].push(o);
    }

    //$log.log($scope.causas)
  }

  

  $scope.parseDate = d3.timeParse("%Y-%m-%d");
  $scope.parseYear= d3.timeParse("%Y");


  $scope.loadData = function(){
    $log.log("loadData - homeController");
    
    var dataUrl = "data/defunciones_year.TSV";
    $scope.datasetYear = d3.tsv(dataUrl)
      .then($scope.parseData)
      .then( (a) => {
        $scope.maxScaleRef =  d3.max(a, d => d["count"]);
        console.log($scope.maxScaleRef );
        return a;
      });

    var dataUrl = "data/defunciones_year_sex.TSV";
    $scope.datasetYearSex = d3.tsv(dataUrl)
      .then($scope.parseData)
      .then($scope.splitBySex);

    var dataUrl = "data/defunciones_year_age.TSV";
    $scope.datasetYearAge= d3.tsv(dataUrl)
      .then($scope.parseData)
      .then($scope.splitByAge);

    var dataUrl = "data/defunciones_year_causa.TSV";
    $scope.datasetYearCause= d3.tsv(dataUrl)
      .then($scope.parseData)
      .then($scope.splitByCause);
   

  }

  $scope.init = function() {
    $log.log("init - homeController");
    $scope.loadData(); 
  }

  $scope.init();



});
