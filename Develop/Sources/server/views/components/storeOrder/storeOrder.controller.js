/**
 * Created by khanhkc on 9/22/15.
 */

function storeOrderController($scope, $state, dataService, config) {
    getStoreName();
    $scope.order={
        gatheringCode: GenerateRandomCode(6),
        deliverCode: GenerateRandomCode(6),
        inStockCode : GenerateRandomCode(6),
        outStockCode : GenerateRandomCode(6),
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
    $scope.good={goodID:0};
    $scope.goods =[];


    $scope.$watch('$viewContentLoaded', function (event) {
        caplet();

        ///////////////////////////////////////////////////
        //////////....Animation for wizard..../////////////
        ///////////////////////////////////////////////////
        $(document).ready(function () {            

            $('#validate-wizard').bootstrapWizard({
                tabClass: "nav-wizard",
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

            handleStatusChanged();

        });

    function postCompleteOrder (){
        var urlBase = config.baseURI + '/orders';
        $scope.order.isdraff = false;
        var data = {
            order: $scope.order,
            goods : $scope.goods,
        };
        console.log(data);
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

        ///////////////////////////////////////////////////
        //....Validate Form...///
        ///////////////////////////////////////////////////    

        $("#alidate-wizard").submit(function(e){
            e.preventDefault();
            alert("send");
            if(!$(this).parsley( 'validate' )){
                alert("send");
            }
        });
        
        //iCheck[components] validate
        $('input').on('ifChanged', function(event){
            $(event.target).parsley( 'validate' );
        });  

    });
    //getDataFromServer();

    $scope.setGood = function(good){
        $scope.good = good;
    };

    $scope.editGood = function(){
        $scope.good = {goodID:$scope.good.goodID};
    };

    $scope.addGood = function(){
        $scope.goods.push($scope.good);
        $scope.good.goodID++;
        $scope.good = {};
    };

    $scope.deleteGood = function(goodID){
        $scope.goods.splice(goodID,1);
    };

    $scope.postDraff = function(){
        var urlBase = config.baseURI + '/orders';
        $scope.order.isdraff = true;
        var data = {
            order: $scope.order,
            goods : $scope.goods,
        };
        console.log(data);
        dataService.postDataServer(urlBase,data);

    };
    // $scope.postCompleteOrder = function(){
    //     var urlBase = config.baseURI + '/orders';
    //     $scope.order.isdraff = false;
    //     var data = {
    //         order: $scope.order,
    //         goods : $scope.goods,
    //     };
    //     console.log(data);
    //     dataService.postDataServer(urlBase,data);

    // };

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
            })
            .error(function (error) {
                console.log('Unable to load store name: ' + error);
            });
    }

}


storeOrderController.$inject = ['$scope', '$state', 'dataService', 'config'];
angular.module('app').controller('storeOrderController', storeOrderController);

