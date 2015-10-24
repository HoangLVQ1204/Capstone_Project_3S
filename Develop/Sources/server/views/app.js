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

        .state('store',{
            abstract: true,
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







