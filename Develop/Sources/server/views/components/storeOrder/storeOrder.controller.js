/**
 * Created by khanhkc on 9/22/15.
 */

function storeOrderController($scope, $state, dataService, config,socketService,socketStore) {
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
                                                alertEmptyGood();
                                                return false;   
                                            } 
                                        }
                    } 
                    if(index==3){
                        postCompleteOrder();
                    }
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

            $("#addGoodModal").submit(function(e){
                e.preventDefault();
                if($(this).parsley( 'validate' )){
                    addGood();
                    $('#md-add-good').modal('hide');
                }
            });

            $('input').on('ifChanged', function(event){
                $(event.target).parsley( 'validate' );
            });

            $("#editGoodModal").submit(function(e){
                e.preventDefault();
                if($(this).parsley( 'validate' )){
                    editGood()
                    $('#md-edit-good').modal('hide');
                }

            });

            $('input').on('ifChanged', function(event){
                $(event.target).parsley( 'validate' );
            });

            handleStatusChanged();
        });
    });

    $scope.listRightShippers = [];

    var flag = false;

    socketService.on('store:find:shipper', function(data) {
        var shipper = data.msg.shipper;
        if(!shipper){
            flag = true;
        }else{
            $scope.listRightShippers.push(shipper);
        }
    });

    function loading(){
        var overlay=$('<div class="load-overlay"><div><div class="c1"></div><div class="c2"></div><div class="c3"></div><div class="c4"></div></div><span>Finding Shipper...</span><button class="btn btn-theme-inverse">Cancel</button></div>');
        $("body").append(overlay);
        overlay.css('opacity',3).fadeIn("slow");
    }

    function unloading(){
        $("body").find(".load-overlay").fadeOut("slow",function(){ $(this).remove() });
    }

    function findCloseShipper(){
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
        var rightShipper = $scope.rightShipper;
        var urlOrder = config.baseURI + '/orders';
        $scope.order.statusid = '2';
        var data = {
            order: $scope.order,
            goods : $scope.goods
        };
        dataService.postDataServer(urlOrder,data);
        
    }

    function postCompleteOrder(){

        var typeOrder = $scope.order.ordertypeid;
        var urlBase = config.baseURI + '/orders';
        $scope.order.isdraff = false;
        var data = {
            order: $scope.order,
            goods : $scope.goods
        };

        if(typeOrder == 1){
            dataService.postDataServer(urlBase,data);
        }
        else if(typeOrder == 2){
            findCloseShipper();
        }

    }





    function handleStatusChanged() {
        $('#enElementCb').on('change', function () {
            if (!$('#enElementCb').is(':checked')) {
                $('#elementsToEn :input').attr('disabled', true);
            } else {
                $('#elementsToEn :input').removeAttr('disabled');
            }
        });
    }




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
        console.log("=======goods[]=sau khi add====",$scope.goods);
    }

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
    }

}


storeOrderController.$inject = ['$scope', '$state', 'dataService', 'config','socketService','socketStore'];
angular.module('app').controller('storeOrderController', storeOrderController);

