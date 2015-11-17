/**
 * Created by khanhkc on 9/22/15.
 */

function storeOrderController($scope, dataService, config, socketService, socketStore) {
    getStoreName();
    getProvince ();
    $scope.order={
        gatheringCode: GenerateRandomCode(6),
        deliverCode: GenerateRandomCode(6),
        inStockCode : GenerateRandomCode(6),
        returnStoreCode : GenerateRandomCode(6),
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
    $scope.houseNumber="";


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
                        //console.log(content) ;
                        if(typeof  content.attr("parsley-validate") != 'undefined'){
                            var $valid = content.parsley( 'validate' );
                            if(!$valid ){
                                return false;
                            }

                        }
                    }
                    if(index==2){
                        var content=$('#step'+index);
                        //console.log(content) ;
                        if(typeof  content.attr("parsley-validate") != 'undefined'){
                            var $valid = content.parsley( 'validate' );
                            if(!$valid){
                                return false;
                            }else if($scope.goods.length==0){
                                alertEmptyGood();
                                return false;
                            }
                        }
                    }
                    if(index==3){
                        // console.log(content) ;
                        postCompleteOrder ();
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

            //////////////////////////////////////
            //////// Validate Add Modal///////////
            //////////////////////////////////////
            $("#addGoodModal").submit(function(e){
                e.preventDefault();
                if($(this).parsley( 'validate' )){
                    addGood();
                    $scope.order.overWeightFee = calculateOverWeightFee($scope.selectedDistrict.districtid,$scope.goods);
                    $scope.$apply();                                    
                    $('#md-add-good').modal('hide');
                }
            });

            //iCheck[components] validate
            $('input').on('ifChanged', function(event){
                $(event.target).parsley( 'validate' );
            });
            //Validate Add Modal//


            //////////////////////////////////////
            //////// Validate Edit Modal///////////
            //////////////////////////////////////
            $("#editGoodModal").submit(function(e){
                e.preventDefault();
                if($(this).parsley( 'validate' )){
                    editGood();
                    $scope.order.overWeightFee = calculateOverWeightFee($scope.selectedDistrict.districtid,$scope.goods);
                    $scope.$apply(); 
                    $('#md-edit-good').modal('hide');
                }

            });

            //iCheck[components] validate
            $('input').on('ifChanged', function(event){
                $(event.target).parsley( 'validate' );
            });
            ///Validate edit Modal//////

            // handleStatusChanged();

        });


        ///////////////////////////////////////////////////
        //....Disable textbox when click on checkbox....///
        ///////////////////////////////////////////////////
        // function handleStatusChanged() {
        //     $('#enElementCb').on('change', function () {
        //         if (!$('#enElementCb').is(':checked')) {
        //             $('#elementsToEn :input').attr('disabled', true);
        //         } else {
        //             $('#elementsToEn :input').removeAttr('disabled');
        //         }
        //     });
        // }
    });

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

    $scope.postDraff = function(){
        var urlBase = config.baseURI + '/orders';
        $scope.order.isdraff = true;
        var data = {
            order: $scope.order,
            goods : $scope.goods,
        };
        //console.log("================data===============",data);
        dataService.postDataServer(urlBase,data);

    };

    function loading(){
        var overlay=$('<div class="load-overlay"><div><div class="c1"></div><div class="c2"></div><div class="c3"></div><div class="c4"></div></div><span>Finding Shipper...</span><button class="btn btn-theme-inverse">Cancel</button></div>');
        $("body").append(overlay);
        overlay.css('opacity',3).fadeIn("slow");
    }

    function unloading(){
        $("body").find(".load-overlay").fadeOut("slow",function(){ $(this).remove() });
    }

    var flag = false;

    $scope.listRightShippers = [];

    socketService.on('store:find:shipper', function(data) {

        var shipper = data.msg.shipper;
        if(!shipper){
            flag = true;
        }else{
            $scope.listRightShippers.push(shipper);
        }
    });

    function findExpressShipper(){
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
    }

    $scope.createExpressOrder = function(){
        var urlBaseOrder = config.baseURI + '/orders';
        var urlBaseTask = config.baseURI + '/api/createTask';

        $scope.order.isdraff = false;
        var dataOrder = {
            order: $scope.order,
            goods: $scope.goods
        }

        dataService.postDataServer(urlBaseOrder,dataOrder)
            .then(function(res){
                var orderID = res.data.orderid;

                console.log("---DATA ORDER ID---");
                console.log(orderID);
                console.log("---DATA ORDER ID---");

                var dataTask = {
                    orderid: orderID,
                    shipperid: $scope.rightShipper.shipperID,
                    adminid: null,
                    statusid: 2,
                    typeid: 3
                }
                dataService.postDataServer(urlBaseTask,dataTask)
                    .then(function(res){
                        if(res.status != 500){
                            var temp = {
                                type: '',
                                title: 'EXPRESS ORDER: SUCCESS',
                                content: 'ORDER ID: '+orderID+ 'created successfully',
                                url: '/#/notiListdemo',
                                isread: false,
                                createddate: new Date()
                            };
                            $rootScope.notify(temp);
                        }else{
                            var temp = {
                                type: 'issue',
                                title: 'EXPRESS ORDER: FAIL',
                                content: 'ORDER ID: '+orderID+ 'created fail! Please try again late!',
                                url: '/#/notiListdemo',
                                isread: false,
                                createddate: new Date()
                            };
                            $rootScope.notify(temp);
                        }
                    })
            })


    }


    function postCompleteOrder (){
        var urlBase = config.baseURI + '/orders';
        $scope.order.isdraff = false;
        var data = {
            order: $scope.order,
            goods : $scope.goods,
            selectedDistrict: $scope.selectedDistrict.districtid
        };
        //console.log("==============data=========",data);


        if($scope.order.ordertypeid == 1){
            dataService.postDataServer(urlBase,data);
        }else if($scope.order.ordertypeid == 2){
            findExpressShipper();
        }
    }

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
               // console.log("=============IN=======",districtId);
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
        $scope.order.overWeightFee = calculateOverWeightFee($scope.selectedDistrict.districtid,$scope.goods);
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


}


storeOrderController.$inject = ['$scope', 'dataService', 'config','socketService','socketStore'];
angular.module('app').controller('storeOrderController', storeOrderController);

