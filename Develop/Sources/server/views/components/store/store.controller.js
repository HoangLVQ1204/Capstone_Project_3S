/**
 * Created by hoanglvq on 9/22/15.
 */

function storeController($scope,$state,socketStore){
    $scope.findShipper = function() {        
        socketStore.findShipper();
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

storeController.$inject = ['$scope','$state','socketStore'];
angular.module('app').controller('storeController',storeController);

