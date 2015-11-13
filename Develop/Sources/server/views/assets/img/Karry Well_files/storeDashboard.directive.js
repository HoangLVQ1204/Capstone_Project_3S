(function (ng) {
    angular.module('app')
        .directive('layout',function(){
            return {
                templateUrl: '/components/storeDashboard/layout.html',
                replace: true,
                restrict: 'E',
                scope: false
            }
        })
        .directive('storeDashboard',function() {
            return {
                controller: 'storeDashboardController',
                templateUrl: '/components/storeDashboard/storeDashboard.html',
                controllerAs: 'storeDashboard',
                scope: {},
                replace: true,
                restrict: 'E'
            }
        })
        .directive('daterangedone', function () {
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
         .directive('daterangedraff', function () {
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
                            scope.dateRangeDraff = element.val();
                        });
                        //console.log($scope.dateRange)
                    });
                }
            }
        }) 

})(angular);



