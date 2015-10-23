/**
 * Created by Hoang on 10/18/2015.
 */
(function (ng) {
    angular.module('app')
        .directive('adminStoreList', function () {
            return {
                controller: 'adminStoreListController',
                templateUrl: '/components/adminStoreList/adminStoreList.html',
                controllerAs: 'adminStoreListController',
                scope: {},
                replace: true,
                restrict: 'E'
            }
        })
        .directive('searchWatchModel', ['$timeout', function ($timeout) {
            return {
                restrict: 'A',
                require: '^stTable',
                scope: {
                    searchWatchModel: '=',
                    stdate:'=',
                    stCustomDate: '='
                },
                link: function (scope, element, attr, ctrl) {
                    //var inputBefore = ng.element(inputs[0]);
                    //var inputAfter = ng.element(inputs[1]);
                    var query = {};
                    scope.$watch('searchWatchModel', function (val) {
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
                        //console.log(attr.stCustomDate);
                        ctrl.search(query, attr.stCustomDate);
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
        .directive('daterange', function () {
            return {
                link: function (scope, element) {
                    element.daterangepicker();
                }
            }
        })
        .filter('customFilter', ['$filter', function ($filter) {
            var filterFilter = $filter('filter');
            var standardComparator = function standardComparator(obj, text) {
                text = ('' + text).toLowerCase();
                return ('' + obj).toLowerCase().indexOf(text) > -1;
            };

            return function customFilter(array, expression) {

                function customComparator(actual, expected) {

                    var isBeforeActivated = expected.before;
                    var isAfterActivated = expected.after;
                    var higherLimit;
                    var lowerLimit;
                    var itemDate;
                    var queryDate;
                    if (ng.isObject(expected)) {
                        //date range
                        if (expected.before || expected.after) {
                            try {
                                if (isBeforeActivated) {
                                    higherLimit = expected.before;

                                    itemDate = new Date(actual);
                                    queryDate = new Date(higherLimit);

                                    if (itemDate > queryDate) {
                                        return false;
                                    }
                                }

                                if (isAfterActivated) {
                                    lowerLimit = expected.after;
                                    itemDate = new Date(actual);
                                    queryDate = new Date(lowerLimit);

                                    if (itemDate < queryDate) {
                                        return false;
                                    }
                                }

                                return true;
                            } catch (e) {
                                return false;
                            }

                        }
                        //etc
                        return true;

                    }
                    return standardComparator(actual, expected);
                }
                var output = filterFilter(array, expression, customComparator);

                return output;
            };
        }])
})(angular);
