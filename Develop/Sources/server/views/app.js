/**
 * Created by hoanglvq on 9/22/15.
 */

/* Script */
angular.module('app', [
    'ui.router'
]).config(function($stateProvider,$urlRouterProvider){

    // Set up Routes
    $urlRouterProvider.otherwise('/store/dashboard');

    $stateProvider
        //.state('home',{
        //
        //})
        //.state('login',{
        //
        //})
        //.state('store',{
        //    //abstract: true,
        //    url: '/store',
        //    template: '<store></store>'
        //})
        //.state('store.dashboard',{
        //    url: '/dashboard',
        //    template: '<store-dashboard></store-dashboard>'
        //})
        //.state('store.order',{
        //    url: '/order',
        //    template: '<store-order></store-order>'
        //})

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

        //.state('store.report',{
        //    url: '/store/report',
        //    template: '<store-report></store-report>'
        //})
        //.state('store.feeback',{
        //    url: '/store/feeback',
        //    template: '<store-feedback></store-feedback>'
        //})

})







