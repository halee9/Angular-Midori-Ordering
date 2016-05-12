angular.module('hs.cartService', [])

.factory('Cart', ['Menu', '$cookies', 'Types', function(Menu, $cookies, Types){
    var cart, itemId;
    var taxRate = 9.5;
    var diningTypes = [ "Togo", "Here" ];
    var orderTypes = [ "Walk-in", "Online", "Phone" ];
    initCart();

    function initCart(){
        cart = {
            items: [],
            total: 0,
            subtotal: 0,
            tax: 0,
            diningType: Types.dining[0].name,
            incomingType: Types.incoming[0].name,
            //paymentType: Types.payment[0].name,
            payments: []
        };
        itemId = 0;
    }

    function getTaxTotal(subtotal){
        var amount = {};
        amount.subtotal = Number(subtotal.toFixed(2));
        var tax = subtotal * taxRate / 100;
        amount.tax = Number(tax.toFixed(2));
        var total = subtotal + tax;
        amount.total = Number(total.toFixed(2));
        return amount;
    }

    function reCalculate(){
        var subtotal = 0;
        for (var i=0; i<cart.items.length; i++){
            subtotal += (cart.items[i].qty * cart.items[i].basePrice);
        }
        var amount = getTaxTotal(subtotal);
        cart.subtotal = amount.subtotal;
        cart.tax = amount.tax;
        cart.total = amount.total;
    }

    function reCalculateItem(item){
        var total = 0;
        for (var i=0; i<item.modifiers.length; i++){
            var modifier = item.modifiers[i];
            if (modifier.type == 'A') {
                total += modifier.selects[modifier.selected].price;
            }
            else {
                var selects = modifier.selects;
                for (var j=0; j<selects.length; j++){
                    if (selects[j].qty > 0) {
                        total += (selects[j].qty * selects[j].price);
                    }
                }
            }
        }
        total += item.basePrice;
        console.log(total, item.basePrice);
        return total;
    }

    function storeCookie(){
        //$cookies.putObject('cart', JSON.stringify(cart));
        $cookies.putObject('cart', cart);
    }
    function getCookie(){
        return $cookies.getObject('cart');
        //return $cookies.getObject('cart');
    }

    function makeBills(total) {
        if (total <= 0) return;
        var bills = [5, 10, 20, 50, 100];
        var billButton = [];
        if (total <= 0) return billButton;
        billButton[0] = {};
        billButton[0].amount = Math.ceil(total);
        billButton[1] = {};
        billButton[1].amount = 5*(Math.ceil(Math.abs(billButton[0].amount/5)));
        if (billButton[0].amount == billButton[1].amount) var idx = 1;
        else var idx = 2;
        for (var i=1; i<bills.length; i++) {
            if (bills[i] > billButton[1].amount) {
                if (!billButton[idx]) billButton[idx] = {};
                billButton[idx].amount = bills[i];
                idx++;
                if (idx > 3) break;
            }
        }
        return billButton;
    };

    function uniqueArray(arr){
        var uniqueArr = [];
        $.each(arr, function(i, el){
            if($.inArray(el, uniqueArr) === -1) uniqueArr.push(el);
        });
        return uniqueArr;
    }

    function makeBillObject(arr){
        var res = [];
        for (var i=0; i<arr.length; i++){
            var obj = {};
            obj.amount = arr[i];
            res.push(obj);
        }
        return res;
    }

    return {
        createItem: function(item){
            console.log(item);
            var obj = {};
            obj._id = itemId++;
            obj.name = item.name;
            obj.abbr = item.abbr;
            obj.image = item.image;
            obj.qty = 1;
            obj.price = Number(item.price);
            obj.basePrice = Number(item.price);
            obj.modifiers = item.modifiers;
            cart.items.push(obj);
            reCalculate();
            return cart.items.length-1;
        },
        newCart: function(){
            initCart();
            return cart;
        },
        setOrderOnCart: function(order){
            cart = order;
            return cart;
        },
        getCart: function(){
            return cart;
        },
        getItem: function(id){
            if (typeof cart.items[id] === "undefined") return false;
            else return cart.items[id];
        },
        setItem: function(id, item){
            if (typeof cart.items[id] === "undefined") return false;
            else {
                cart.items[id] = item;
                reCalculate();
                return item;
            }
        },
        setItemModifiers: function(modifiers, id){
            cart.items[id].modifiers = modifiers;
            return this.computeItemPrice(id);
        },
        computeItemPrice: function(id){
            return cart.items[id].price = reCalculateItem(cart.items[id]);
        },
        setPaymentOptionOnItems: function(){
            var seconds = false;
            cart.items.forEach(function(item){
                if (item.payment_completed) seconds = true;
            });
            if (!seconds) {
                cart.items.forEach(function(item){
                    item.payment_selected = true;
                    item.payment_completed = false;
                });
            }
        },
        setBackPaymentOptionOnItem: function(){
            cart.items.forEach(function(item){
                delete item.payment_selected;
                delete item.payment_completed;
            });
            cart.payments = [];
        },
        calcurateItemsPayment: function(){
            var subtotal = 0;
            var items = [];
            cart.items.forEach(function(item){
                if (item.payment_selected && !item.payment_completed) {
                    subtotal += item.price;
                    items.push(item);
                }
            });
            var amount = getTaxTotal(subtotal);
            amount.items = items;
            return amount;
        },
        setPaymentComplete: function(payment){
            cart.payments.push(payment);
        },
        setItemPaymentComplete: function(payment){
            var done = true;
            cart.items.forEach(function(item){
                if (item.payment_selected) {
                    if (!item.payment_completed)
                        item.payment_completed = true;
                }
                else done = false;
            });
            console.log(done);
            console.log(cart);
            return done;
        },
        isPaymentDone: function(){
            var done = true;
            cart.items.forEach(function(item){
                if (!item.payment_completed)
                    done = false;
            });
            console.log("isPaymentDone:", done);
            return done;
        },
        getCashCases: function(amount){
            amount = parseFloat(amount);
            var bills = [0.05, 0.1, 0.25, 1, 5, 10, 20, 50, 100];
            var result = [];
            result.push(amount);
            for (var i=0; i<bills.length; i++){
                if (bills[i] < 1) {
                    var base = Math.ceil(amount * 100);
                    var bill = bills[i] * 100;
                    result.push((bill * Math.ceil(base/bill))/100);
                }
                else {
                    var base = Math.ceil(amount);
                    result.push(bills[i] * Math.ceil(base/bills[i]));
                }
            }
            //console.log(result);
            //return makeBillObject(uniqueArray(result));
            return uniqueArray(result);
        },
        getPaymentsCount: function(){
            return cart.payments.length;
        }
    }
}])

