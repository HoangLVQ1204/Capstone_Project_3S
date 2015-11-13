/**
 * Created by Hoang on 10/18/2015.
 */
(function (ng) {
    angular.module('app')
        .directive('issueContent', function () {
            return {
                controller: 'issueContentController',
                templateUrl: '/components/adminIssueBox/issueContent/issueContent.html',
                controllerAs: 'issueContentController',
                scope: {},
                replace: true,
                restrict: 'E'
            }
        })

})(angular);
