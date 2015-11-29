/**
 * Created by hoanglvq on 9/22/15.
 */

/* Script */
angular.module('app', [
    'ui.router',
    'angular-jwt',
    'nemLogging',
    'uiGmapgoogle-maps',
	'smart-table'
]).constant("config",{

    role: {
        shipper: 1,
        store: 2,
        admin: 3
    },

    baseURI: ""

}).config(function($stateProvider,$urlRouterProvider,$httpProvider,jwtInterceptorProvider,uiGmapGoogleMapApiProvider,config){

     //Set up Routes

    $urlRouterProvider.otherwise('/error');

    $stateProvider

        .state('home',{
            url: '',
            template: '<h1>Home Page đang trong quá trình xây dựng !!!!</h1>',
        })

        .state('login',{
            url: '/auth/login',
            template: '<login></login>'
        })

        .state('register',{
            url: '/register',
            template: '<store-register></store-register>'
        })

        .state('error',{
            url: '/error',
            templateUrl: '/components/404/error.html'
        })


        .state('admin',{
            abstract: true,
            url: '/admin',
            template: '<admin></admin>',
            access: config.role.admin
        })

        .state('admin.dashboard',{
            url: '/dashboard',
            template: '<admin-layout></admin-layout>',
            controller: function($scope, $rootScope, mapService, authService){
                var mode = { type: "all" };
                var count = 0;
                 var intervalID = setInterval(function() {
                    if (count == 2) {
                        clearInterval(intervalID);
                        $rootScope.$apply();
                    }
                    ++count;
                    mapService.setMode(mode);
                 }, 1500);
                $scope.shippers = mapService.getShipperMarkers(mode);
                $scope.stores = mapService.getStoreMarkers(mode);
                $scope.customers = mapService.getCustomerMarkers(mode);
                $scope.orders = mapService.getOrders(mode);
                $scope.zoom = 11;
            },
            access: config.role.admin
        })

        .state('admin.storeList',{
            url: '/storeList',
            template: '<admin-store-list-layout></admin-store-list-layout>',
            controller: function($scope, $rootScope, mapService){
                var mode = { type: "all" };
                var count = 0;
                 var intervalID = setInterval(function() {
                    if (count == 2) {
                        clearInterval(intervalID);
                        $rootScope.$apply();
                    }
                    ++count;
                    mapService.setMode(mode);
                 }, 1500);
                $scope.stores = mapService.getStoreMarkers(mode);
                $scope.zoom = 11;
            },
            access: config.role.admin
        })

        .state('admin.assignTask',{
            url: '/assignTask',
            template: '<admin-assign-task></admin-assign-task>',
            access: config.role.admin
        })

        .state('admin.assignTaskProcessing',{
            url: '/assignTaskProcessing?shipperid',
            template: '<admin-assign-task-processing></admin-assign-task-processing>',
            access: config.role.admin
        })

        .state('admin.transactionHistory',{
            url: '/transactionHistory',
            template: '<admin-transaction-history></admin-transaction-history>',
            access: config.role.admin
        })

        .state('admin.taskList',{
            url: '/taskList',
            template: '<admin-task-list></admin-task-list>',
            access: config.role.admin
        })

        .state('admin.shipperList',{
            url: '/shipperList',
            template: '<admin-shipper-list-layout></admin-shipper-list-layout>',
            controller: function($scope, $rootScope, mapService){
                var mode = { type: "all" };
                var count = 0;
                 var intervalID = setInterval(function() {
                    if (count == 2) {
                        clearInterval(intervalID);
                        $rootScope.$apply();
                    }
                    ++count;
                    mapService.setMode(mode);
                 }, 1500);
                $scope.shippers = mapService.getShipperMarkers(mode);
                $scope.zoom = 11;
            },
            access: config.role.admin
        })

        .state('admin.orderList',{
            url: '/orderList',
            template: '<admin-order-list></admin-order-list>',
            access: config.role.admin
        })

        .state('admin.addShipper',{
            url: '/addShipper',
            template: '<admin-add-shipper></admin-add-shipper>',
            access: config.role.admin
        })

        .state('admin.addStore',{
            url: '/addStore',
            template: '<admin-add-store></admin-add-store>',
            access: config.role.admin
        })

        .state('admin.issueBox',{
            url: '/issueBox',
            template: '<admin-issue-box></admin-issue-box>',
            access: config.role.admin
        })

        .state('admin.issueBox.content',{
            url: '/content?issueid',
            template: '<issue-content></issue-content>',
            //parent: 'admin.issueBox',
            access: config.role.admin
        })

        .state('admin.userDetail',{
            url: '/userDetail?username',
            template: '<admin-user-detail></admin-user-detail>',
            //parent: 'admin.issueBox',
            access: config.role.admin
        })

        .state('admin.storeDetail',{
            url: '/storeDetail?storeid',
            template: '<admin-store-detail></admin-store-detail>',
            //parent: 'admin.issueBox',
            access: config.role.admin
        })

        .state('admin.acceptStore',{
            url: '/acceptStore',
            template: '<admin-accept-store></admin-accept-store>',
            access: config.role.admin
        })

        .state('admin.notification',{
            url: '/notification',
            template: '<notification-list></notification-list>',
            access: config.role.admin
        })

        .state('store',{
            abstract: true,
            url: '/store',
            template: '<store></store>',
            access: config.role.store
        })

        .state('store.dashboard',{
             url: '/dashboard',
             template: '<layout></layout>',
             controller: function($scope, $rootScope, mapService, authService){
                 var mode = { type: "all" };
                 var count = 0;
                 var intervalID = setInterval(function() {
                    if (count == 2) {
                        clearInterval(intervalID);
                        $rootScope.$apply();
                    }
                    ++count;
                    mapService.setMode(mode);
                 }, 1500);
                // mapService.setMode(mode);
                 $scope.shippers = mapService.getShipperMarkers(mode);
                 $scope.stores = mapService.getStoreMarkers(mode);
                 $scope.customers = mapService.getCustomerMarkers(mode);
                 $scope.orders = mapService.getOrders(mode);
                 $scope.center = {
                     latitude: authService.getCurrentInfoUser().stores[0].latitude,
                     longitude: authService.getCurrentInfoUser().stores[0].longitude
                 }
             },
            access: config.role.store
        })

        .state('store.order',{
            url: '/order',
            template: '<store-order></store-order>',
            access: config.role.store
        })

        .state('store.orderdetail',{
             url: '/orderdetail?orderid',
             template: '<store-order-detail-layout></store-order-detail-layout>',
             controller: function($scope, $rootScope, mapService, authService, $stateParams){
                 var mode = { type: 'orderdetail', orderID: $stateParams.orderid };
                 var count = 0;
                 var intervalID = setInterval(function() {
                    if (count == 2) {
                        clearInterval(intervalID);
                        $rootScope.$apply();
                    }
                    ++count;
                    mapService.setMode(mode);
                 }, 1500);
                // mapService.setMode(mode);
                 $scope.shippers = mapService.getShipperMarkers(mode);
                 $scope.stores = mapService.getStoreMarkers(mode);
                 $scope.customers = mapService.getCustomerMarkers(mode);
                 $scope.orders = mapService.getOrders(mode);
                 console.log('controller state', $scope.shippers, $scope.stores, $scope.customers, $scope.orders);
                 $scope.center = {
                     latitude: authService.getCurrentInfoUser().stores[0].latitude,
                     longitude: authService.getCurrentInfoUser().stores[0].longitude
                 }
             },
            access: config.role.store
        })

        .state('store.notification',{
            url: '/notification',
            template: '<notification-list></notification-list>',
            access: config.role.store
        })

        .state('store.transactionHistory',{
            url: '/transactionHistory',
            template: '<store-transaction-history></store-transaction-history>',
            access: config.role.store
        })

        .state('store.orderHistory',{
            url: '/orderHistory',
            template: '<store-order-history></store-order-history>',
            access: config.role.store
        })

        .state('store.storeProfile',{
            url: '/storeProfile',
            template: '<store-profile></store-profile>',
            access: config.role.store
        })

        .state('admin.adminReport',{
            url: '/adminReport',
            template: '<admin-report></admin-report>',
            resolve: {
                
                     dataExNo: function($http,config, reportService){
                         return reportService.getExNoFromServer();
                     },
                     dataComCan: function($http,config, reportService){
                         return reportService.getComCanFromServer();
                     },
                     dataCodFee: function($http,config, reportService){
                         return reportService.getCodFeeFromServer();
                     },
                     dataOverView: function($http,config, reportService){
                         return reportService.getDataOverView();
                     }
                
            },
            controller: function($scope,dataExNo,dataComCan,dataCodFee,dataOverView){
                $scope.dataChart = {
                    dataExNo    : dataExNo,
                    dataComCan  : dataComCan,
                    dataCodFee  : dataCodFee,
                    dataOverView: dataOverView
                }               
            },
            access: config.role.admin
        })


    jwtInterceptorProvider.tokenGetter = function(){
        return localStorage.getItem('EHID');
    };

    $httpProvider.interceptors.push('jwtInterceptor');

    uiGmapGoogleMapApiProvider.configure({
        key: 'AIzaSyD8_7oskfESbIw6fpTmYG9h68cRONrjCPc',
        v  : '3.20',
        libraries: 'geometry,visualization,drawing,places'
    })

}).run(function($rootScope,$state,authService,config,socketStore,socketAdmin,socketShipper,socketService, notificationService, dataService){



    //$rootScope.onlineShipper = 0;
    //$rootScope.unreadMail = 0;
    $rootScope.readNewNoti = function(notification) {
        var urlBase = config.baseURI + '/api/notifications/' + notification.notificationid;     
        // console.log('readNotification', urlBase);
        dataService.putDataServer(urlBase, notification)
        .then(function(data) {
            // console.log('press notification', data.data);
            if ($state.current.name == 'store.notification' || $state.current.name == 'admin.notification') {
                $state.go($state.current.name, {}, { reload: true });
            }            
        });
    };

    $rootScope.displayNotification = function(notification) {
        var data = {
            life: 5000,
            horizontal: 'bottom',
            horizontalEdge: 'bottom',
            verticalEdge: 'right',
            theme: (notification.type === 'issue' ? 'danger' : 'success')
        };                
        var template = '<div class="btn" id="noti' + notification.notificationid + '" onclick="location.href=\'' + notification.url + '\'">' +
                '<h4 style="color: white"><strong>' + notification.title + '</strong></h4>' +
                '<span style="color: white">' + notification.content + '</span>'
                '</div>';        
        $.notific8(template, data);
        console.log('current $state', $state.current.name);
        $('#noti' + notification.notificationid).on('click', function() {
            // console.log('notification.notificationid', notification.notificationid);
            if (notification.notificationid) {
                $rootScope.readNewNoti(notification);
            }
        });
        if ($state.current.name == 'store.notification' || $state.current.name == 'admin.notification') {
            $state.go($state.current.name, {}, { reload: true });
        }

        //$rootScope.$apply();
        setTimeout(function () {
            $rootScope.$apply();
        }, 2000);
    };

    $rootScope.notify = function(notification, type) {
        if (type) {
            if (type == 1) {    // Update unread notification
                $rootScope.numberUnreadNoti += 1;
                notificationService.setTotalUnreadNotifications($rootScope.numberUnreadNoti);
                $rootScope.displayNotification(notification);
            } else if (type == 2) { // Update unread notification + Database
                $rootScope.numberUnreadNoti += 1;
                notificationService.setTotalUnreadNotifications($rootScope.numberUnreadNoti);    
                notificationService.addNotification(notification)
                .then(function(data) {
                    notification.notificationid = data.data.notificationid;
                    $rootScope.displayNotification(notification);
                })
            }
        } else {    // type == undefined, only display
            $rootScope.displayNotification(notification);
        }
    };

    // combo functions for express order
    $rootScope.updateExpressOrder = function(orderID, isDraff, statusId) {
        var urlBase = config.baseURI + '/orders/updateExpressOrder';                            
        var order = {};
        order.isDraff = isDraff;
        order.orderId = orderID;
        order.statusId = statusId;
        return dataService.putDataServer(urlBase, {order: order})
            .then(function(res) {
                return null;
            });
    };

    $rootScope.createExpressTask = function(order, shipperID) {

        var urlBaseTask = config.baseURI + '/api/createTask';
        var dataTask = {
            orderid: order.orderID,
            shipperid: shipperID,
            adminid: null,
            statusid: 2,
            typeid: 3
        }

        return dataService.postDataServer(urlBaseTask,dataTask)
            .then(function(res){
                if(res.status != 500){
                    var temp = {
                        type: 'info',
                        title: 'Info: ',
                        content: 'Order '+order.orderID+ ' created successfully.',
                        url: '/#/notiListdemo',
                        isread: false,
                        createddate: new Date()
                    };
                    $rootScope.notify(temp, 2);
                    order.isdraff = false;
                    return order;
                }else{
                    var temp = {
                        type: 'issue',
                        title: 'Error: ',
                        content: 'Order '+order.orderID+ ' created fail.',
                        url: '/#/notiListdemo',
                        isread: false,
                        createddate: new Date()
                    };
                    $rootScope.notify(temp, 2);
                    order.isdraff = true;
                    return order;
                }
            });
    };

    $rootScope.createExpressOrder = function(order, goods, isDraft){
        var urlBaseOrder = config.baseURI + '/orders';        

        order.isdraff = isDraft;
        if (isDraft) order.statusid = null;
        else order.statusid = 2;
        var dataOrder = {
            order: order,
            goods: goods
        }

        return dataService.postDataServer(urlBaseOrder,dataOrder)
            .then(function(res){
                console.log('res.data', res.data);
                var order = res.data;
                var orderID = res.data.orderid;
                order.orderID = orderID;

                if (isDraft) return order;
                else {
                    return $rootScope.createExpressTask(order, $rootScope.rightShipper.shipperID);
                }   
            });
    };

    function loading(){
        var overlay=$('<div class="load-overlay"><div><div class="c1"></div><div class="c2"></div><div class="c3"></div><div class="c4"></div></div><span>Finding Shipper...</span><button id="btnCancelExpress" class="btn btn-theme-inverse">Cancel</button></div>');
        $("body").append(overlay);
        overlay.css('opacity',3).fadeIn("slow");
    }

    function unloading(){
        $("body").find(".load-overlay").fadeOut("slow",function(){ $(this).remove() });
    }

    $rootScope.flag = false;

    $rootScope.listRightShippers = [];

    socketService.on('store:find:shipper', function(data) {

        var shipper = data.msg.shipper;
        if(!shipper){
            $rootScope.flag = true;
        }else{
            $rootScope.listRightShippers.push(shipper);
        }
    });

    $rootScope.findExpressShipper = function(order, goods, inDatabase) {
        socketStore.findShipper();
        loading();
        $('#btnCancelExpress').on('click', function() {
            console.log('btnCancelExpress', order, goods);
            $rootScope.cancelExpress(order, goods, inDatabase);
        });

        var s = 0;
        $rootScope.listRightShippers = [];
        var should = true;
        $rootScope.loopFindShipper = setInterval(function(){            
            if (!should) return;
            // console.log('interval', order, goods);
            if($rootScope.listRightShippers.length != 0){
                $rootScope.rightShipper = $rootScope.listRightShippers[0];
                $rootScope.$apply();
                unloading();
                $("#listAcceptedShipper").modal("show");
                clearInterval($rootScope.loopFindShipper);
                should = false;

                // createExpressOrder + select rightShipper
                if (inDatabase) {
                    $rootScope.updateExpressOrder(order.orderID, false, 2)
                    .then(function() {
                        return $rootScope.createExpressTask(order, $rootScope.rightShipper.shipperID);
                    })
                    .then(function(order) {
                        console.log('app:398 createExpressOrder', order);
                        if (order.isdraff) {
                            socketStore.cancelExpress(order, goods, true);
                        } else {
                            var customer = { geoText: order.customerAddress };
                            console.log('customer', customer);
                            socketStore.selectShipper($rootScope.rightShipper, customer, order.orderID);
                            $state.go('store.dashboard', {}, {reload: true});
                        }
                    });
                } else {
                    $rootScope.createExpressOrder(order, goods, false)
                    .then(function(order) {
                        console.log('app:398 createExpressOrder', order);
                        if (order.isdraff) {
                            socketStore.cancelExpress(order, goods, true);
                        } else {
                            var customer = { geoText: order.customerAddress };
                            console.log('customer', customer);
                            socketStore.selectShipper($rootScope.rightShipper, customer, order.orderID);
                            $state.go('store.dashboard', {}, {reload: true});
                        }
                    })
                }
                return;
            }
            s = s + 1;

            if(s == 60 || $rootScope.flag){
                var temp = {
                    type: 'issue',
                    title: 'Error: ',
                    content: 'Finding Shipper fail.',
                    url: '/#/notiListdemo',
                    isread: false
                };
                $rootScope.notify(temp, 2);

                unloading();
                $rootScope.rightShipper = {
                    avatar: "assets/img/notfound.png"
                };
                $rootScope.$apply();
                $("#listAcceptedShipper_Fail").modal("show");
                clearInterval($rootScope.loopFindShipper);
                $rootScope.flag = false;
                should = false;
                if (inDatabase) {
                    console.log('cannot find shipper, inDatabase');
                } else {
                    $rootScope.createExpressOrder(order, goods, true)
                    .then(function(order) {
                        console.log('Create draft order', order);
                    });
                }        
            }
        },1000);
    };

    $rootScope.cancelExpress = function(order, goods, inDatabase) {
        unloading();
        $rootScope.rightShipper = {
            avatar: "assets/img/notfound.png"
        };
        $rootScope.$apply();
        $("#listAcceptedShipper_Fail").modal("show");
        clearInterval($rootScope.loopFindShipper);
        $rootScope.flag = false;
        socketStore.cancelExpress();
        if (inDatabase) {
            $rootScope.updateExpressOrder(order.orderID, true, null)
            .then(function() {
                console.log('cancelExpress updateExpressOrder');
            })
        } else {
            $rootScope.createExpressOrder(order, goods, true)
            .then(function(order) {
                console.log('Create draft order', order);
            });
        }        
    };

    // END - combo functions

    $rootScope.displayInfoShipper = function(profileShipper,inforOrder){
        $rootScope.inforShipper = {
            profileShipper : profileShipper,
            inforOrder: inforOrder
        }
        $("#displayInforShipper").modal("show");
    }

    if(authService.isLogged()){
        socketService.authenSocket()
        .then(function() {

                if(authService.isRightRole(config.role.admin)){
                    socketAdmin.registerSocket();
                }



                if(authService.isRightRole(config.role.store)){
                    socketStore.registerSocket();

                }

                notificationService.getTotalUnreadNotificationsServer()
                    .then(function() {
                        $rootScope.numberUnreadNoti = notificationService.getTotalUnreadNotifications();
                    });

            })
    }

    $rootScope.$on('$stateChangeStart', function(event, toState, fromState, toParams) {

        if(toState.access){

            if(!authService.isLogged()){
                $state.go("error");
                event.preventDefault();
            }else{

                if(!authService.isRightRole(toState.access)){
                    $state.go("error");
                    event.preventDefault();
                }
            }
        }

        if(toState.name == 'login'){
            if(authService.isLogged()){
                if(authService.isRightRole(config.role.admin)){
                    $state.go('admin.dashboard');
                    event.preventDefault();

                }

                if(authService.isRightRole(config.role.store)){
                    $state.go('store.dashboard');
                    event.preventDefault();
                }
            }
        }

    });


    $rootScope.$on('$stateChangeSuccess', function(e, toState){

        if (toState.name == "login" || toState.name == "home" || toState.name == "error" || toState.name == "register"){
            $rootScope.styleBody = "full-lg";
        }else if(toState.name.indexOf("store") == 0){
            $rootScope.styleBody = "";
        }else{
            $rootScope.styleBody = "leftMenu nav-collapse";
        }

    });
})







