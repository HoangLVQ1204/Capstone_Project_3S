/**
 * Created by hoanglvq on 9/22/15.
 */

function storeController($scope,$state){

    var menuAdmin = [
        {
            title   : 'Dashboard',
            icon    : '',
            state   : 'app.admin.dasboard',
            accessby: '',
            subMenu : []

        },
        {
            title   : 'Order',
            icon    : '',
            state   : 'app.admin.order',
            accessby: '',
            subMenu : [
                {
                    title: 'Add New Order',
                    icon: '',
                    state: '',
                    accessby: ''
                },
                {
                    title: 'View Order\'s List',
                    icon: '',
                    state: '',
                    accessby: ''
                }
            ]
        },
        {
            title   : 'Shipper',
            icon    : '',
            state   : 'app.admin.dasboard',
            accessby: '',
            subMenu : [
                {
                    title: 'Add New Order',
                    icon: '',
                    state: '',
                    accessby: ''
                },
                {
                    title: 'View Order\'s List',
                    icon: '',
                    state: '',
                    accessby: ''
                }
            ]
        }
    ]
    var menuStore = [
        {
            title   : 'Dashboard',
            icon    : '',
            state   : 'store.dashboard',
            accessby: '',
            subMenu : []

        },
        {
            title   : 'Order',
            icon    : '',
            state   : 'store.order',
            accessby: '',
            subMenu : []
        },
        {
            title   : 'Report',
            icon    : '',
            state   : 'store.report',
            accessby: '',
            subMenu : []
        },
        {
            title   : 'Feaback',
            icon    : '',
            state   : 'store.feaback',
            accessby: '',
            subMenu : []
        }
    ]

    $scope.menu = menuStore;


    //document.getElementById("btnDemo").onclick = function() {alert("Hello")};
    //$state.go('app.login');
    
//    authService.userIsLoggedIn(function(role){
//        if(role.isAdmin){
//            
//        }
//        else if(role.isStore){
//            $scope.menu = menuStore;
//            //$state.go('app.store');
//        }
//    });

    $scope.$watch('$viewContentLoaded', function(event) {
        caplet();
    });
}

storeController.$inject = ['$scope','$state'];
angular.module('app').controller('storeController',storeController);

