/**
 * Created by Hoang on 10/18/2015.
 */
(function (ng) {
    angular.module('app')
        .directive('adminAddShipper', function () {
            return {
                controller: 'adminAddShipperController',
                templateUrl: '/components/adminAddShipper/adminAddShipper.html',
                controllerAs: 'adminAddShipperController',
                scope: {},
                replace: true,
                restrict: 'E'
            }
        })
        .directive('singleDatePicker', function () {
            return {
                link: function (scope, element) {
                    //var enddate = new Date(Date.now());
                    //var startdate = new Date(enddate);
                    //startdate.setYear(startdate.getFullYear()-3);

                    element.daterangepicker({
                        singleDatePicker: true,
                        showDropdowns: true,
                        autoUpdateInput: false
                    });

                    element.on('apply.daterangepicker', function(ev, picker) {
                        element.val(picker.startDate.format('MM/DD/YYYY'));
                        //$scope.dateRange = $('#daterange').val();
                        scope.$apply(function(){
                            scope.newShipper.profile.dob = element.val();
                            element.parsley( 'validate' );
                        });
                        //console.log(element.val())
                    });
                }
            }
        })

})(angular);
