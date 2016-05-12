'use strict';

angular.module('hs.directives', ['ngMessages'])

.directive('hsCheckbox', function(){
    return {
        restrict: 'E',
        scope: {
            label: '@',
            list: '=',
            selected: '='
        },
        link: function(scope, element, attrs){
            // if scope's list is not object without _id but string or number, make an object
            scope.list.forEach(function(item, index, list){
                if (typeof item !== 'object') {
                    list[index] = { _id: item, name: item }
                }
            });
            scope.checkboxModel = {};
            scope.$watchCollection('list', function(value) {
                scope.list.forEach(function(item){
                    if (scope.selected){
                        scope.checkboxModel[item._id] = false;
                        for (var i=0; i<scope.selected.length; i++){
                            if (scope.selected[i] == item._id)
                                scope.checkboxModel[item._id] = true;
                                continue;
                        }
                    }
                });
                scope.$watchCollection('checkboxModel', function (){
                    scope.selected = [];
                    angular.forEach(scope.checkboxModel, function (value, key) {
                        //console.log(value, key);
                        if (value) {
                            scope.selected.push(key);
                        }
                    });
                });
            });
        },
        templateUrl: 'components/templates/checkbox.html'
    }
})

.directive('hsMenuItem', function(){
    return {
        restrict: 'E',
        scope: {
            item: '='
        },
        link: function(scope, element, attrs){
            function flatting(array, item, prefix){
                for (var key in item){
                    if (typeof item[key] === 'object'){
                        if (Object.prototype.toString.call(item[key]) === '[object Array]' )
                            array.push({ name: prefix+key, value: item[key]})
                        else flatting(array, item[key], key+"_");
                    }
                    else array.push({ name: prefix+key, value: item[key]})
                }
            }

            scope.rows = [];
            flatting(scope.rows, scope.item, "");
            console.log(scope.rows);
        },
        templateUrl: 'components/templates/menuItem.html'
    }
})

.directive('hsMenuListItem', function(){
    return {
        restrict: 'E',
        scope: {
            item: '='
        },
        templateUrl: 'components/templates/menuListItem.html'
    }
})

.directive('hsLogInForm', function(){
    return {
        restrict: 'E',
        scope: {
            user: '=',
            submit: '&',
            message: '='
        },
        templateUrl: 'components/templates/logInForm.html'
    }
})

.directive('hsSignUpForm', function(){
    return {
        restrict: 'E',
        scope: {
            user: '=',
            submit: '&',
            message: '='
        },
        templateUrl: 'components/templates/signUpForm.html'
    }
})

.directive('hsFormText', function(){
    return {
        restrict: 'E',
        scope: {
            label: '@',
            name: '@',
            ngModel: '=',
            form: '=',
            ngMinlength: '=',
            ngMaxlength: '=',
            ngRequired: '='
        },
        link: function (scope, element, attrs) {
            if (!attrs.ngRequired) attrs.ngRequired = false;
            //if (!attrs.form) attrs.form = scope.form['$name'];
            //console.log(element);
        },
        templateUrl: 'components/templates/formText.html'
    }
})

.directive('hsFormEmail', function(){
    return {
        restrict: 'E',
        scope: {
            label: '@',
            name: '@',
            ngModel: '=',
            form: '='
        },
        link: function (scope, element, attrs) {
            //console.log(scope.form);
        },
        templateUrl: 'components/templates/formEmail.html'
    }
})

.directive('hsFormPhone', function(){
    function convertPhoneForm(str){
        if (str) {
            var array = str.split("").map(function(s){
                return s.match(/\d/);
            });
            var res = array.join("");
            return res.substr(0,3)+"-"+res.substr(3,3)+"-"+res.substr(6,4);
        }
        else return null;
    }
    return {
        restrict: 'E',
        scope: {
            label: '@',
            name: '@',
            ngModel: '=',
            form: '='
        },
        link: function (scope, element, attrs) {
            scope.phonePattern = /^\d{3}[- ]?\d{3}[- ]?\d{4}$/;
            scope.ngModel = convertPhoneForm(scope.ngModel);
        },
        templateUrl: 'components/templates/formPhone.html'
    }
})

.directive('hsFormPasscode', function(){
    return {
        restrict: 'E',
        scope: {
            label: '@',
            name: '@',
            ngModel: '=',
            form: '='
        },
        link: function (scope, element, attrs) {
            scope.pattern = /^\d{4}$/;
        },
        templateUrl: 'components/templates/formPasscode.html'
    }
})

.directive('hsFormBoolean', function(){
    return {
        restrict: 'E',
        scope: {
            label: '@',
            name: '@',
            ngModel: '='
        },
        link: function (scope, element, attrs) {
        },
        templateUrl: 'components/templates/formBoolean.html'
    }
})

.directive('hsShowTotals', function(){
    return {
        restrict: 'E',
        scope: {
            subtotal: '=',
            tax: '=',
            total: '='
        },
        link: function (scope, element, attrs) {
        },
        templateUrl: '../components/templates/showTotals.html'
    }
})

.directive('hsReceipt', function(){
    return {
        restrict: 'E',
        scope: {
            store: '=',
            payment: '='
        },
        link: function (scope, element, attrs) {
            scope.store = { name: "MIDORI TERIYAKI",
                address1: "1120 Howell St.",
                address2: "Seattle, WA 98101",
                phone: "206-624-7273" };

            console.log(scope.payment);
        },
        templateUrl: '../components/templates/receipt.html'
    }
})

.directive('hsViewItem', function(){
    return {
        restrict: 'E',
        scope: {
            item: '='
        },
        link: function (scope, element, attrs) {
            scope.item.selected = false;
            element.css({
                backgroundColor: 'lightgrey',
                border: '1px solid red',
                overflow: 'hidden'
            });
       },
        templateUrl: '../components/templates/viewItem.html'
    }
})

.directive('hsHide', function(){
    return {
        restrict: 'A',
        scope: {
            hsHide: '='
        },
        link: function (scope, element, attrs) {
            scope.$watch('hsHide', function(value){
                if (value)
                    element.css({
                        display: 'none'
                    });
                else
                    element.css({
                        display: 'block'
                    });
            }
        }
    }
})


;
