(function (ng) {
    angular.module('app')
        .directive('adminDashboard',function() {
            return {
                controller: 'adminDashboardController',
                templateUrl: '/components/adminDashboard/adminDashboard.html',
                controllerAs: 'adminDashboardController',
                scope: {},
                replace: true,
                restrict: 'E'
            }
        })
        .directive('adminLayout',function(){
            return {
                templateUrl: '/components/adminDashboard/layout.html',
                replace: true,
                restrict: 'E',
                scope: false
            }
        })
        .directive('daterangeDone', function () {
            return {
                link: function (scope, element) {
                    //var enddate = new Date(Date.now());
                    //var startdate = new Date(enddate);
                    //startdate.setYear(startdate.getFullYear()-3);

                    element.daterangepicker({
                        linkedCalendars: false,
                        autoUpdateInput: false,
                        locale: {
                            //format: "DD/MM/YYYY"

                        }
                    });

                    element.on('apply.daterangepicker', function(ev, picker) {
                        element.val(picker.startDate.format('MM/DD/YYYY') + ' - ' + picker.endDate.format('MM/DD/YYYY'));
                        //$scope.dateRange = $('#daterange').val();
                        scope.$apply(function(){
                            scope.dateRangeDone = element.val();
                        });
                        //console.log($scope.dateRange)
                    });
                }
            }
        })
        .directive('daterangeActive', function () {
            return {
                link: function (scope, element) {
                    //var enddate = new Date(Date.now());
                    //var startdate = new Date(enddate);
                    //startdate.setYear(startdate.getFullYear()-3);

                    element.daterangepicker({
                        linkedCalendars: false,
                        autoUpdateInput: false,
                        locale: {
                            //format: "DD/MM/YYYY"

                        }
                    });

                    element.on('apply.daterangepicker', function(ev, picker) {
                        element.val(picker.startDate.format('MM/DD/YYYY') + ' - ' + picker.endDate.format('MM/DD/YYYY'));
                        //$scope.dateRange = $('#daterange').val();
                        scope.$apply(function(){
                            scope.dateRangeActive = element.val();
                        });
                        //console.log($scope.dateRange)
                    });
                }
            }
        })
        .directive('daterangeFail', function () {
            return {
                link: function (scope, element) {
                    //var enddate = new Date(Date.now());
                    //var startdate = new Date(enddate);
                    //startdate.setYear(startdate.getFullYear()-3);

                    element.daterangepicker({
                        linkedCalendars: false,
                        autoUpdateInput: false,
                        locale: {
                            //format: "DD/MM/YYYY"

                        }
                    });

                    element.on('apply.daterangepicker', function(ev, picker) {
                        element.val(picker.startDate.format('MM/DD/YYYY') + ' - ' + picker.endDate.format('MM/DD/YYYY'));
                        //$scope.dateRange = $('#daterange').val();
                        scope.$apply(function(){
                            scope.dateRangeFail = element.val();
                        });
                        //console.log($scope.dateRange)
                    });
                }
            }
        })
})(angular);



