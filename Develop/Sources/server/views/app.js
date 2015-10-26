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
]).config(function($stateProvider,$urlRouterProvider,$httpProvider,jwtInterceptorProvider,uiGmapGoogleMapApiProvider){

    // Set up Routes
    $urlRouterProvider.otherwise('/store/dashboard');

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
        .state('admin.map',{
            url: '/map',
            template: '<map></map>'
        })

        .state('store',{
            abstract: true,
            url: '/store',
            template: '<store></store>'
        })
        .state('store.map',{
            url: '/map',
            template: '<map></map>'
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

    uiGmapGoogleMapApiProvider.configure({
        key: 'AIzaSyAFwZM1zlceJr8rMvXxHwS06S3ljhXnlDI',
        v  : '3.20',
        libraries: 'geometry,visualization,drawing,places'
    })

}).run(function($rootScope){
    $rootScope.$on('$stateChangeSuccess', function(e, toState){
        if (toState.name == "login")
            $rootScope.styleBody = "full-lg";
        else
            $rootScope.styleBody = "leftMenu nav-collapse";
    })
})







