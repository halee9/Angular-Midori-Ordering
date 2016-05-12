'use strict';

angular.module('register', [
    'ui.router',
    'btford.socket-io',
    'hs.services',
    'hs.directives',
    'hs.filters',
    'hs.cart',
    'hs.orders',
    'ui.bootstrap'
])

.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: 'layout.html',
            controller: 'LayoutController'
        })
}])

.controller('LayoutController', ['$scope', '$location', '$log', '$cookieStore',
    '$timeout', 'Menu', 'Cart', 'Orders', '$state', 'Types', '$stateParams',
    function($scope, $location, $log, $cookieStore,
        $timeout, Menu, Cart, Orders, $state, Types, $stateParams) {
        console.log("Here layout");

}])
;
