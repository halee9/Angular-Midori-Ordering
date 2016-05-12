
angular.module("hs.items", ['ui.router', 'hs.services', 'hs.directives', 'ui.bootstrap', 'ngFileUpload'])

.config(['$stateProvider', function($stateProvider) {
    $stateProvider
        .state('item', {
            abstract: true,
            url: '/item',
            template: '<div ui-view/>',
            controller: 'ItemController',
            resolve: {
                items: function(Items){
                    return Items.getAll();
                },
                categories: function(Categories){
                    return Categories.getAll();
                },
                modifiers: function(Modifiers){
                    return Modifiers.getAll();
                }
            }
        })
        .state('item.list', {
            url: '/list',
            templateUrl: 'items/itemList.html',
            controller: 'ItemListController'
        })
        .state('item.new', {
            url: '/new',
            templateUrl: 'items/itemForm.html',
            controller: 'ItemFormController',
            resolve: {
                item: function(){
                    return {};
                }
            }
        })
        .state('item.update', {
            url: '/update/:id',
            templateUrl: 'items/itemForm.html',
            controller: 'ItemFormController',
            resolve: {
                item: function(Items, $stateParams){
                    return Items.getUpdate($stateParams.id);
                }
            }

        })
        .state('item.photos', {
            url: '/photos',
            templateUrl: 'items/itemPhotos.html',
            controller: 'ItemPhotosController',
            resolve: {
                photos: function(Items){
                    return Items.getPhotos();
                }
            }
        })
        .state('item.view', {
            url: '/:id',
            templateUrl: 'items/itemView.html',
            controller: 'ItemViewController',
            resolve: {
                item: function(Items, $stateParams){
                    return Items.get($stateParams.id);
                }
            }
        })
}])

.controller('ItemController', ['$scope', 'items', 'categories', 'modifiers', '$stateParams', '$state',
    function($scope, items, categories, modifiers, $stateParams, $state) {

    $scope.items = items.data;
    $scope.categories = categories.data;
    $scope.modifiers = modifiers.data;

    $scope.selectedItem = null;

    $scope.select = function(item){
        $scope.selectedItem = angular.copy(item);
        console.log($scope.selectedItem);
   }

}])

.controller('ItemListController', ['$scope', function($scope) {

    console.log($scope.items);

}])

.controller('ItemFormController', ['$scope', 'Items', 'item', '$stateParams', '$state', 'MenuStyle',
    function($scope, Items, item, $stateParams, $state, MenuStyle) {

    $scope.item = ($scope.selectedItem) ? $scope.selectedItem : item.data;
    $scope.cookingMethods = MenuStyle.cookingMethods;
    $scope.portions = MenuStyle.portions;
    $scope.ingredients = MenuStyle.ingredients;

    $scope.title = "New Item";
    $scope.submitText = "Create Item";
    if ($stateParams.id) {
        $scope.title = $scope.item.name;
        $scope.submitText = "Update Item";
    }

    $scope.submit = function(isValid){
        if (isValid) {
            if ($stateParams.id) {
                Items.update($stateParams.id, $scope.item).success(function(){
                    $state.go("item.view", {id: $stateParams.id});
                });
            }
            else {
                Items.post($scope.item).success(function(id){
                    $state.go("item.view", {id: id});
                });
            }
        }
    };

    $scope.remove = false;
    $scope.delete = function(){
        if ($scope.remove) {
            Items.delete($scope.item._id).success(function(){
                $state.go("item.list");
                //$scope.remove = false;
            });
        }
        else $scope.remove = true;
    };

}])

.controller('ItemViewController', ['$scope', 'item', function($scope, item) {
    $scope.item = item.data;
}])

.controller('ItemPhotosController', ['$scope', 'photos', '$stateParams', '$state', '$rootScope',
    function($scope, photos, $stateParams, $state, $rootScope) {

    $scope.photos = photos.data;
    console.log($scope.photos);

    $scope.select = function(photo){
        $scope.selectedItem.image = photo;
        $state.go($rootScope.previousState, {id: $rootScope.previousParams.id});
    }
}])

;


