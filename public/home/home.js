
angular.module("hs.home", ['ui.router', 'hs.services'])

.config(['$stateProvider', function($stateProvider) {
    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: 'home/home.html',
            controller: 'HomeController'
        })
}])

.controller('HomeController', ['$scope', '$state', 'SessionService', function($scope, $state, SessionService) {
    $scope.username = SessionService.isLogin();
    var name = $scope.username || "Customer";
    $scope.message = "Welcome, " + name + "!";
    //$scope.today = moment().format('YYYYMMDD');

    $scope.login = function(){
        $state.go("login");
    };
    $scope.logout = function(){
        SessionService.logout();
        $state.go($state.current, {}, {reload: true});
    };
}]);


