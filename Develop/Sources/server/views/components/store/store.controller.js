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

    $scope.test = function(){
        // $rootScope.findExpressShipper();
        alert('WTH are u testing??? Use Make An Order, please!!');
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


    //setTimeout(function() {
    //    var temp = {
    //        type: 'issue',
    //        title: 'issue 1',
    //        content: 'This is very big issue number 1',
    //        url: '/#/notiListdemo',
    //        isread: false,
    //        createddate: new Date()
    //    };
    //    $rootScope.notify(temp);
    //}, 1000);

    notificationService.getTotalUnreadNotificationsServer()
    .then(function() {
        $rootScope.numberUnreadNoti = notificationService.getTotalUnreadNotifications();
    });
}

storeController.$inject = ['$scope','$state','socketService','socketStore','dataService','authService','config','$rootScope','notificationService'];
angular.module('app').controller('storeController',storeController);

