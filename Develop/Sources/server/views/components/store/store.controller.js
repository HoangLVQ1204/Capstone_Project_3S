/**
 * Created by hoanglvq on 9/22/15.
 */

function storeController($scope,$state,socketService,socketStore,dataService,authService,config,$rootScope,notificationService){

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
        socketService.disconnect();
        authService.signOut();

    }

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

    notificationService.getTotalUnreadNotificationsServer()
    .then(function() {
        $rootScope.numberUnreadNoti = notificationService.getTotalUnreadNotifications();
    });

    $scope.makeAnOrder = function() {
        $state.go('store.order', {}, {reload: true});
    }

    $rootScope.$on("logoutStore",function(data){
        $scope.signOut();
    });
}

storeController.$inject = ['$scope','$state','socketService','socketStore','dataService','authService','config','$rootScope','notificationService'];
angular.module('app').controller('storeController',storeController);

