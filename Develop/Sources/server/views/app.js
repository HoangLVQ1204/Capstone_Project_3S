/**
 * Created by hoanglvq on 9/22/15.
 */

/* Script */
angular.module('app', [
    'ui.router'
]).config(function($stateProvider,$urlRouterProvider){

    // Set up Routes
    //$urlRouterProvider.otherwise('/store');

    $urlRouterProvider.when('/store/dashboard',  ['$state', function ($state) {
        $state.go('store.dashboard');
        //caplet();
    }]);

    $stateProvider
        .state('store',{
           // abstract: true,
            url: '/store',
            template: '<store></store>'
        })
        .state('store.dashboard',{
            url: '/dashboard',
            template: '<store-dashboard></store-dashboard>'
        })
        .state('store.order',{
            url: '/store/order',
            template: '<store-order></store-order>'
        })

        //.state('store.report',{
        //    url: '/store/report',
        //    template: '<store-report></store-report>'
        //})
        //.state('store.feeback',{
        //    url: '/store/feeback',
        //    template: '<store-feedback></store-feedback>'
        //})

})







