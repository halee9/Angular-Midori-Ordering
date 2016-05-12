'use strict';

angular.module('display', [
    'ui.router',
    'btford.socket-io',
    'hs.services',
    'hs.directives',
    'hs.filters',
    'hs.display',
    'ui.bootstrap'
])

.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
}])
;
