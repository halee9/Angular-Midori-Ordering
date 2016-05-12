'use strict';

angular.module("hs.orders", [
    'ui.router',
    'btford.socket-io',
    'hs.services',
    'hs.cartService',
    'hs.directives',
    'hs.filters',
    'ui.bootstrap'
])

.config(['$stateProvider', function($stateProvider) {

    $stateProvider
        .state('orders', {
            url: '/orders',
            templateUrl: 'orders/orderList.html',
            controller: 'OrderListController',
            resolve: {
                orders: function(Orders){
                    return Orders.getAll();
                }
            }
        })
        .state('orders.order', {
            url: '/:id',
            templateUrl: 'orders/order.html',
            controller: 'OrderController',
            resolve: {
                order: function(Orders, $stateParams){
                    return Orders.getOne($stateParams.id);
                }
            }
        });
}])

.controller('OrderListController', ['$scope', '$location', '$log', '$cookieStore', '$timeout', 'orders', '$state', 'Types',
    function($scope, $location, $log, $cookieStore, $timeout, orders, $state, Types) {
    $scope.orders = orders.data;
}])

.controller('OrderController', ['$scope', '$location', '$log', '$cookieStore', '$timeout', 'Orders', 'order', '$state', 'Types',
    function($scope, $location, $log, $cookieStore, $timeout, Orders, order, $state, Types) {
    $scope.order = order.data;
}])
;

