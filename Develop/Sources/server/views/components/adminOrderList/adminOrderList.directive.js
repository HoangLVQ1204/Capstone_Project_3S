/**
 * Created by Hoang on 10/18/2015.
 */
(function (ng) {
    angular.module('app')
        .directive('adminOrderList', function () {
            return {
                controller: 'adminOrderListController',
                templateUrl: '/components/adminOrderList/adminOrderList.html',
                controllerAs: 'adminOrderListController',
                scope: {},
                replace: true,
                restrict: 'E'
            }
        })
        .directive('searchWatchModelMultiple', ['$timeout', function ($timeout) {
            return {
                restrict: 'A',
                require: '^stTable',
                scope: {
                    searchWatchModelMultiple: '=',
                    stdate:'=',
                    //stCustomDate: '='
                },
                link: function (scope, element, attr, ctrl) {
                    //var inputBefore = ng.element(inputs[0]);
                    //var inputAfter = ng.element(inputs[1]);
                    var query = {};
                    scope.$watch('searchWatchModelMultiple', function (val) {
                        //console.log(ctrl);
                        //console.log($('#daterange').daterangepicker());
                        ctrl.search(val, attr.stPredicate);
                    });


                    scope.$watch('stdate', function (val) {
                        if (val!=null){
                            var res = val.split("-");
                            query = {};
                            query.after = new Date(res[0]);
                            query.before = new Date(res[1]);
                        }
                        ctrl.search(query, attr.stCustomDate);
                        // console.log(attr.stCustomDate);
                    });

                    attr.$observe('stPredicate', function (newValue, oldValue) {
                        var model = scope.$eval(attr.stPredicate);
                        //console.log(newValue, oldValue);
                        //table.search(model, newValue);
                        if (newValue !== oldValue && model) {
                            ctrl.search(model, newValue);
                        }
                    });
                }
            };
        }])
})(angular);
