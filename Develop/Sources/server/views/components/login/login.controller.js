/**
 * Created by hoanglvq on 10/19/15.
 */

function loginController($scope,$rootScope,$state,authService,config,socketStore,socketAdmin,socketShipper){

    var showError = function(error){
        $scope.showUserError = true;
        $scope.errorMessage = error.message;
    };

    $scope.submit = function(){

            // event.preventDefault();
            var main=$("#main");
            //scroll to top
            main.animate({
                scrollTop: 0
            }, 500);
            main.addClass("slideDown");

        authService.signIn($scope.user)
            .then(function(){
                if(authService.isRightRole(config.role.admin)){
                    socketAdmin.registerSocket();
                    $state.go('admin.dashboard');
                }

                if(authService.isRightRole(config.role.store)){
                    socketStore.registerSocket();
                    $state.go('store.dashboard');
                }

                if(authService.isRightRole(config.role.shipper)){
                    socketShipper.registerSocket();
                    console.log("xxx");
                    $state.go('mapdemo');
                }
            })
            .catch(function(error){
                main.removeClass("slideDown");
                //setTimeout(function () {
                //    main.removeClass("slideDown")
                //}, !error ? 500:3000);

                $.notific8('Check Username or Password again !! ',{ life:5000,horizontalEdge:"bottom", theme:"danger" ,heading:" ERROR :); "});
                return false;
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



        //Set note alert
        //setTimeout(function () {
        //    $.notific8('Hi Guest , you can use Username : <strong>demo</strong> and Password: <strong>demo</strong> to  access account.',{ sticky:true, horizontalEdge:"top", theme:"inverse" ,heading:"LOGIN DEMO"})
        //}, 1000);


        //$("#form-signin").submit(function(event){
        //    event.preventDefault();
        //    var main=$("#main");
        //    //scroll to top
        //    main.animate({
        //        scrollTop: 0
        //    }, 500);
        //    main.addClass("slideDown");

            // send username and password to php check login
            //$.ajax({
            //    url: "data/checklogin.php", data: $(this).serialize(), type: "POST", dataType: 'json',
            //    success: function (e) {
            //        setTimeout(function () { main.removeClass("slideDown") }, !e.status ? 500:3000);
            //        if (!e.status) {
            //            $.notific8('Check Username or Password again !! ',{ life:5000,horizontalEdge:"bottom", theme:"danger" ,heading:" ERROR :); "});
            //            return false;
            //        }
            //        setTimeout(function () { $("#loading-top span").text("Yes, account is access...") }, 500);
            //        setTimeout(function () { $("#loading-top span").text("Redirect to account page...")  }, 1500);
            //        setTimeout( "window.location.href='dashboard.html'", 3100 );
            //    }
            //});

        //});
    });
    $scope.$watch('$viewContentLoaded', function(event) {
        caplet();
    });
}

loginController.$inject = ['$scope','$rootScope','$state','authService','config','socketStore','socketAdmin','socketShipper'];
angular.module('app').controller('loginController',loginController);

