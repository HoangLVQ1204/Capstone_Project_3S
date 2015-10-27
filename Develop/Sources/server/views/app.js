/**
 * Created by hoanglvq on 9/22/15.
 */

/* Script */
angular.module('app', [
    'ui.router',
    'angular-jwt',
	'smart-table'
]).config(function($stateProvider,$urlRouterProvider,$httpProvider,jwtInterceptorProvider){

    // Set up Routes
    //$urlRouterProvider.otherwise('/store');

    $urlRouterProvider.when('/store/dashboard',  ['$state', function ($state) {
        $state.go('store.dashboard');
        //caplet();
    }]);

    $stateProvider
        .state('login',{
            url: '/auth/login',
            template: '<login></login>'
        })
        .state('admin',{
            //abstract: true,
            url: '/admin',
            template: '<admin></admin>'
        })
        .state('admin.storeList',{
            url: '/storeList',
            template: '<admin-store-list></admin-store-list>'
        })
        .state('admin.assignTask',{
            url: '/assignTask',
            template: '<admin-assign-task></admin-assign-task>'
        })
        .state('store',{
            //abstract:true,
            url: '/store',
            template: '<store></store>'
        })
        .state('store.dashboard',{
            url: '/dashboard',
            template: '<store-dashboard></store-dashboard>'
        })
        .state('store.order',{
            url: '/order',
            template: '<store-order></store-order>'
        })

    jwtInterceptorProvider.tokenGetter = function(){
        return localStorage.getItem('EHID');
    };

    $httpProvider.interceptors.push('jwtInterceptor');

}).run(function($rootScope){
    $rootScope.$on('$stateChangeSuccess', function(e, toState){
        if (toState.name == "login")
            $rootScope.styleBody = "full-lg";
        else
            $rootScope.styleBody = "leftMenu nav-collapse";
    })
})







