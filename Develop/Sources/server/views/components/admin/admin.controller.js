/**
 * Created by hoanglvq on 9/22/15.
 */

function adminController($scope,$state,$http,$q){
    $scope.getUser = function(){
        console.log("get Users");
        return $http({
            url: 'http://localhost:3000/users',
            method: 'GET'
        }).then(function(data){
            $scope.data  = data;
        }).catch(function(error){
            console.log(error);
        });
    }
    $scope.$watch('$viewContentLoaded', function(event) {

        $('nav#menu-ver').mmenu({
            searchfield   :  true,
            slidingSubmenus	: false
        }).on( "closing.mm", function(){
            setTimeout(function () { closeSub() }, 200);
            function closeSub(){
                var nav=$('nav#menu-ver');
                nav.find("li").each(function(i) {
                    $(this).removeClass("mm-opened");
                });
            }
        });
        caplet();
    });
}

adminController.$inject = ['$scope','$state','$http','$q'];
angular.module('app').controller('adminController',adminController);

