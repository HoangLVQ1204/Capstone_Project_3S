/**
 * Created by khanhkc on 9/22/15.
 */

function storeOrderDetailController($scope,$stateParams,dataService, $http, config, $rootScope){
  
  $scope.orderid = $stateParams.orderid;
  $scope.disabled = true;
  $scope.colspan = 9;
  $scope.order={};
  var bigestGoodId = 0;
  $scope.good={};
  $scope.listgoods =[];
  $scope.houseNumber="";
  getOrderFromServer();
  getStoreName();
  getProvince ();
  $scope.changeToEn = function(){
    $scope.disabled = false;    
  };
  $scope.changeToDis = function(){
    $scope.disabled = true;    
  };

  $scope.$watch('$viewContentLoaded', function (event) {
    caplet();

    $("#addGoodModal").submit(function(e){
      e.preventDefault();
      if($(this).parsley( 'validate' )){
        addGood();
        $scope.order.overweightfee = calculateOverWeightFee($scope.data.selectedDistrict.districtid,$scope.listgoods);
        $scope.$apply();                                    
        $('#md-add-good').modal('hide');
      }
    });

    $("#editGoodModal").submit(function(e){
      e.preventDefault();
      if($(this).parsley( 'validate' )){
        editGood();       
      }
    });

    $("#edit-order-form").submit(function(e){
      e.preventDefault();
      if($scope.listgoods.length==0){
        alertEmptyGood();        
      }else if($(this).parsley( 'validate' )){
        updateOrderToServer();
      }
      

    });

    //iCheck[components] validate
    $('input').on('ifChanged', function(event){
    $(event.target).parsley( 'validate' );
    });
    
  });
  
 
    function getOrderFromServer() {
        var urlBase = config.baseURI + '/orders/' + $scope.orderid;
        dataService.getDataServer(urlBase)
            .success(function (rs) {               
               $scope.order = rs;
               $scope.listgoods = rs.goods;
               console.log("===========listGoods===========",$scope.listgoods);
               var confirmationcode = rs.confirmationcodes;
               for(var i = 0; i < confirmationcode.length;i++){
                  if(confirmationcode[i].typeid ==2){
                    $scope.codeForShipper = confirmationcode[i].codecontent;
                  };

                  if(confirmationcode[i].typeid ==6){
                    $scope.codeForCustomer = confirmationcode[i].codecontent;
                  }                  
               }
               if($scope.order.ordertypeid == 1){
                  $scope.deliveryType = "Normal";
               } else {
                  $scope.deliveryType = "Express";
               }
               //console.log("==============rs===========",rs);
               calculateOverWeightFee($scope.order.deliverydistrictid,$scope.listgoods);
            })
            .error(function (error) {
                console.log('Unable to load order: ' + error);
            });
    };

    function updateOrderToServer(){
        var urlBase = config.baseURI + '/orders/' + $scope.orderid;
        $scope.order.deliveryprovinceid  = $scope.data.selectedProvince.provinceid;
        $scope.order.deliverydistrictid = $scope.data.selectedDistrict.districtid;
        $scope.order.deliverywardid = $scope.data.selectedWard.wardid;
        var data = {
          order: $scope.order,
          listgoods: $scope.listgoods,
        }        
        dataService.putDataServer(urlBase,data)
         .then(function(sc){
            $scope.disabled = true;             
          },function(er){
            var err = {
              type:'issue',
              title: 'Error',
              content: "Can't update this order! Try again!"
            };
            $rootScope.notify(err);
          });  
        
    }

    $scope.newGood = {};
    var index;
    $scope.setGood = function(good,index){        
        $scope.newGood = (JSON.parse(JSON.stringify(good)));
        index = index;
        //console.log("=======goods[]=khi click edit====",good);
        //console.log("========newGood=======", $scope.newGood);
        //console.log("=============index=============", index);
    };

    $scope.refreshGood = function(){
        $scope.good ={};
    }

    function editGood () {
        for(var i = 0; i < $scope.listgoods.length;i++){
            if( $scope.listgoods[i].goodsid === $scope.newGood.goodsid){
                //console.log("=============trugn nhau===========");
                $scope.listgoods[i] = $scope.newGood;
            }
        }
        $scope.$apply();
    }

    function addGood(){
        var urlBase = config.baseURI + '/api/store/addGoods';
        $scope.good.orderid = $scope.orderid;
        var data = $scope.good;
        //console.log("==========data==============",data);
        dataService.postDataServer(urlBase,data)
          .then(function(sc){
            console.log("==============sc===========",sc.data);
            $scope.good.goodsid = sc.data;
            $scope.good.goodID = bigestGoodId;
            $scope.listgoods.push($scope.good);           
            bigestGoodId++;
            $scope.order.overweightfee = calculateOverWeightFee($scope.data.selectedDistrict.districtid,$scope.listgoods);
            $('#md-edit-good').modal('hide');
          },function(er){
            var err = {
              type:'issue',
              title: 'Error',
              content: "Can't add this good! Try again!"
            };
            $rootScope.notify(err);
          });        
       
       
        //console.log("=======goods[]=sau khi add====",$scope.goods);
    }

    $scope.deleteGoods = function(){
        var urlDeleteGoods = config.baseURI + 'api/store/deleteGoods?goodsid=' + $scope.newGood.goodsid;
        dataService.deleteDataServer(urlDeleteGoods).then(function(sc){
            $scope.listgoods.splice(index,1);
        },function(er){
            var err = {
                type: 'issue',
                title: 'Error',
                content: "Can't delete this good! Try again!"
            };
            $rootScope.notify(err);
        });
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
                //console.log("=============IN=======",districtId);
                overWeightFee = (totalWeight - 4000)*2*2;
            }else {
                //console.log("=============out=======",districtId);
                overWeightFee = (totalWeight - 4000)*2*2.5;
            }
            
        }
         //console.log("=============totalWeight=======",totalWeight);
         //console.log("=============overWeightFee=======",overWeightFee);
         return overWeightFee;        
    }

    function calculateFee(districtId,deliveryType){
        var fee = 0;
        var listInDistrictId =["001","002","003","005","006","007","008","009"];
        if(listInDistrictId.indexOf(districtId)> -1){
            if(deliveryType == "Normal"){
                fee = 10000;
            }else {
                fee = 20000;
            }                
        }else {
            if(deliveryType == "Normal"){
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

    $scope.updateFee = function(){
        $scope.order.fee = calculateFee($scope.data.selectedDistrict,$scope.deliveryType);
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
    $scope.listProvince = [];    
    function getProvince () {
        var urlBase = config.baseURI + '/api/getProvince';
        dataService.getDataServer(urlBase)
            .success(function (rs) {                
                $scope.addressDB = rs;
                //console.log("========Adress========",rs);                
                $scope.listProvince = $scope.addressDB.slice(0,1);
                $scope.data.selectedProvince = $scope.listProvince[0];

                $scope.listDistrict = $scope.data.selectedProvince.districts;
                for(var i=0; i< $scope.listDistrict.length;i++){
                    if($scope.listDistrict[i].districtid == $scope.order.deliverydistrictid){
                        $scope.data.selectedDistrict = $scope.listDistrict[i];
                    }
                }
                
                $scope.listWard = $scope.data.selectedDistrict.wards;
                for(var i=0; i<  $scope.listWard.length;i++){
                    if($scope.listWard[i].wardid == $scope.order.deliverywardid){
                        $scope.data.selectedWard = $scope.listWard[i];
                    }
                }                
                
            })
            .error(function (error) {
                console.log('Unable to load province: ' + error);
            });
    }

    $scope.updateDistrict= function(){
        $scope.data.selectedProvince;
        $scope.listDistrict = $scope.data.selectedProvince.districts;
        $scope.data.selectedDistrict = $scope.listDistrict[0];
        // console.log("========district========", $scope.data.selectedDistrict);

        $scope.listWard = $scope.data.selectedDistrict.wards;
        $scope.data.selectedWard = $scope.listWard[0];
        
    }

    $scope.data = {
        selectedProvince: null,
        selectedDistrict: null,
        selectedWard: null};
    $scope.updateWard = function(){
         $scope.listWard = $scope.data.selectedDistrict.wards;
         $scope.data.selectedWard = $scope.listWard[0];
         $scope.order.fee = calculateFee($scope.data.selectedDistrict.districtid,$scope.order.ordertypeid);
         $scope.order.overweightfee = calculateOverWeightFee($scope.data.selectedDistrict.districtid,$scope.listgoods);
    }    
    
    function alertEmptyGood() {
        var data = new Object();
        data.verticalEdge = 'right';
        data.horizontalEdge = 'bottom';
        data.theme = 'theme';
        $.notific8($("#smsEmptyGood").val(), data);       
    }

}
storeOrderDetailController.$inject = ['$scope','$stateParams','dataService','$http','config','$rootScope'];

angular.module('app').controller('storeOrderDetailController',storeOrderDetailController);


