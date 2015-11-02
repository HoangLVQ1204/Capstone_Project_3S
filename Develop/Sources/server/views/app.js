/**
 * Created by hoanglvq on 9/22/15.
 */

/* Script */
angular.module('app', [
    'ui.router',
    'angular-jwt',
    'nemLogging',
    'uiGmapgoogle-maps',
	'smart-table'
]).constant("config",{		

    role: {
        shipper: 1,
        store: 2,
        admin: 3
    }

}).config(function($stateProvider,$urlRouterProvider,$httpProvider,jwtInterceptorProvider,uiGmapGoogleMapApiProvider,config){

     //Set up Routes

    $urlRouterProvider.otherwise('/error');

    $stateProvider

        .state('home',{
            url: '/home',
            template: '<h1>Home Page đang trong quá trình xây dựng !!!!</h1>'
        })

        .state('login',{
            url: '/auth/login',
            template: '<login></login>'
        })

        .state('error',{
            url: '/error',
            template: '<h1>404 Not Found</h1>'
        })

        .state('admin',{
            //abstract: true,
            url: '/admin',
            template: '<admin></admin>',
            access: config.role.admin
        })

        .state('admin.dashboard',{
            url: '/dashboard',
            template: '<h1>Dashboard Page đang trong quá trình xây dựng !!!!</h1>',
            access: config.role.admin
        })

        .state('admin.storeList',{
            url: '/storeList',
            template: '<admin-store-list></admin-store-list>',
            access: config.role.admin
        })

        .state('admin.assignTask',{
            url: '/assignTask',
            template: '<admin-assign-task></admin-assign-task>',
            access: config.role.admin
        })

        .state('admin.transactionHistory',{
            url: '/transactionHistory',
            template: '<admin-transaction-history></admin-transaction-history>',
            access: config.role.admin
        })

        .state('admin.taskList',{
            url: '/taskList',
            template: '<admin-task-list></admin-task-list>',
            access: config.role.admin
        })

        .state('store',{
            //abstract: true,
            url: '/store',
            template: '<store></store>',
            access: config.role.store
        })

        .state('store.dashboard',{
            url: '/dashboard',
            templateUrl: '/components/storeDashboard/layout.html',
            controller: function($scope, $rootScope, mapService){
                var mode = "all";
                $scope.shippers = mapService.getShipperMarkers(mode);
                $scope.stores = mapService.getStoreMarkers(mode);
                $scope.customers = mapService.getCustomerMarkers(mode);
                $scope.orders = mapService.getOrders(mode);
            },
            access: config.role.store
        })
        .state('store.order',{
            url: '/order',
            template: '<store-order></store-order>',
            access: config.role.store
        })

    jwtInterceptorProvider.tokenGetter = function(){
        return localStorage.getItem('EHID');
    };

    $httpProvider.interceptors.push('jwtInterceptor');

    uiGmapGoogleMapApiProvider.configure({
        key: 'AIzaSyAFwZM1zlceJr8rMvXxHwS06S3ljhXnlDI',
        v  : '3.20',
        libraries: 'geometry,visualization,drawing,places'
    })

}).run(function($rootScope,$state,authService,config,socketStore,socketAdmin){

    $state.go("home");

    if(authService.isLogged()){
        if(authService.isRightRole(config.role.admin)){
            socketAdmin.registerSocket();
            $state.go("admin.dashboard");
        }

        if(authService.isRightRole(config.role.store)){
            socketStore.registerSocket();
            $state.go("store.dashboard");
        }
    }

    $rootScope.$on('$stateChangeStart', function(event, toState, fromState, toParams) {

        if(toState.access){

            if(!authService.isLogged()){
                $state.go("login");
                event.preventDefault();
                return;
            }

            if(!authService.isRightRole(toState.access)){
                $state.go("error");
                event.preventDefault();
                return;
            }

        }

        if(toState.name == 'login'){

            if(authService.isLogged()){
                if(authService.isRightRole(config.role.admin)){
                    console.log("admin");
                    event.preventDefault();

                }
                if(authService.isRightRole(config.role.store)){
                    console.log("store");
                    event.preventDefault();
                }
            }

        }



    });

    $rootScope.$on('$stateChangeSuccess', function(e, toState){

        if (toState.name == "login" || toState.name == "home" || toState.name == "error"){
            $rootScope.styleBody = "full-lg";
            console.log("IN LOGIN");
        }
        else{
            $rootScope.styleBody = "leftMenu nav-collapse";
            console.log("IN ALL");
        }

    });

})







