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
	$urlRouterProvider.otherwise('/admin/map');

    $stateProvider
        .state('login',{
            url: '/auth/login',
            template: '<login></login>'
        })
        .state('admin',{
            //abstract: true,
            url: '/admin',
            template: '<admin></admin>',
            access: config.role.admin

        })
        .state('admin.map',{
            url: '/map',
            views: {
                'mapGoogle': {
                    template: '<map style="margin-top: 10px" shipper-markers="shippers" store-markers="stores" customer-markers="customers" orders="orders"></map>',
                    controller: function($scope, $rootScope, mapService) {
                        setTimeout(function() {
                            $rootScope.$apply(function() {
                                var mode = "all";
                                console.log(mode);

                                $scope.shippers = mapService.getShipperMarkers(mode);
                                $scope.stores = mapService.getStoreMarkers(mode);
                                $scope.customers = mapService.getCustomerMarkers(mode);
                                $scope.orders = mapService.getOrders(mode);
                            });
                        }, 10000);
                    }
                },
                'dataShow': {
                    template: '<h1>HoangLVQ dasdsadas</h1>'
                }
            },
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
        .state('store',{
            //abstract: true,
            url: '/store',
            template: '<store></store>',
            access: config.role.store
        })
        //.state('store.map',{
        //    url: '/map',
        //    template: '<map></map>'
        //})
        //.state('store.dashboard',{
        //    url: '/dashboard',
        //    template: '<store-dashboard></store-dashboard>'
        //})
        //.state('store.order',{
        //    url: '/order',
        //    template: '<store-order></store-order>'
        //})

    jwtInterceptorProvider.tokenGetter = function(){
        return localStorage.getItem('EHID');
    };

    $httpProvider.interceptors.push('jwtInterceptor');

    uiGmapGoogleMapApiProvider.configure({
        key: 'AIzaSyAFwZM1zlceJr8rMvXxHwS06S3ljhXnlDI',
        v  : '3.20',
        libraries: 'geometry,visualization,drawing,places'
    })

}).run(function($rootScope,$state,authService,config,socketStore,socketAdmin,socketShipper){

    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {

        if(toState.access){

            if(!authService.isLogged()){
                $state.go("login");
                event.preventDefault();
                return;
            }

            if(!authService.isRightRole(toState.access)){
                console.log('This page is denied');
                //TODO: Chuyển v�? trang warning
            }


        }

        if(toState.name == 'login'){
            if(authService.isLogged()){

                if(authService.isRightRole(config.role.admin)){
                    console.log("admin");
                    $state.go('admin');
                    event.preventDefault();
                }

                if(authService.isRightRole(config.role.store)){
                    console.log("store");
                    $state.go('store');
                    event.preventDefault();
                }

                // if(authService.isRightRole(config.role.shipper)){
                //     console.log("shipper");
                //     $state.go('store');
                //     event.preventDefault();
                // }

            }
        }

    });

    $rootScope.$on('$stateChangeSuccess', function(e, toState){

        if (toState.name == "login"){
            $rootScope.styleBody = "full-lg";
        }
        else{
            $rootScope.styleBody = "leftMenu nav-collapse";
        }

    })

    if(authService.isLogged()){
        if(authService.isRightRole(config.role.admin)){
            socketAdmin.registerSocket();            
        }

        if(authService.isRightRole(config.role.store)){
            socketStore.registerSocket();
        }

        if(authService.isRightRole(config.role.shipper)){
            socketShipper.registerSocket();
        }
    }

})







