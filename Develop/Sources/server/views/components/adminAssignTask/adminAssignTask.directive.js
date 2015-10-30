/**
 * Created by Hoang on 10/18/2015.
 */
(function (ng) {
    angular.module('app')
        .directive('adminAssignTask', function () {
            return {
                controller: 'adminAssignTaskController',
                templateUrl: '/components/adminAssignTask/adminAssignTask.html',
                controllerAs: 'adminAssignTaskController',
                scope: {},
                replace: true,
                restrict: 'E'
            }
        })
        .directive('csSelect', function () {
        return {
            require: '^stTable',
            //template: '<input type="checkbox"/>',
            scope: {
                row: '=csSelect',
                selectMode: '=',
                ngModel: '=',
                action:'&selectAction'
            },
            link: function (scope, element, attr, ctrl) {

                element.bind('click', function (evt) {
                    scope.$apply(function () {
                        //console.log(scope.ngModel);
                        ctrl.select(scope.row, attr.selectMode);
                        scope.action(scope.row);
                        //console.log(scope.row);
                    });
                });

                scope.$watch('row.isSelected', function (newValue, oldValue) {
                    //console.log(newValue);
                    if (newValue === true) {
                        element.addClass('st-selected');
                        element.find('input').attr('checked', true);
                        scope.ngModel = true;
                    } else {
                        element.removeClass('st-selected');
                        element.find('input').attr('checked', false);
                        scope.ngModel = false;
                    }
                });
            }
        };
    })
        .directive('csSelectCheckbox', function () {
            return {
                require: '^stTable',
                //template:  '<input type="checkbox">',
                scope: {
                    row: '=csSelectCheckbox',
                    shipperRow: '=',
                    selectMode: '=',
                    action:'&selectAction'
                },
                link: function (scope, element, attr, ctrl) {

                    element.parent().bind('click', function (evt) {
                        scope.$apply(function () {
                            //ctrl.select(scope.row, attr.selectMode);
                            scope.action(scope.row);
                            //console.log(scope.row);
                        });
                    });

                    scope.$watch('row.isSelected', function (newValue, oldValue) {
                        //console.log(attr.ngModel);
                        if (newValue === true) {
                           // element.parent().addClass('st-selected');
                            //scope.pickOrder.push(row);
                            //element.find('input').attr('checked', true);
                        } else {
                            element.parent().removeClass('st-selected');
                            //element.find('input').attr('checked', false);
                            //var index = array.indexOf(row);
                            //if (index > -1) {
                            //    scope.pickOrder.splice(index, 1);
                            //}

                        }
                    });

                    scope.$watch('shipperRow', function (newValue, oldValue) {
                        //console.log(newValue);
                        //element.parent().addClass('st-selected');
                    });


                }
            };
        });

})(angular);
