/**
 * Created by hoanglvq on 9/22/15.
 */

function adminController($scope,$state){

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
    $scope.menu = menuAdmin;

}

adminController.$inject = ['$scope','$state'];
angular.module('app').controller('adminController',adminController);

