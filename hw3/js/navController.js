// create the controller and inject Angular's $scope
dataViz.controller('navController', function($scope, $rootScope, $http, $log, $filter) {
   
    $scope.init = function() {
      $log.log("init - navController");

    };

    $scope.init();


});
