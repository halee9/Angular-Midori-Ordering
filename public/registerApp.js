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
    //$urlRouterProvider.otherwise('/cart/menu');
}])
;
