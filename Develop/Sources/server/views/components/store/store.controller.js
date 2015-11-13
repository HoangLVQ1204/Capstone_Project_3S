/**
 * Created by hoanglvq on 9/22/15.
 */

function storeController($scope,$state,socketService,socketStore,dataService,authService,config){

    authService.getProfileUser()
        .then(function(res){
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

    function loading(){
        var overlay=$('<div class="load-overlay"><div><div class="c1"></div><div class="c2"></div><div class="c3"></div><div class="c4"></div></div><span>Finding Shipper...</span><button class="btn btn-theme-inverse">Cancel</button></div>');
        $("body").append(overlay);
        overlay.css('opacity',3).fadeIn("slow");
    }
    function unloading(){
        $("body").find(".load-overlay").fadeOut("slow",function(){ $(this).remove() });
    }
    $scope.listRightShippers = [];

    var flag = false;

    socketService.on('store:find:shipper', function(data) {

        var shipper = data.msg.shipper;
        if(!shipper){
            flag = true;
        }else{
            $scope.listRightShippers.push(shipper);
        }
        // Test selectShipper
        //api.selectShipper(shipper, {});
    });

    $scope.makeExpressOrder = function(){

    };

    $scope.test = function(){

        //$("#listAcceptedShipper").modal("show");

        socketStore.findShipper();
        loading();
        var s = 0;
        $scope.listRightShippers = [];
        var loopFindShipper = setInterval(function(){
            if($scope.listRightShippers.length != 0){
                $scope.rightShipper = $scope.listRightShippers[0];
                $scope.$apply();
                unloading();
                $("#listAcceptedShipper").modal("show");
                clearInterval(loopFindShipper);
                return;
            }
            s = s + 1;

            if(s == 60 || flag){
                unloading();
                $scope.rightShipper = {
                    avatar: "assets/img/notfound.png"
                };
                $scope.$apply();
                $("#listAcceptedShipper_Fail").modal("show");
                clearInterval(loopFindShipper);
                flag = false;
            }
        },1000);
    };

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

storeController.$inject = ['$scope','$state','socketService','socketStore','dataService','authService','config'];
angular.module('app').controller('storeController',storeController);

