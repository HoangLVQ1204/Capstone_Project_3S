/**
 * Created by Hoang on 10/18/2015.
 */
(function (ng) {
    angular.module('app')
        .directive('adminTransactionHistory', function () {
            return {
                controller: 'adminTransactionHistoryController',
                templateUrl: '/components/adminTransactionHistory/adminTransactionHistory.html',
                controllerAs: 'adminTransactionHistoryController',
                scope: {},
                replace: true,
                restrict: 'E'
            }
        })
        .directive('daterangeAuto', function () {
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
                            scope.autoDateRange = element.val();
                        });
                        //console.log($scope.dateRange)
                    });
                }
            }
        })
})(angular);
