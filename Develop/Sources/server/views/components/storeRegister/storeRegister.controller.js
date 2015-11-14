/**
 * Created by hoanglvq on 11/14/15.
 */
function storeRegisterController($scope,dataService,config){
    $scope.user = {};

    $scope.registerAcc = function(){
        var dataUser = $scope.user;
        var url = config.baseURI + '/user/register';
        dataService.postDataServer(url,dataUser)
            .then(function(res){
                if(res.data){
                    alert("Bạn đã đăng ký thành công! Chúng tôi sẽ liên hệ với bạn sau! ");
                }else{
                    alert("Đăng ký thất bại!");
                }
            })
    }

    $scope.$watch('$viewContentLoaded', function(event) {
        caplet();

    });

}

storeRegisterController.$inject = ['$scope','dataService','config'];
angular.module('app').controller('storeRegisterController',storeRegisterController);

