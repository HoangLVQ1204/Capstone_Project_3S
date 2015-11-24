/**
 * Created by Hoang on 10/18/2015.
 */
(function (ng) {
    angular.module('app')
        .directive('adminIssueBox', function () {
            return {
                controller: 'adminIssueBoxController',
                templateUrl: '/components/adminIssueBox/adminIssueBox.html',
                controllerAs: 'adminIssueBoxController',
                scope: {},
                replace: true,
                restrict: 'E'
            }
        })
        .filter('fromNow', function() {
            return function(date) {
                return moment(date).fromNow();
            }
        })
        .filter('startFrom', function() {//for page navigation
            return function(input, start) {
                start = +start; //parse to int
                return input.slice(start);
            }
        })

})(angular);
