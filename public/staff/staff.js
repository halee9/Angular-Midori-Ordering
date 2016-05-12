angular.module("hs.staff", ['ui.router', 'hs.services', 'hs.directives', 'ngCookies'])

.config(['$stateProvider', function($stateProvider) {
    $stateProvider
        .state('staff', {
            abstract: true,
            url: '/staff',
            template: '<div ui-view/>',
            controller: 'StaffController'
        })
        .state('staff.list', {
            url: '/list',
            templateUrl: 'staff/staffList.html',
            controller: 'StaffListController',
            resolve: {
                staffs: function(Staff){
                    return Staff.getAll();
                }
            }
        })
        .state('staff.view', {
            url: '/:id',
            templateUrl: 'staff/staffView.html',
            controller: 'StaffViewController',
            resolve: {
                staff: function(Staff, $stateParams){
                    return Staff.getClocks($stateParams.id);
                }
            }
        })
        .state('staff.update', {
            url: '/:id/update',
            templateUrl: 'staff/staffForm.html',
            controller: 'StaffFormController',
            resolve: {
                staff: function(Staff, $stateParams){
                    return Staff.get($stateParams.id);
                }
            }
        })
}])

.controller('StaffController', ['$scope', '$stateParams', '$state',
    function($scope, $stateParams, $state) {

}])

.controller('StaffListController', ['$scope', 'staffs', '$stateParams', '$state',
    function($scope, staffs, $stateParams, $state) {
    //console.log(staffs.data);
    $scope.staffs = staffs.data;

}])

.controller('StaffViewController', ['$scope', 'staff', '$stateParams', '$state',
    function($scope, staff, $stateParams, $state) {
    //console.log(staff.data);
    $scope.staff = staff.data;

}])

.controller('StaffFormController', ['$scope', 'staff', 'Staff', '$stateParams', '$state',
    function($scope, staff, Staff, $stateParams, $state) {
    $scope.submitText = "Save";
    $scope.staff = staff.data;
    //console.log(staff.data);

    $scope.submitForm = function(isValid){
        if (isValid) {
            Staff.update($stateParams.id, $scope.staff).success(function(){
                $state.go("staff.list");
                //$state.go("item.view", {id: $stateParams.id});
            });
        }
    };
    $scope.delete = function(){
        Staff.delete($stateParams.id).success(function(){
            $state.go("staff.list");
            //$state.go("item.view", {id: $stateParams.id});
        });
    };

}])


;
