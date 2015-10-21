/**
 * Created by Hoang on 10/18/2015.
 */

angular.module('app')
    .directive('adminStoreList', function() {
        return {
            controller: 'adminStoreListController',
            templateUrl: '/components/adminStoreList/adminStoreList.html',
            controllerAs: 'adminStoreListController',
            scope: {},
            replace: true,
            restrict: 'E'
        }
    })
    .directive('searchWatchModel',function(){
        return {
            require:'^stTable',
            scope:{
                searchWatchModel:'='
            },
            link:function(scope, ele, attr, ctrl){
                var table=ctrl;

                scope.$watch('searchWatchModel',function(val){
                    //console.log(val);
                    ctrl.search(val, attr.stPredicate);
                });

                attr.$observe('stPredicate', function (newValue, oldValue) {
                    //console.log(attr.stPredicate);
                    var model = scope.$eval(attr.stPredicate);
                    //console.log(newValue, oldValue);
                    //table.search(model, newValue);
                    if (newValue !== oldValue && model) {
                        ctrl.search(model, newValue);
                    }
                });
            }
        };
    })
