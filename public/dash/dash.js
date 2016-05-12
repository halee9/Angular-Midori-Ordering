
angular.module("hs.dash", ['ui.router', 'hs.services', 'btford.socket-io'])

.config(['$stateProvider', function($stateProvider) {
    $stateProvider
        .state('dash', {
            abstract: true,
            url: '/dash',
            template: '<div ui-view/>',
            controller: 'DashController'
        })
        .state('dash.daily', {
            url: '/:date',
            templateUrl: 'dash/dash.html',
            controller: 'DashDailyController',
            resolve: {
                yyyymmdd: function($stateParams){
                    return (moment($stateParams.date, "YYYYMMDD").isValid()) ? $stateParams.date : moment().format('YYYYMMDD');
                }
            }
        })
}])

.controller('DashController', ['$scope', '$stateParams', '$state',
    function($scope, $stateParams, $state) {

}])

.controller('DashDailyController', ['$scope', 'Orders', 'Socket', '$stateParams', '$state', 'yyyymmdd',
    function($scope, Orders, Socket, $stateParams, $state, yyyymmdd) {

    console.log(yyyymmdd);
    var date = moment(yyyymmdd, "YYYYMMDD");
    $scope.date = date.format("YYYY/MM/DD, dddd");

    //getSales(yyyymmdd);
    getSalesByHours(yyyymmdd);
    getSalesByItems(yyyymmdd);
    //getOrders(yyyymmdd);

    Socket.on("order_changed", function(){
        //getSales(yyyymmdd);
        getSalesByHours(yyyymmdd);
        getSalesByItems(yyyymmdd);
        //getOrders(yyyymmdd);
    });

    function getSales(yyyymmdd) {
        Orders.getSales(yyyymmdd)
        .success(function(data){
            $scope.sales = data;
        });
    }

    function getSalesByHours(yyyymmdd) {
        Orders.getSalesByHours(yyyymmdd)
        .then(function(data){
            console.log(data);
            $scope.hours = data.data;
        },function(error){
            console.log(error);
        });
    }

    function getSalesByItems(yyyymmdd) {
        Orders.getSalesByItems(yyyymmdd)
        .success(function(data){
            $scope.salesByItems = data;
        });
    }

    function getOrders(yyyymmdd){
        Orders.getAll(yyyymmdd)
        .success(function(data){
            $scope.orders = data;
        });
    }

    $scope.yesterday = function(){
        var d = date.subtract(1, 'Days').format('YYYYMMDD');
        $state.go("dash.daily", {date:d});
    }
    $scope.tomorrow = function(){
        var d = date.add(1, 'Days').format('YYYYMMDD');
        $state.go("dash.daily", {date:d});
    }
    $scope.today = function(){
        var d = date.format('YYYYMMDD');
        $state.go("dash.daily", {date:d});
    }
}]);


