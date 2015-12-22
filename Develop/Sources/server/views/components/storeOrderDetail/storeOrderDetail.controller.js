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
    $scope.oldOrder = _.cloneDeep($scope.order);
  };

  $scope.changeToDis = function(){
    $scope.disabled = true;    
  };

  $scope.$watch('$viewContentLoaded', function (event) {
    caplet();

    $("#addGoodModal").submit(function(e){
      e.preventDefault();
      $scope.currentWeight = calculateWeight($scope.listgoods) + $scope.good.weight*$scope.good.amount;
      if($scope.currentWeight>30000){
        var temp = {
          type: 'issue',
          title: 'OOPS!',
          content: 'Over weight! Total weight <= 300000 gram',
          url: '',
        };
        $rootScope.notify(temp);
      } else if($(this).parsley( 'validate' )){
        addGood();        
      }
    });

    $("#editGoodModal").submit(function(e){
      e.preventDefault();
      $scope.currentWeight = calculateWeight($scope.listgoods)-$scope.good.weight*$scope.good.amount + $scope.newGood.weight*$scope.newGood.amount;
      if($scope.currentWeight>30000){
        var temp = {
          type: 'issue',
          title: 'OOPS!',
          content: 'Over weight! Total weight <= 300000 gram',
          url: '',
        };
        $rootScope.notify(temp);
      } else
      if($(this).parsley( 'validate' )){        
        editGood();       
      }
    });

    $("#edit-order-form").submit(function(e){
      e.preventDefault();
      if($scope.listgoods.length==0){
        var temp = {
          type: 'issue',
          title: 'OOPS!',
          content: 'You must add at least one goods to order!',
          url: ''
        };
        $rootScope.notify(temp);        
      }else if($(this).parsley( 'validate' )){
        updateOrderToServer();
      }
      

    });

    //iCheck[components] validate
    $('input').on('ifChanged', function(event){
        $(event.target).parsley( 'validate' );
    });
    
  });

    function addToTempOrder(order){
        $scope.tmpOrder = {
            oldOrder: order,
            newOrder: order
        }
    }

    function getOrderFromServer() {
        var urlBase = config.baseURI + '/orders/' + $scope.orderid;
        dataService.getDataServer(urlBase)
            .then(function (rs) {
                console.log("=============");
                console.log("Data rs: ");
                console.log(rs);
                console.log("=============");
                $scope.order = rs.data;
                $scope.listgoods = rs.data.goods;

                $scope.numOldGoods = rs.data.goods.length;

               var confirmationcode = rs.data.confirmationcodes;
               for(var i = 0; i < confirmationcode.length;i++){
                  if(confirmationcode[i].typeid ==2){
                    $scope.codeForShipper = confirmationcode[i].codecontent;
                  };

                  if(confirmationcode[i].typeid ==5){
                    $scope.codeForCustomer = confirmationcode[i].codecontent;
                  }                  
               }
               if($scope.order.ordertypeid == 1){
                  $scope.deliveryType = "Normal";
               } else {
                  $scope.deliveryType = "Express";
               }
               calculateOverWeightFee($scope.order.deliverydistrictid,$scope.listgoods);
            })
            
            
    };

    function updateOrderToServer(){
        var urlBase = config.baseURI + '/orders/' + $scope.orderid;
        $scope.order.deliveryprovinceid  = $scope.data.selectedProvince.provinceid;
        $scope.order.deliverydistrictid = $scope.data.selectedDistrict.districtid;
        $scope.order.deliverywardid = $scope.data.selectedWard.wardid;
        var data = {
          order: $scope.order,
          listgoods: $scope.listgoods
        }   
        dataService.putDataServer(urlBase,data)
         .then(function(sc){
            $scope.disabled = true;
             var success = {
              type:'info',
              title: 'Info',
              content: "Update successfully!"
            };
            $rootScope.notify(success);
          },function(er){
            var err = {
              type:'issue',
              title: 'Error',
              content: "Can't update this order! Try again!"
            };
            $rootScope.notify(err);
          });  
        
    }

    $scope.updateOldOrderToServer = function(){
        var urlBase = config.baseURI + '/orders/' + $scope.orderid;

        var data = {
            order: $scope.oldOrder,
            listgoods: $scope.oldOrder.goods
        }

        console.log("numOldGoods " + $scope.numOldGoods);
        console.log("data.listgoods.length " + data.listgoods.length);


            dataService.putDataServer(urlBase, data)
                .then(function (sc) {
                    $scope.disabled = true;

                    getOrderFromServer();
                }, function (er) {
                    var err = {
                        type: 'issue',
                        title: 'Error',
                        content: "Can't cancel this order! Try again!"
                    };
                    $rootScope.notify(err);
                });
    }

    $scope.newGood = {};
    $scope.setGood = function(good,index){
        $scope.good = good;
        $scope.newGood = (JSON.parse(JSON.stringify(good)))
        $scope.currentIndexGood = index;
        $scope.currentWeight = calculateWeight($scope.listgoods);
    };

    $scope.refreshGood = function(){
        $scope.good ={};
        $scope.currentWeight = calculateWeight($scope.listgoods);
    }

    function editGood () {
          var data = $scope.newGood;
          for(var i = 0; i < $scope.listgoods.length;i++){
            if( $scope.listgoods[i].goodsid == $scope.newGood.goodsid){
              $scope.listgoods[i] = $scope.newGood;
            }
          }
          $scope.order.overweightfee = calculateOverWeightFee($scope.data.selectedDistrict.districtid,$scope.listgoods);
          $scope.$apply();
          $('#md-edit-good').modal('hide');

    }

    function addGood(){
        var newGoods = $scope.good;
        $scope.listgoods.push(newGoods);
        $scope.order.overweightfee = calculateOverWeightFee($scope.data.selectedDistrict.districtid,$scope.listgoods);
        $scope.$apply();
        $('#md-add-good').modal('hide');
    }

    $scope.deleteGoods = function(){
        $scope.listgoods.splice($scope.currentIndexGood,1);
    };

    function calculateWeight(listGoods){
        var totalWeight = 0;
        for(var i = 0; i <listGoods.length;i++){
            totalWeight = totalWeight + listGoods[i].weight*listGoods[i].amount;
        }       
        return totalWeight;
    }

    function calculateOverWeightFee(districtId,listGoods){
        var totalWeight = calculateWeight(listGoods);
        var overWeightFee = 0;
        var listInDistrictId =["001","002","003","005","006","007","008","009"];
        if(totalWeight > 4000 ){
            if(listInDistrictId.indexOf(districtId) > -1){
                overWeightFee = Math.round((totalWeight - 4000)/500)*2000;
            }else {
                overWeightFee = Math.round((totalWeight - 4000)/500)*2500;
            }
            
        }
         return overWeightFee;        
    }

    function calculateFee(districtId,deliveryType){
        var fee = 0;
        var listInDistrictId =["001","002","003","005","006","007","008","009"];
        if(listInDistrictId.indexOf(districtId)> -1){
            if(deliveryType == 1){
                fee = 10000;
            }else {
                fee = 20000;
            }                
        }else {
            if(deliveryType == 1){
                fee = 20000;
            }else {
                fee = 30000;
            }       
        }

        return fee;
    }

    function getStoreName(){
        var urlBase = config.baseURI + '/api/getAllStoreName';
        dataService.getDataServer(urlBase)
            .then(function (rs) {
                $scope.stores = rs.data;
                //console.log("=======Store=========",rs);
                $scope.order.storeid = $scope.stores[0].storeid;
                $scope.order.pickupaddress = $scope.stores[0].address;
                $scope.order.pickupphone = $scope.stores[0].phonenumber;
                $scope.selectedStore =  $scope.stores[0];
            },function (error) {
                console.log('Unable to load store name: ' + error);
            })
            
    }
    $scope.listProvince = [];    
    function getProvince () {
        var urlBase = config.baseURI + '/api/getProvince';
        dataService.getDataServer(urlBase)
            .then(function (rs) {                
                $scope.addressDB = rs.data;
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
                
            },function (error) {
                console.log('Unable to load province: ' + error);
            })
            
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
    
   
    /*
     by HoangLVQ - 24/11/2015
     This function is used to listen event which reload status order
     */
    $rootScope.$on("updateStatusOrder", function(event, data){
        getOrderFromServer();
        if(data.msg.profile) {
           $rootScope.displayInfoShipper(data.msg.profile,data.msg.order);
        }
    });

    /*
     by HoangLVQ - 24/11/2015
     This function is used to listen event which update pendding order
     */
    $rootScope.$on("updatePendingOrder", function(event, data){
        getOrderFromServer();
    });


}
storeOrderDetailController.$inject = ['$scope','$stateParams','dataService','$http','config','$rootScope'];

angular.module('app').controller('storeOrderDetailController',storeOrderDetailController);


