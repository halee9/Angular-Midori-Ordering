'use strict';

angular.module("hs.cart", [
    'ui.router',
    'btford.socket-io',
    'hs.services',
    'hs.cartService',
    'hs.directives',
    'hs.filters',
    'ui.bootstrap'
])

.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

    //$urlRouterProvider.otherwise('/cart/menu');
    $stateProvider
        .state('cart', {
            url: '/cart',
            templateUrl: 'cart/cart.html',
            controller: 'CartController',
            params: {
                order_id: null
            },
            resolve: {
                menus: function(Menuitems){
                    console.log("All menu loading");
                    return Menuitems.loadAllMenu();
                },
                order: function(Orders, $stateParams){
                    console.log($stateParams);
                    if ($stateParams.order_id)
                        return Orders.getOne($stateParams.order_id);
                    else
                        return null;
                }
            }
        })
        .state('cart.menu', {
            url: '/menu',
            templateUrl: 'cart/menu.html',
            controller: 'MenuController',
        })
        .state('cart.modifier', {
            url: '/item/:itemId',
            templateUrl: 'cart/modifier.html',
            controller: 'ModifierController'
        })
        .state('cart.customer', {
            url: '/customer',
            templateUrl: 'cart/customer.html',
            controller: 'CustomerController'
        })
        .state('cart.payment', {
            url: '/payment',
            templateUrl: 'cart/payment.html',
            controller: 'PaymentController'
        })
        .state('cart.payment.receipt', {
            url: '/payment/receipt/:num',
            templateUrl: 'cart/receipt.html',
            controller: 'ReceiptController'
        })
        .state('cart.complete', {
            url: '/orders/:orderId',
            templateUrl: 'cart/complete.html',
            controller: 'CompleteController'
            /*,
            resolve: {
                order: function(Orders, $stateParams){
                    cosnsole.log(orderId);
                    return Orders.get($stateParams.orderId);
                }
            }
            */
        })
}])

.controller('CartController', ['$scope', '$location', '$log', '$cookieStore',
    '$timeout', 'Menu', 'Cart', 'Orders', '$state', 'Types', '$stateParams', 'order',
    function($scope, $location, $log, $cookieStore,
        $timeout, Menu, Cart, Orders, $state, Types, $stateParams, order) {

    $scope.items = Menu.items;
    $scope.categories = Menu.categories;
    $scope.modifiers = Menu.modifiers;
    console.log(order);
    if (order){
        Cart.setOrderOnCart(order.data);
    }
    else Cart.newCart();

    $scope.cart = Cart.getCart();
    $scope.diningTypes = Types.dining;
    $scope.incomingTypes = Types.incoming;
    $scope.paymentTypes = Types.payment;

    $state.go("cart.menu");

    $scope.removeAll = function(){
        $scope.cart = Cart.newCart();
    }

    $scope.remove = function(index){
    }

    $scope.placeOrder = function(){
        Orders.create($scope.cart).
            success(function(order_id){
                Cart.newCart();
                $state.go("cart.complete", { order_id: order_id });
            }).
            error(function(err) {
                console.log('Error: ' + err);
            });
    }

    $scope.deleteSelected = function(){
        $scope.cart.items.forEach(function(item){
            delete item.selected;
        })
    }
}])

.controller('MenuController', ['$scope', '$location', 'Cart', '$state', '$window', '$rootScope',
    function($scope, $location, Cart, $state, $window, $rootScope) {

    //console.log("This cashier's screen");
    $scope.menuShow = true;
    $scope.largeScreen = false;

    $scope.setNewItemInCart = function(item){
        console.log(item);
        var w = $window.innerWidth;
        if (w < 700)
            $scope.menuShow = false;
        else $scope.largeScreen = true;
        //console.log($scope.menuShow);
        var itemId = Cart.createItem(item, $scope.modifiers);
        //$state.go('cart', {itemId: itemId});
    }
    $rootScope.$on('$stateChangeSuccess',
        function(event, toState, toParams, fromState, fromParams){
            console.log(toState.name);
            if (toState.name == "cart")
                $scope.menuShow = true;
    });
}])


.controller('ModifierController', ['$scope', '$stateParams', 'Cart', '$state', function($scope, $stateParams, Cart, $state) {

    var id = Number($stateParams.itemId);
    //console.log(Cart.getCart());
    var item = angular.copy(Cart.getItem(id));

    if (item) {
        $scope.item = item;
        var initModifiers = angular.copy(item.modifiers);
        $scope.$watch("item.modifiers", function(value){
            $scope.item.price = Cart.setItemModifiers(value, id);
        }, true);
    }
    else {
        $state.go("cart");
    }


    $scope.addon = function(select){
        if (select.qty) select.qty = 0;
        select.qty++;
        return select;
    }

    $scope.addOne = function(select){
        return select.qty++;
    }

    $scope.subtractOne = function(select){
        if (select.qty > 0)
            return select.qty--;
    }
    $scope.reset = function(){
        $scope.item.modifiers = angular.copy(initModifiers);
        Cart.setItem(id, $scope.item);
    }
    /*
    $scope.backToCart = function(){
        $state.go("register.cart");
    }
    */

}])

.controller('CustomerController', ['$scope', 'order', '$state', 'Types', 'Cart',
    function($scope, order, $state, Types, Cart) {

    $scope.cart = Cart.getCart();
    var now = moment();

    $scope.time = {
        hours: now.format('hh'),
        minuates: now.format('mm'),
        ampm: now.format('a')
    }

    $scope.addHour = function(){
        $scope.time.hours = now.add(1, 'h').format('hh');
    }
    $scope.addMinuates = function(){
        $scope.time.minuates = now.add(5, 'm').format('mm');
        $scope.time.hours = now.format('hh');
    }
    $scope.subtractHour = function(){
        $scope.time.hours = now.subtract(1, 'h').format('hh');
    }
    $scope.subtractMinuates = function(){
        $scope.time.minuates = now.subtract(5, 'm').format('mm');
        $scope.time.hours = now.format('hh');
    }
    $scope.set_time = function(){
        $scope.cart.pickupTime = now.toDate();
    }
    $scope.clear_time = function(){
        delete $scope.cart.pickupTime;
    }


}])

.controller('CompleteController', ['$scope', 'order', '$state', 'Types', 'Cart',
    function($scope, order, $state, Types, Cart) {

    //$scope.order = order.data;
    $scope.diningTypes = Types.dining;


    $scope.going_next = function(){
        if (Cart.isPaymentDone()) {
            $scope.cart = Cart.newCart();
            $state.go("cart");
        }
        else $state.go("cart.payment");
    }
}])

.controller('PaymentController', ['$scope', 'Cart', '$state', 'Types', 'Orders',
    function($scope, Cart, $state, Types, Orders) {
    if ($scope.cart.total == 0) $state.go("cart");
    Cart.setPaymentOptionOnItems();
    $scope.payment = {
        items: [],
        total: 0,
        tax: 0,
        subtotal: 0,
        method: Types.payment[0].name,
        received: 0,
        changed: 0
    };
    setPaymentFromCart();

    function setPaymentFromCart(){
        var amount = Cart.calcurateItemsPayment();
        $scope.payment.items = amount.items;
        $scope.payment.total = amount.total;
        $scope.payment.tax = amount.tax;
        $scope.payment.subtotal = amount.tax;
    }

    $scope.paymentTypes = Types.payment;

    $scope.cashes = [];


    $scope.$watch("payment.method", function(value){
        console.log(value);
        if (value == $scope.paymentTypes[0].name)
            $scope.cashes = [];
        else
            // if payment method is Cash
            $scope.cashes = Cart.getCashCases($scope.payment.total);
    }, true);

    $scope.select = function(selectedItem){
        if (!selectedItem.payment_complete) {
            selectedItem.payment_selected = selectedItem.payment_selected ? false : true;
            setPaymentFromCart();
        }
    };
    $scope.revokeAll = function(){
        Cart.setBackPaymentOptionOnItem();
        $state.go("cart");
    };

    function go_receipt(){
        var cnt = Cart.getPaymentsCount();
        $state.go("cart.payment.receipt", {num: cnt-1});
    }

    $scope.paymentDone = function(){
        Cart.setPaymentComplete($scope.payment);
        Cart.setItemPaymentComplete();

        if (Cart.isPaymentDone()) {
            Orders.create($scope.cart).
                success(function(order){
                    go_receipt();
                }).
                error(function(err) {
                    console.log('Error: ' + err);
                });
        }
        else {
            go_receipt();
        }

    };

    $scope.chooseCashAmount = function(amount){
        $scope.payment.received = amount;
        $scope.payment.changed = amount - $scope.payment.total;

    }

}])

.controller('ReceiptController', ['$scope', 'Cart', '$stateParams', function($scope, Cart, $stateParams) {
    var cart = Cart.getCart();
    var num = $stateParams.num;
    $scope.payment = cart.payments[num];
    console.log($scope.payment);
}])

;

