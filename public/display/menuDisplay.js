angular.module("hs.display", ['ui.router', 'hs.services', 'btford.socket-io', 'ui.bootstrap'])

.config(['$stateProvider', function($stateProvider) {
    $stateProvider
        .state('menu', {
            url: '/menu',
            controller: 'MenuDisplayController',
            templateUrl: 'menuDisplay.html',
            resolve: {
                menus: function(Items){
                    //return Items.getAll();
                }
            }
        })
        .state('menu2', {
            url: '/menu2',
            controller: 'MenuDisplay2Controller',
            templateUrl: 'menuDisplay2.html'
        })
}])

.controller('MenuDisplayController', ['$scope', 'menus', '$state', 'MenuDisp',
    function($scope, menus, $state, MenuDisp) {
        MenuDisp.getMenu().then(function(d) {
            $scope.menus = d.data;
            console.log($scope.menus);
        });
        $scope.noWrapSlides = false;
        MenuDisp.getMenuPics().then(function(d) {
            $scope.slides = d.data;
            console.log($scope.slides);
        });


}])

.controller('MenuDisplay2Controller', ['$scope', '$state', 'MenuDisp',
    function($scope, $state, MenuDisp) {
        MenuDisp.getMenu().then(function(d) {
            var menus = d.data;
            var tops = [];
            menus.forEach(function(colume){
                colume.colume.forEach(function(group){
                    group.menus.forEach(function(menu){
                        if (menu.ranking > 0 && menu.ranking < 7) tops.push(menu);
                    })
                })
            })
            $scope.menus = tops;
            console.log(tops);
        });
        MenuDisp.getMenuSpecials().then(function(d) {
            $scope.specials = d.data;
        });

}])

// Setting up a service to house our json file so that it can be called by the controllers
.factory('MenuDisp', ['$http', function($http){
    var promise;
    var jsondata = {
        getMenu: function() {
            if ( !promise ) {
                var promise =  $http.get('menuboard.json').success(function(response) {
                    return response.data;
                });
                return promise;
            }
        },
        getMenuPics: function() {
            if ( !promise ) {
                var promise =  $http.get('menu_pic.json').success(function(response) {
                    return response.data;
                });
                return promise;
            }
        },
        getMenuSpecials: function() {
            if ( !promise ) {
                var promise =  $http.get('menu_special.json').success(function(response) {
                    return response.data;
                });
                return promise;
            }
        }
    };
    return jsondata;
}])

;
