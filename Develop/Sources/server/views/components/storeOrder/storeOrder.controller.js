/**
 * Created by khanhkc on 9/22/15.
 */

function storeOrderController($scope, dataService, config, socketService, socketStore,$rootScope) {
    getStoreName();
    getProvince ();    
    $scope.order={
        gatheringCode: GenerateRandomCode(6),
        deliverCode: GenerateRandomCode(6),
        storeid: '',
        ordertypeid: "1",
        pickupaddress: '',
        pickupphone: '',
        deliveryaddress: '',
        pickupdate: '',
        deliverydate: '',
        recipientphone: '',
        recipientname: '',
        ledgerid: '',
        statusid: '1',
        isdraff: false,
        fee: 10000,
        cod:'',
        overWeightFee: 0
    };
    var bigestGoodId = 0;
    $scope.good={};
    $scope.goods =[];   
    $scope.fulldeliveryaddress='';


    $scope.$watch('$viewContentLoaded', function (event) {
        caplet();

        ///////////////////////////////////////////////////
        //////////....Animation for wizard..../////////////
        ///////////////////////////////////////////////////
        $(document).ready(function () {

            $('#validate-wizard').bootstrapWizard({
                tabClass: "nav-wizard",
                onNext: function(tab, navigation, index) {
                    if(index==1){
                        var content=$('#step'+index);
                        if(typeof  content.attr("parsley-validate") != 'undefined'){
                            var $valid = content.parsley( 'validate' );
                            if(!$valid ){
                                return false;
                            }

                        }
                    }
                    if(index==2){
                        var content=$('#step'+index);
                        if(typeof  content.attr("parsley-validate") != 'undefined'){
                            var $valid = content.parsley( 'validate' );
                            if(!$valid){
                                return false;
                            }else if($scope.goods.length==0){
                                var temp = {
                                    type: 'issue',
                                    title: 'OOPS!',
                                    content: 'You must add at least one goods to order!',
                                    url: '',
                                };
                                $rootScope.notify(temp);
                                return false;
                            }
                        }
                    }
                    if(index==3){
                        $scope.postCompleteOrder();
                    }


                    // Set the name for the next tab
                    $('#step4 h3').find("span").html($('#fullname').val());
                },
                onTabClick: function (tab, navigation, index) {
                    $.notific8('Please click <strong>next button</strong> to wizard next step!! ', {
                        life: 5000,
                        theme: "danger",
                        heading: " Wizard Tip :); "
                    });
                    return false;
                },
                onTabShow: function (tab, navigation, index) {
                    tab.prevAll().addClass('completed');
                    tab.nextAll().removeClass('completed');
                    if (tab.hasClass("active")) {
                        tab.removeClass('completed');
                    }
                    var $total = navigation.find('li').length;
                    var $current = index + 1;
                    var $percent = ($current / $total) * 100;
                    $('#validate-wizard').find('.progress-bar').css({width: $percent + '%'});
                    $('#validate-wizard').find('.wizard-status span').html($current + " / " + $total);
                }
            });
            $('#validate-wizard .finish').click(function() {                
                alert('Finished!, Starting over!');
                $('#validate-wizard').find("a[href*='step1']").trigger('click');
                return true;
            });

            //////////////////////////////////////
            //////// Validate Add Modal///////////
            //////////////////////////////////////
            $("#addGoodModal").submit(function(e){
                e.preventDefault();
                $scope.currentWeight = calculateWeight($scope.goods) + $scope.good.weight*$scope.good.amount;
                if($scope.currentWeight > 30000){
                    var temp = {
                      type: 'issue',
                      title: 'OOPS!',
                      content: 'Over weight! Total weight <= 300000 gram',
                      url: '',
                  };
                  $rootScope.notify(temp);
              } else
              if($(this).parsley( 'validate' )){
                addGood();                    
            }
        });

            //////////////////////////////////////
            //////// Validate Edit Modal///////////
            //////////////////////////////////////
            $("#editGoodModal").submit(function(e){
                e.preventDefault();
                $scope.currentWeight = calculateWeight($scope.goods)-$scope.good.weight*$scope.good.amount +$scope.newGood.weight*$scope.newGood.amount;
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

            //iCheck[components] validate
            $('input').on('ifChanged', function(event){
                $(event.target).parsley( 'validate' );
            });
            ///Validate edit Modal//////

            // handleStatusChanged();

        });


    });
    $scope.newGood = {};
    var index;
    $scope.setGood = function(good,clickedIndex){
        $scope.good = good;
        $scope.newGood = (JSON.parse(JSON.stringify(good)));
        index = clickedIndex;
        $scope.currentWeight = calculateWeight($scope.goods);
    };



    $scope.refreshGood = function(){
        $scope.good ={};
        $scope.currentWeight = calculateWeight($scope.goods);
    }

    function editGood () {
        for(var i = 0; i < $scope.goods.length;i++){
            if( $scope.goods[i].goodID===$scope.newGood.goodID){
                $scope.goods[i] = $scope.newGood;
            }
        }
        $scope.order.overWeightFee = calculateOverWeightFee($scope.selectedDistrict.districtid,$scope.goods);
        $scope.$apply(); 
        $('#md-edit-good').modal('hide');
        
    }

    function addGood(){
        $scope.good.goodID = bigestGoodId;
        $scope.goods.push($scope.good);
        $scope.order.overWeightFee = calculateOverWeightFee($scope.selectedDistrict.districtid,$scope.goods);
        $scope.$apply();                                    
        $('#md-add-good').modal('hide');
        bigestGoodId++;
    };

    $scope.deleteGood = function(){
        $scope.goods.splice(index,1);
    };

    $scope.postDraff = function(){
        var urlBase = config.baseURI + '/orders';
        $scope.order.isdraff = true;
        var data = {
            order: $scope.order,
            goods : $scope.goods,
        };
        dataService.postDataServer(urlBase,data);

    };


    $scope.postCompleteOrder = function() {
        var urlBase = config.baseURI + '/orders';
        $scope.order.deliveryprovinceid = $scope.selectedProvince.provinceid;
        $scope.order.deliverydistrictid = $scope.selectedDistrict.districtid;
        $scope.order.deliverywardid = $scope.selectedWard.wardid;
        $scope.order.isdraff = false;
        var data = {
            order: $scope.order,
            goods : $scope.goods,            
        };

        if($scope.order.ordertypeid == 1){
            dataService.postDataServer(urlBase,data);
        }else if($scope.order.ordertypeid == 2){
            $rootScope.findExpressShipper(data.order, data.goods);
        }
    }

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
            if(listInDistrictId.indexOf(districtId)>-1){
                overWeightFee = (totalWeight - 4000)*2*2;
            }else {
                overWeightFee = (totalWeight - 4000)*2*2.5;
            }
            
        }

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

        return fee;
    }

    $scope.updateFee = function(){
        $scope.order.fee = calculateFee($scope.selectedDistrict,$scope.order.ordertypeid);
    }


    function GenerateRandomCode(length){
        var code = "";
        var chars = "123456789";
        for( var i=0; i < length; i++ )
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        return code;
    }

    function getStoreName(){
        var urlBase = config.baseURI + '/api/getAllStoreName';
        dataService.getDataServer(urlBase)
            .then(function (rs) {
                $scope.stores = rs.data;
                $scope.order.storeid = $scope.stores[0].storeid;
                $scope.order.pickupaddress = $scope.stores[0].address;
                $scope.order.pickupphone = $scope.stores[0].phonenumber;
                $scope.selectedStore =  $scope.stores[0];
            })
            
    }
    $scope.listProvince = []    
    function getProvince () {
        var urlBase = config.baseURI + '/api/getProvince';
        dataService.getDataServer(urlBase)
            .then(function (rs) {                
                $scope.addressDB = rs.data;
                $scope.listProvince = $scope.addressDB.slice(0,1);
                $scope.selectedProvince = $scope.listProvince[0];

                $scope.listDistrict = $scope.selectedProvince.districts;
                $scope.selectedDistrict = $scope.listDistrict[0];

                $scope.listWard = $scope.selectedDistrict.wards;
                $scope.selectedWard = $scope.listWard[0];
                updateDeliveryAdd();
            })
    }

    $scope.updateDistrict= function(){
        $scope.selectedProvince;
        $scope.listDistrict = $scope.selectedProvince.districts;
        $scope.selectedDistrict = $scope.listDistrict[0];

        $scope.listWard = $scope.selectedDistrict.wards;
        $scope.selectedWard = $scope.listWard[0];

        updateDeliveryAdd();
        
    }
    $scope.updateWard= function(){

        $scope.selectedDistrict;
        $scope.listWard = $scope.selectedDistrict.wards;
        $scope.selectedWard = $scope.listWard[0];
        updateDeliveryAdd();
        $scope.order.fee = calculateFee($scope.selectedDistrict.districtid,$scope.order.ordertypeid);
        $scope.order.overWeightFee = calculateOverWeightFee($scope.selectedDistrict.districtid,$scope.goods);
     }
    $scope.updateDeliveryAdd = function(){
        updateDeliveryAdd();
     }

    function updateDeliveryAdd(){
        $scope.fulldeliveryaddress = $scope.order.deliveryaddress + ", " + $scope.selectedWard.name + ", " + $scope.selectedDistrict.name + ", " + $scope.selectedProvince.name;        
     }
    


}

storeOrderController.$inject = ['$scope', 'dataService', 'config','socketService','socketStore','$rootScope'];
angular.module('app').controller('storeOrderController', storeOrderController);

