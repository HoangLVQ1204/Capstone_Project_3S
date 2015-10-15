/**
 * Created by Hoang on 10/5/2015.
 */

function adminDashboardController($scope,$state){
    var imagePath = 'img/list/60.jpeg';
    $scope.todos = [
        {
            face : imagePath,
            what: 'Brunch this weekend?',
            who: 'Nguyen Van A',
            when: '3:08PM',
            notes: " I'll be in your neighborhood doing errands"
        },
        {
            face : imagePath,
            what: 'Brunch this weekend?',
            who: 'Tran B',
            when: '3:08PM',
            notes: " I'll be in your neighborhood doing errands"
        },
        {
            face : imagePath,
            what: 'Brunch this weekend?',
            who: 'Pham Van C',
            when: '3:08PM',
            notes: " I'll be in your neighborhood doing errands"
        },
        {
            face : imagePath,
            what: 'Brunch this weekend?',
            who: 'Ngo D',
            when: '3:08PM',
            notes: " I'll be in your neighborhood doing errands"
        },
        {
            face : imagePath,
            what: 'Brunch this weekend?',
            who: 'Ngo D',
            when: '3:08PM',
            notes: " I'll be in your neighborhood doing errands"
        },
        {
            face : imagePath,
            what: 'Brunch this weekend?',
            who: 'Ngo D',
            when: '3:08PM',
            notes: " I'll be in your neighborhood doing errands"
        },

    ];

}

adminDashboardController.$inject = ['$scope','$state'];
angular.module('app').controller('adminDashboardController',adminDashboardController);
