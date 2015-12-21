/**
 * Created by hoanglvq on 10/26/15.
 */


function socketAdmin(socketService,authService,mapService, $rootScope, notificationService, dataService, config){

    var EPSILON = 1e-8;            

    var currentLocation = null;

    var api = {};

    api.listShippers = [];
    api.listOnlineShipper = [];

    $rootScope.unreadMail = 0;

    getUnreadMail();
    /*
        add handlers
    */

    function updateListShipper(data){
        api.listShippers = data;
        api.listOnlineShipper = [];
        data.map(function (shipper) {

            if (shipper.isConnected) api.listOnlineShipper.push(shipper);

        });
    }

    socketService.on('admin:register:location', function(data) {
        mapService.setMapData(data.msg.mapData);
        if (data.msg.shipperList != null) updateListShipper(data.msg.shipperList);
        $rootScope.$emit("admin:dashboard:getShipperList", data.msg.shipperList);
    });

    socketService.on('admin:issue:notification', function(data) {
        getUnreadMail().then(function () {
            $rootScope.$emit("admin:issue:newIssue", data.msg);
            $rootScope.$emit("shipper:change:order:status", data.msg);
            $rootScope.$emit("shipper:change:task:status", data.msg);
        });
        //$rootScope.$emit("admin:issue:newIssue", data.msg);
        $rootScope.notify(data.msg.notification, 1);
    });

    socketService.on('admin::issue:disconnected', function(data) {
        getUnreadMail().then(function () {
            $rootScope.$emit("admin:issue:newIssue", data.msg);
            $rootScope.$emit("shipper:change:order:status", data.msg);
            $rootScope.$emit("shipper:change:task:status", data.msg);
        });
        //$rootScope.$emit("admin:issue:newIssue", data.msg);

        $rootScope.notify(data.msg, 1);
    });

    socketService.on('admin::issue:cancelorder', function(data) {
        getUnreadMail().then(function () {
            $rootScope.$emit("admin:issue:newIssue", data.msg);
            $rootScope.$emit("shipper:change:order:status", data.msg);
            $rootScope.$emit("shipper:change:task:status", data.msg);
        });
        $rootScope.notify(data.msg, 1);
    });

    socketService.on('shipper:change:order:status',function(data){
        $rootScope.$emit("shipper:change:order:status", data.msg);
        console.log('change order status');
        //$rootScope.notify(data.msg, 1);
    });

    socketService.on('shipper:change:task:status',function(data){
        $rootScope.$emit("shipper:change:task:status", data.msg);
        console.log('change task status');
        //$rootScope.notify(data.msg, 1);
    });

    socketService.on('shipper:change:task:active',function(data){
        console.log(data);
        $rootScope.$emit("shipper:change:task:active", data);
        console.log('change task active');
        //$rootScope.notify(data.msg, 1);
    });

    api.getCurrentUser = function() {
        var currentUser = authService.getCurrentInfoUser();        

        var dataAdmin = {
            adminID: currentUser.username
        };
        return dataAdmin;
    };

    api.registerSocket = function(){
        socketService.authenSocket();
        var user = api.getCurrentUser();
        // console.log('registerSocket', user);
        socketService.sendPacket(
        {
            type: 'admin',
            clientID: user.adminID
        },
        'server',
        {
            admin: user
        },
        'client:register');
    };

    api.issueMessage = function (issue) {//send message after resolve issue
        //var shipperList = [
        var orderList = [];
        var msgToStore = {
            type: 'info',
            title: 'Info',
            //content: msg,
            url: '#/store/dashboard',
            isread: false,
            createddate: new Date()
        };

        issue.orderissues.map(function (orderissue) {
            var order = new Object();
            order['storeid'] = orderissue.order.storeid;
            order['orderid'] = orderissue.order.orderid;
            orderList.push(order);
        })
        var user = api.getCurrentUser();
        socketService.sendPacket(
            {
                type: 'admin',
                clientID: user.adminID
            },
            'server',
            {
                orderList: orderList,
                shipperid: issue.orderissues[0].order.tasks[0].shipperid,
                typeid: issue.typeid,
                msg: msgToStore
            },
            'admin:messageIssue');
    };


    api.confirmPaymentMessage = function (storeid, newLedgerID) {//send message after confirm payment
        //var shipperList = [
        var msgToStore = {
            type: 'info',
            title: 'Info',
            content: 'A new transaction with id '+ newLedgerID +' was created by KarryWell, please check it...',
            url: '#/store/transactionHistory',
            isread: false,
            createddate: new Date()
        };
        var user = api.getCurrentUser();
        socketService.sendPacket(
            {
                type: 'admin',
                clientID: user.adminID
            },
            'server',
            {
                storeid: storeid,
                msg: msgToStore
            },
            'admin:message:confirmPayment');
    };

    api.blockStoreMessage = function (storeid, type, reason) {//send message after confirm payment
        //var shipperList = [
        var content = "";
        if (type == 1) content = "Your store is blocked because "+ reason +"... please contact them for get more information...";
          else content = "Your store is unblocked...";
        var msgToStore = {
            type: 'info',
            title: 'Info',
            content: content,
            url: '#/store/transactionHistory',
            isread: false,
            createddate: new Date()
        };
        var user = api.getCurrentUser();
        socketService.sendPacket(
            {
                type: 'admin',
                clientID: user.adminID
            },
            'server',
            {
                storeid: storeid,
                msg: msgToStore
            },
            'admin:notification:blockStore');
    };

    api.taskNotification = function (shipperList) {//send message after confirm payment
        //var shipperList = [

        var msgToStore = {
            type: 'info',
            title: 'Info',
            content: 'New task update',
            url: '#/store/transactionHistory',
            isread: false,
            createddate: new Date()
        };
        var user = api.getCurrentUser();
        socketService.sendPacket(
            {
                type: 'admin',
                clientID: user.adminID
            },
            'server',
            {
                shipperList: shipperList,
                msg: msgToStore
            },
            'admin:notification:newTask');
    };

    function getUnreadMail() {
        $rootScope.unreadMail=0;
        return dataService.getDataServer(config.baseURI + "/api/getAllIssue").then(function(response){
            var issueList = response.data;

            issueList.map(function (issue) {
                if (!issue.isresolved) $rootScope.unreadMail++;
            });

        });
    }

    return api;

}


socketAdmin.$inject = ['socketService','authService','mapService', '$rootScope','notificationService','dataService','config'];

angular.module('app').factory('socketAdmin', socketAdmin);