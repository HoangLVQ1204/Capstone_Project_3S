/**
 * Created by hoanglvq on 9/22/15.
 */

function storeController($scope,$state,socketStore,dataService,authService,config){

    authService.getProfileUser()
        .then(function(res){
            console.log("-------DATA USER-------");
            console.log(res.data);
            console.log("-------DATA USER-------");
            $scope.inforUser = res.data;
        })

    var urlBase = config.baseURI + '/api/store/' + authService.getCurrentInfoUser().stores[0].storeid;
    dataService.getDataServer(urlBase)
        .then(function(res){
            $scope.inforStore = res.data;
        })

    $scope.findShipper = function() {        
        socketStore.findShipper();
    }

    $scope.signOut = function(){
        console.log("log out");
        authService.signOut();
    }
    //document.getElementById("btnDemo").onclick = function() {alert("Hello")};
    //$state.go('app.login');
    
//    authService.userIsLoggedIn(function(role){
//        if(role.isAdmin){
//            
//        }
//        else if(role.isStore){
//            $scope.menu = menuStore;
//            //$state.go('app.store');
//        }
//    });

    $scope.$watch('$viewContentLoaded', function(event) {

            $('nav#menu-ver').mmenu({
                searchfield   :  false,
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

storeController.$inject = ['$scope','$state','socketStore','dataService','authService','config'];
angular.module('app').controller('storeController',storeController);

