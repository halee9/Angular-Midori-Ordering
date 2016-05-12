angular.module("hs.auth", ['ui.router', 'hs.services', 'hs.directives', 'ngCookies'])

.config(['$stateProvider', function($stateProvider) {
    $stateProvider
        .state('login', {
            url: '/login',
            templateUrl: 'auth/login.html',
            controller: 'LoginController',
            params: {
                code: null,
                message: null
            }
        })
        .state('signup', {
            url: '/signup',
            templateUrl: 'auth/signup.html',
            controller: 'SignupController'
        })
}])

.controller('LoginController', ['$scope', '$stateParams', '$state', '$cookies', 'SessionService', '$rootScope',
    function($scope, $stateParams, $state, $cookies, SessionService, $rootScope) {

    $scope.user = {};

    if ($stateParams.code != null) $scope.message = $stateParams.message;

    $scope.submit = function(){
        SessionService.login($scope.user)
        .then(function(res){
            var target = $rootScope.previousState || 'dash';
            if (target == 'signup') target = 'dash';
            $state.go(target);
        },
        function(data){
            $scope.message = data;
        });
    }

}])

.controller('SignupController', ['$scope', '$stateParams', '$state', 'User', 'SessionService',
    function($scope, $stateParams, $state, User, SessionService) {

    $scope.user = {};

    $scope.submit = function(){
        User.signup($scope.user)
        .success(function(user){
            if (!user._id) $scope.message = user.message;
            else console.log(user);
            $state.go("login");
        })
        .error(function(data){
            console.log(data);
        });
    }

}])


;
