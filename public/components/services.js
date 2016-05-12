angular.module('hs.services', ["ngCookies"])
//angular.module('hs.services', ['btford.socket-io'])

.factory('SessionService', ['$http', '$window', '$q', function($http, $window, $q){
    return {
        login: function(user){
            var deferred = $q.defer();
            $http.post('/api/login', user)
            .success(function(data){
                $window.sessionStorage.token = data.token;
                $window.sessionStorage.username = data.user.local.name;
                //$cookies.put('token', data.token);
                deferred.resolve(data);
            })
            .error(function(data){
                delete $window.sessionStorage.token;
                delete $window.sessionStorage.username;
                deferred.reject(data);
            });
            return deferred.promise;
        },
        signup: function(user){
            //console.log(user);
            return $http.post('/api/signup', user);
        },
        logout: function(){
            delete $window.sessionStorage.token;
            delete $window.sessionStorage.username;
        },
        isLogin: function(){
            return $window.sessionStorage.username || false;
        }
    }
}])

.factory('baseUrl', ['$location', function($location){
    return (($location.host() == 'localhost') ? "http://localhost:8081" : "http://api-highsqu.rhcloud.com");
}])

.factory('sessionInjector', ['$window', 'baseUrl', '$q', '$timeout', '$injector',
    function($window, baseUrl, $q, $timeout, $injector) {
    $timeout(function(){
        $state = $injector.get('$state');
    });
    var sessionInjector = {
        request: function(config){
            config.headers = config.headers || {};
            //console.log(config);
            if (config.url[0] == '/') {
                // if $http Ajax services
                config.url = baseUrl + config.url;
            }
            if ($window.sessionStorage.token) {
                config.headers['x-access-token'] = $window.sessionStorage.token;
            }
            return config;
        },
        responseError: function(response){
            //console.log(response);
            var code = response.data.code;
            var message = response.data.message;
            //console.log(code);
            if (code == 901 || code == 902) $state.go('login', {code:code, message:message});
            else $state.go('home');
            return $q.reject(response);
        }
    };
    return sessionInjector;
}])

.config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('sessionInjector');
}])

.factory('Socket', ['socketFactory', 'baseUrl', function(socketFactory, baseUrl) {
    return socketFactory({
        ioSocket: io.connect(baseUrl)
    });
}])

.factory('Items', ['$http', function($http){
    return {
        getAll: function(){
            return $http.get('/api/items');
        },
        getUpdate: function(id){
            return $http.get('/api/items/update/'+id);
        },
        get: function(id){
            return $http.get('/api/items/'+id);
        },
        update: function(id, item){
            return $http.put('/api/items/'+id, item);
        },
        post: function(item){
            return $http.post('/api/items', item);
        },
        delete: function(id){
            return $http.delete('/api/items/'+id);
        },
        getPhotos: function(){
            return $http.get('/api/photos');
        }
    }
}])

.factory('Categories', ['$http', function($http){
    return {
        getAll: function(){
            return $http.get('/api/categories');
        }
    }
}])

.factory('Modifiers', ['$http', function($http){
    return {
        getAll: function(){
            return $http.get('/api/modifiers');
        }
    }
}])

.factory('User', ['$http', '$cookies', function($http, $cookies){
    var config = {headers: {'x-access-token': $cookies.get('token')}};
    //console.log(config);
    return {
        getAll: function(){
            return $http.get('/api/users', config);
        },
        login: function(user){
            return $http.post('/api/login', user);
        },
        signup: function(user){
            console.log(user);
            return $http.post('/api/signup', user);
        }
    }
}])

.factory('Staff', ['$http', '$cookies', function($http, $cookies){
    var config = {headers: {'x-access-token': $cookies.get('token')}};
    //console.log(config);
    return {
        getAll: function(){
            return $http.get('/api/staffs', config);
        },
        get: function(id){
            return $http.get('/api/staffs/'+id, config);
        },
        getClocks: function(id){
            return $http.get('/api/staffs/'+id+'/clocks', config);
        },
        update: function(id, staff){
            return $http.put('/api/staffs/'+id, staff);
        },
        delete: function(id){
            return $http.delete('/api/staffs/'+id);
        }
    }
}])

.factory('MenuStyle', function(){
    return {
        cookingMethods: ["Charbroil", "Deep Fry", "Stir Fry"],
        portions: ["Regular", "Small", "Large"],
        ingredients: ["Chicken", "Chicken Breast", "Beef", "Pork", "Tofu", "Veggies", "Noodle", "Salmon", "Shrimp"]
    }
})


.factory('Menuitems', ['$http', '$filter', 'Menu', '$q', function($http, $filter, Menu, $q) {
    function findModifier(modis, code){
        var filtered = modis.filter(function(modi){
            return code.toLowerCase() == modi.code.toLowerCase();
        });
        return filtered[0];
    }

    return {
        loadAllMenu: function(){
            if (Menu.items.length > 0) return Menu;
            var deferred = $q.defer();
            var arr = [];
            arr.push($http.get('/api/menuitems'));
            arr.push($http.get('/api/categories'));
            arr.push($http.get('/api/modifiers'));
            $q.all(arr)
                .then(
                function(results){
                    deferred.resolve(results);
                },
                function(error){
                    deferred.reject(errors);
                },
                function(updates){
                    deferred.update(updates);
                });
                return deferred.promise.then(function(data){
                    Menu.items = data[0].data;
                    Menu.categories = data[1].data;
                    Menu.modifiers = data[2].data;
                    Menu.items.forEach(function(item){
                        var modifiers = [];
                        item.modifiers.forEach(function(code){
                            modifiers.push(findModifier(Menu.modifiers, code));
                        })
                        item.modifiers = modifiers;
                    });
                    return Menu;
                });
        },
        getAll: function() {
            //console.log("menuitem service called");
            return $http.get('/api/menuitems');
        },
        getCategories: function() {
            //console.log("menuitem service called");
            return $http.get('/api/categories');
        },
        getModifiers: function() {
            //console.log("menuitem service called");
            return $http.get('/api/modifiers');
        }
    };
}])

.factory('Orders', ['$http', function($http) {
    //var config = {headers: {'x-access-token': $cookies.get('token')}};
    //var config = { headers: {'Content-Type': 'application/x-www-form-urlencoded'} };
    return {
        getOne: function(id) {
            return $http.get('/api/orders/'+id);
        },
        getAll: function() {
            return $http.get('/api/orders');
        },
        create: function(order){
            return $http.post('/api/orders', order);
        }
    }
}])

.factory('Payments', ['$http', function($http) {
    //var config = {headers: {'x-access-token': $cookies.get('token')}};
    //var config = { headers: {'Content-Type': 'application/x-www-form-urlencoded'} };
    return {
        getOne: function(id) {
            return $http.get('/api/payments/'+id);
        },
        getAll: function() {
            return $http.get('/api/payments');
        },
        create: function(payment){
            return $http.post('/api/payments', payment);
        }
    }
}])


.value('Menu', {
    items: [],
    categories: [],
    modifiers: []
})

.value('Types', {
    dining: [
        {
            name: "Togo",
            icon: "fa fa-suitcase"
        },
        {
            name: "Here",
            icon: "fa fa-cutlery"
        }
    ],
    payment: [
        {
            name: "Credit",
            icon: "fa fa-suitcase"
        },
        {
            name: "Cash",
            icon: "fa fa-cutlery"
        }
    ],
    incoming: [
        {
            name: "Walk-in",
            icon: "fa fa-user"
        },
        {
            name: "Phone",
            icon: "fa fa-phone"
        },
        {
            name: "Online",
            icon: "fa fa-globe"
        }
    ]
})



;

/*
.factory('Orders', ['$http', function($http){
    return {
        getAll: function(yyyymmdd){
            var date = yyyymmdd || moment().format('YYYYMMDD');
            return $http.get('/api/orders/'+date);
        },
        get: function(id){
            return $http.get('/api/orders/'+id);
        },
        getSales: function(yyyymmdd){
            var date = yyyymmdd || moment().format('YYYYMMDD');
            return $http.get('/api/sales/'+date);
        },
        getSalesByHours: function(yyyymmdd){
            var date = yyyymmdd || moment().format('YYYYMMDD');
            return $http.get('/api/sales/'+date+'/hours');
        },
        getSalesByItems: function(yyyymmdd){
            var date = yyyymmdd || moment().format('YYYYMMDD');
            return $http.get('/api/sales/'+date+'/items');
        }
    }
}])
*/

