/**
 * Created by hoanglvq on 10/19/15.
 */

function loginController($scope,$rootScope,$state,authService,config,socketStore,socketAdmin,socketShipper,socketService){


    var showError = function(error){
        $scope.showUserError = true;
        $scope.errorMessage = error.message;
    };

    $scope.submit = function(){

            var main=$("#main");
            main.animate({
                scrollTop: 0
            }, 500);
            main.addClass("slideDown");

        authService.signIn($scope.user)
            .then(function(res){

                authService.saveToken(res.data.token);
                socketService.authenSocket()
                .then(function() {

                    if(authService.isRightRole(config.role.admin)){
                        socketAdmin.registerSocket();
                        $state.go('admin.dashboard');
                    }

                    if(authService.isRightRole(config.role.store)){
                        socketStore.registerSocket();
                        $state.go('store.dashboard');
                    }

                });
            })
            .catch(function(rs){
                console.log("---ERROR---");
                console.log($scope.user);
                console.log("---ERROR---");
                if(rs.data == "Banned"){
                    main.removeClass("slideDown");
                    $("#displayInforBan").modal("show");
                }else{
                    main.removeClass("slideDown");
                    $.notific8('Check Username or Password again !! ',
                        {
                            life:5000,
                            horizontalEdge:"bottom",
                            theme:"danger" ,
                            heading:" ERROR :); "
                        });
                    return false;
                }
            })
    };



    $(function() {

        //Login animation to center
        function toCenter(){
            var mainH=$("#main").outerHeight();
            var accountH=$(".account-wall").outerHeight();
            var marginT=(mainH-accountH)/2;
            if(marginT>30){
                $(".account-wall").css("margin-top",marginT-15);
            }else{
                $(".account-wall").css("margin-top",30);
            }
        }
        toCenter();
        var toResize;
        $(window).resize(function(e) {
            clearTimeout(toResize);
            toResize = setTimeout(toCenter(), 500);
        });

        //Canvas Loading
        var throbber = new Throbber({  size: 32, padding: 17,  strokewidth: 2.8,  lines: 12, rotationspeed: 0, fps: 15 });
        throbber.appendTo(document.getElementById('canvas_loading'));
        throbber.start();
    });


    $scope.$watch('$viewContentLoaded', function(event) {
        caplet();
    });
}

loginController.$inject = ['$scope','$rootScope','$state','authService','config','socketStore','socketAdmin','socketShipper','socketService'];
angular.module('app').controller('loginController',loginController);

