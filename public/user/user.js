angular.module("hs.user", ['ui.router', 'hs.services', 'hs.directives', 'ngCookies'])

.config(['$stateProvider', function($stateProvider) {
    $stateProvider
        .state('user', {
            abstract: true,
            url: '/user',
            template: '<div ui-view/>',
            controller: 'UserController'
        })
        .state('user.list', {
            url: '/list',
            templateUrl: 'user/userList.html',
            controller: 'UserListController',
            resolve: {
                users: function(User){
                    return User.getAll();
                }
            }
        })
}])

.controller('UserController', ['$scope', '$stateParams', '$state',
    function($scope, $stateParams, $state) {

}])

.controller('UserListController', ['$scope', 'users', '$stateParams', '$state',
    function($scope, users, $stateParams, $state) {
    console.log(users.data);
    $scope.users = users.data;

}])


;
