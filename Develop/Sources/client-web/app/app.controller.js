/**
 * Created by hoanglvq on 9/22/15.
 */

function AppController($scope,$state, authService){

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
            state   : 'app.store.dasboard',
            accessby: '',
            subMenu : []

        },
        {
            title   : 'Order',
            icon    : '',
            state   : 'app.store.order',
            accessby: '',
            subMenu : []
        },
        {
            title   : 'Report',
            icon    : '',
            state   : 'app.store.report',
            accessby: '',
            subMenu : []
        },
        {
            title   : 'Feaback',
            icon    : '',
            state   : 'app.store.feaback',
            accessby: '',
            subMenu : []
        }
    ]

    authService.userIsLoggedIn(function(role){
        if(role.isAdmin){
            $scope.menu = menuStore;
            //$state.go('app.common.login');
        }else if(role.isStore){
            $scope.menu = menuStore;
            //$state.go('app.store');
        }else{
            $state.go('app.guest');
        }
    });





}
AppController.$inject = ['$scope','$state','authService'];
module.exports = AppController;

