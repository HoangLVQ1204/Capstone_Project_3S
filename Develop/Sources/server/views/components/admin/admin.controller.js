/**
 * Created by hoanglvq on 9/22/15.
 */

function adminController($scope,$state){

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

adminController.$inject = ['$scope','$state'];
angular.module('app').controller('adminController',adminController);

