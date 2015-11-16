/**
 * Created by khanhkc on 9/22/15.
 */

function storeOrderDetailController($scope,$stateParams,dataService, $http, config){    
  getStoreName();
  getProvince ();
  $scope.orderid = $stateParams.orderid;
  $scope.disabled = true;
  $scope.colspan = 9;
  $scope.order;
  var bigestGoodId = 0;
  $scope.good;
  $scope.goods;  

  $scope.changeToEn = function(){
    $scope.disabled = false;
    $scope.$apply();
  };
  $scope.changeToDis = function(){
    $scope.disabled = true;
    $scope.$apply();
  };

  $scope.$watch('$viewContentLoaded', function (event) {
    caplet();

    $("#addGoodModal").submit(function(e){
      e.preventDefault();
      if($(this).parsley( 'validate' )){
        addGood();
        $scope.order.overWeightFee = calculateOverWeightFee($scope.selectedDistrict.districtid,$scope.goods);
        $scope.$apply();                                    
        $('#md-add-good').modal('hide');
      }
    });

    $("#editGoodModal").submit(function(e){
      e.preventDefault();
      if($(this).parsley( 'validate' )){
        editGood();
        $scope.order.overWeightFee = calculateOverWeightFee($scope.selectedDistrict.districtid,$scope.goods);
        $scope.$apply(); 
        $('#md-edit-good').modal('hide');
      }
    });

    $("#edit-order-form").submit(function(e){
      e.preventDefault();
      if($(this).parsley( 'validate' )){ 

      }
      if($scope.goods.length==0){
        alertEmptyGood();        
      }

    });

    //iCheck[components] validate
    $('input').on('ifChanged', function(event){
    $(event.target).parsley( 'validate' );
    });
    
  });
  
  getDataFromServer();
    function getDataFromServer() {
        var urlBase = config.baseURI + '/orders/' + $scope.orderid;
        dataService.getDataServer(urlBase)
            .success(function (rs) {               
               $scope.order = rs;
               $scope.listgoods = rs.goods;
               var confirmationcode = rs.confirmationcodes;
               for(var i = 0; i < confirmationcode.length;i++){
                  if(confirmationcode[i].typeid ==2){
                    $scope.codeForShipper = confirmationcode[i].codecontent;
                  };

                  if(confirmationcode[i].typeid ==6){
                    $scope.codeForCustomer = confirmationcode[i].codecontent;
                  }
               }
               console.log("==============rs===========",rs);
            })
            .error(function (error) {
                console.log('Unable to load order: ' + error);
            });
    };

    $scope.newGood = {};
    var index;
    $scope.setGood = function(good,index){
        //console.log("=======goods[]=khi click edit====",$scope.goods);
        $scope.newGood = (JSON.parse(JSON.stringify(good)));
        index = index;
    };

    $scope.refreshGood = function(){
        $scope.good ={};
    }

    function editGood () {
        for(var i = 0; i < $scope.goods.length;i++){
            if( $scope.goods[i].goodID===$scope.newGood.goodID){
                $scope.goods[i] = $scope.newGood;
            }
        }
        $scope.$apply();
    }

    function addGood(){
        $scope.good.goodID = bigestGoodId;
        $scope.goods.push($scope.good);
        $scope.$apply();
        bigestGoodId++;
        //console.log("=======goods[]=sau khi add====",$scope.goods);
    };

    $scope.deleteGood = function(){
        $scope.goods.splice(index,1);
    };

    function caculatateWeight(listGoods){
        var totalWeight = 0;
        for(var i = 0; i <listGoods.length;i++){
            totalWeight = totalWeight + listGoods[i].weight*listGoods[i].amount;
        }
        //console.log("=============totalWeight=======",totalWeight);
        return totalWeight;

    }

    function calculateOverWeightFee(districtId,listGoods){
        var totalWeight = caculatateWeight(listGoods);
        var overWeightFee = 0;
        var listInDistrictId =["001","002","003","005","006","007","008","009"];
        if(totalWeight > 4000 ){
            if(listInDistrictId.indexOf(districtId)>-1){
                console.log("=============IN=======",districtId);
                overWeightFee = (totalWeight - 4000)*2*2;
            }else {
                console.log("=============out=======",districtId);
                overWeightFee = (totalWeight - 4000)*2*2.5;
            }
            
        }
        console.log("=============totalWeight=======",totalWeight);
        console.log("=============overWeightFee=======",overWeightFee);
        return overWeightFee;        
    }

    function calculateFee(districtId,deliveryType){
        var fee = 0;
        var listInDistrictId =["001","002","003","005","006","007","008","009"];
        if(listInDistrictId.indexOf(districtId)> -1){
            if(deliveryType == '1'){
                fee = 10000;
            }else {
                fee = 20000;
            }                
        }else {
            if(deliveryType == '1'){
                fee = 20000;
            }else {
                fee = 30000;
            }       
        }
        //console.log("=============districtId=======",districtId);
        //console.log("=============deliveryType=======",deliveryType);
        //console.log("=============fee=======",fee);
        return fee;
    }

    function getStoreName(){
        var urlBase = config.baseURI + '/api/getAllStoreName';
        dataService.getDataServer(urlBase)
            .success(function (rs) {
                $scope.stores = rs;
                //console.log("=======Store=========",rs);
                $scope.order.storeid = $scope.stores[0].storeid;
                $scope.order.pickupaddress = $scope.stores[0].address;
                $scope.order.pickupphone = $scope.stores[0].phonenumber;
                $scope.selectedStore =  $scope.stores[0];
            })
            .error(function (error) {
                console.log('Unable to load store name: ' + error);
            });
    }
    $scope.listProvince = []    
    function getProvince () {
        var urlBase = config.baseURI + '/api/getProvince';
        dataService.getDataServer(urlBase)
            .success(function (rs) {                
                $scope.addressDB = rs;
                //console.log("========Adress========",rs);
                //$scope.listProvince = $scope.addressDB;
                $scope.listProvince = $scope.addressDB.slice(0,1);
                $scope.selectedProvince = $scope.listProvince[0];
               // console.log("========Province========",$scope.selectedProvince);

                $scope.listDistrict = $scope.selectedProvince.districts;
                $scope.selectedDistrict = $scope.listDistrict[0];
                //console.log("========district========", $scope.selectedDistrict);

                $scope.listWard = $scope.selectedDistrict.wards;
                $scope.selectedWard = $scope.listWard[0];
                updateDeliveryAdd();
            })
            .error(function (error) {
                console.log('Unable to load province: ' + error);
            });
    }

        $scope.updateDistrict= function(){

        $scope.selectedProvince;
        $scope.listDistrict = $scope.selectedProvince.districts;
        $scope.selectedDistrict = $scope.listDistrict[0];
        //console.log("========district========", $scope.selectedDistrict);

        $scope.listWard = $scope.selectedDistrict.wards;
        $scope.selectedWard = $scope.listWard[0];

        updateDeliveryAdd();
    }
     $scope.updateWard= function(){

        $scope.selectedDistrict;
        //console.log("========district========", $scope.selectedDistrict);
        $scope.listWard = $scope.selectedDistrict.wards;
        $scope.selectedWard = $scope.listWard[0];
        updateDeliveryAdd();
        $scope.order.fee = calculateFee($scope.selectedDistrict.districtid,$scope.order.ordertypeid);
        
     }
     $scope.updateDeliveryAdd = function(){
        updateDeliveryAdd();
     }

     function updateDeliveryAdd(){
        $scope.order.deliveryaddress = $scope.houseNumber + ", " + $scope.selectedWard.name + ", " + $scope.selectedDistrict.name + ", " + $scope.selectedProvince.name;        
     } 

    function alertEmptyGood() {
        var data = new Object();
        data.verticalEdge = 'right';
        data.horizontalEdge = 'bottom';
        data.theme = 'theme';
        $.notific8($("#smsEmptyGood").val(), data);       
    }

    $scope.updateFee = function(){
        $scope.order.fee = calculateFee($scope.selectedDistrict,$scope.order.ordertypeid);
    }



}
storeOrderDetailController.$inject = ['$scope','$stateParams','dataService','$http','config'];

angular.module('app').controller('storeOrderDetailController',storeOrderDetailController);


