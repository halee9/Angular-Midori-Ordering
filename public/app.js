'use strict';

angular.module('dash', [
    'ui.router',
    'btford.socket-io',
    'hs.services',
    'hs.directives',
    'hs.filters',
    'hs.dash',
    'hs.items',
    'hs.user',
    'hs.auth',
    'hs.home',
    'hs.staff'
])

.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
}])

.controller('MainController', ['$scope', '$rootScope', '$state',
    function($scope, $rootScope, SessionService, $state) {
    //$scope.today = moment().format('YYYYMMDD');

    $rootScope.previousState;
    $rootScope.previousParams;
    $rootScope.$on('$stateChangeSuccess', function (ev, to, toParams, from, fromParams) {
        $rootScope.previousState = from.name;
        $rootScope.previousParams = fromParams;
    });


}]);

