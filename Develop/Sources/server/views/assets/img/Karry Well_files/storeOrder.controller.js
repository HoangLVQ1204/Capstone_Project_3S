/**
 * Created by khanhkc on 9/22/15.
 */

function storeOrderController($scope, $state, dataService, config) {
    getStoreName();
    $scope.order={
        gatheringCode: GenerateRandomCode(6),
        deliverCode: GenerateRandomCode(6),
        inStockCode : GenerateRandomCode(6),
        returnStoreCode : GenerateRandomCode(6),
        storeid: '',
        ordertypeid: "2",
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
        fee: '',
        cod:''
    };
    var bigestGoodId = 0;
    $scope.good={};
    $scope.goods =[];


    $scope.$watch('$viewContentLoaded', function (event) {
        caplet();

        ///////////////////////////////////////////////////
        //////////....Animation for wizard..../////////////
        ///////////////////////////////////////////////////
        $(document).ready(function () {            

            $('#validate-wizard').bootstrapWizard({
                tabClass: "nav-wizard",
            ////////////////////////////////////////////////
            /////////////Validate when click submit/////////
            ////////////////////////////////////////////////
            /* 
               onNext: function (tab, navigation, index) {
                console.log(index);
                if (index == 3)
                {
                    var tab = $('#step' + index); 
                    
                        var valid = true;
                        //if (!valid) onTabShow()
                        valid = $('#step1').parsley('validate') && valid;
                        valid = $('#step2').parsley('validate') && valid;
                        valid = $('#step3').parsley('validate') && valid;
                        console.log(valid);
                        if (!valid) {
                            //onTabShow(tab, navigation, i);
                             // $('#step' + i).addClass('active');
                             // $('#step3').removeClass('active');
                             // tab.prevAll().addClass('completed');
                             //    tab.nextAll().removeClass('completed');
                             //    if (tab.hasClass("active")) {
                             //        tab.removeClass('completed');
                             //    }
                            return false;
                        }else{
                            postCompleteOrder ();
                        }
                    
                        
                    
                    // Set the name for the next tab
                    $('#step4 h3').find("span").html($('#fullname').val());

                }
            }, */
            ////Validate when click submit/////

                onNext: function(tab, navigation, index) {
                    if(index==1){
                        var content=$('#step'+index); 
                                console.log(content) ;                                 
                                    if(typeof  content.attr("parsley-validate") != 'undefined'){
                                        var $valid = content.parsley( 'validate' );                                        
                                            if(!$valid ){
                                                return false;
                                            }
                                        
                                        }
                    }
                    if(index==2){
                        var content=$('#step'+index); 
                                console.log(content) ;                                 
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
                        console.log(content) ;
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
                editGood()
                $('#md-edit-good').modal('hide');              
            }

        });
        
        //iCheck[components] validate
        $('input').on('ifChanged', function(event){
            $(event.target).parsley( 'validate' );
        });
        ///Validate edit Modal//////
        
            handleStatusChanged();

        });
        

    function postCompleteOrder (){
        var urlBase = config.baseURI + '/orders';
        $scope.order.isdraff = false;
        var data = {
            order: $scope.order,
            goods : $scope.goods,
        };
        console.log("==============data=========",data);
        dataService.postDataServer(urlBase,data);

    }
        ///////////////////////////////////////////////////
        //....Disable textbox when click on checkbox....///
        ///////////////////////////////////////////////////
        function handleStatusChanged() {
            $('#enElementCb').on('change', function () {
                if (!$('#enElementCb').is(':checked')) {
                    $('#elementsToEn :input').attr('disabled', true);
                } else {
                    $('#elementsToEn :input').removeAttr('disabled');
                }
            });
        }

        

    });
    //getDataFromServer();
    $scope.newGood = {};
    var index;
    $scope.setGood = function(good,index){
        console.log("=======goods[]=khi click edit====",$scope.goods);
        $scope.newGood = (JSON.parse(JSON.stringify(good)));  
        index = index;      
    };

    $scope.refreshGood = function(){
         $scope.good ={};
    }

    function editGood () {
        // // $scope.good =  $scope.newGood;
        // //
        // console.log("=======newGood=====",$scope.newGood);
        // console.log("=======goog=====",$scope.good);
        // console.log("=======goods[]=sau khi an save====",$scope.goods);
       //console.log("======na====",na);
       for(var i = 0; i < $scope.goods.length;i++){
        if( $scope.goods[i].goodID===$scope.newGood.goodID){
            // console.log("=======good tim thay====",$scope.goods[i].goodID);
            $scope.goods[i] = $scope.newGood;
            // console.log("=======good sau khi thay====",$scope.goods[i]);
        }

       }
$scope.$apply();

    }

    function addGood(){
        $scope.good.goodID = bigestGoodId;        
        $scope.goods.push($scope.good);
        $scope.$apply();
        bigestGoodId++;
        console.log("=======goods[]=sau khi add====",$scope.goods);
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
        console.log("================data===============",data);
        dataService.postDataServer(urlBase,data);

    };    

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
                console.log("================",rs); 
                $scope.order.storeid = $scope.stores[0].storeid;
                $scope.order.pickupaddress = $scope.stores[0].address;
                $scope.order.pickupphone = $scope.stores[0].phonenumber;
                $scope.selectedStore =  $scope.stores[0];
            })
            .error(function (error) {
                console.log('Unable to load store name: ' + error);
            });
    }
    function alertEmptyGood() {
            var data = new Object();
            data.verticalEdge = 'right';
            data.horizontalEdge = 'bottom';
            data.theme = 'theme';
            $.notific8($("#smsEmptyGood").val(), data);
            console.log("=======OK=====");
    }
        
    

}


storeOrderController.$inject = ['$scope', '$state', 'dataService', 'config'];
angular.module('app').controller('storeOrderController', storeOrderController);

