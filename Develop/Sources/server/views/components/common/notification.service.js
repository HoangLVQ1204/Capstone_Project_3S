







function notificationService($q,$http, config, dataService){

    var api = {};

    var notificationsPerPage = 7;
    var currentPage = 0;    
    var listNotifications = [];
    var totalNumberNotifications = 0;
    var numberNewNotifications = 0;
    var totalUnreadNotifications = 0;
    var pageNumbers = [];

    function enableCurrentPage() {
        for (var i = 0; i < pageNumbers.length; ++i) {
            if (i == currentPage) pageNumbers[i] = true;
            else pageNumbers[i] = false;
        }
    }

    function genPagination() {
        pageNumbers = [];
        for (var i = 0; i < parseInt((totalNumberNotifications + notificationsPerPage - 1) / notificationsPerPage); ++i) {
            pageNumbers.push(false);
        }
        currentPage = 0;
        enableCurrentPage();
    }    

    api.getTotalNumberNotificationsServer = function() {
        var urlBase = config.baseURI + '/api/notifications/total';
        // console.log('getTotalNumberNotificationsServer', urlBase);
        return dataService.getDataServer(urlBase)
        .then(function(data) {    
            // console.log('totalNumberNotifications', data.data);        
            totalNumberNotifications = parseInt(data.data);
            genPagination();            
        });
        // return Promise.resolve();
    };

    api.getTotalNumberNotifications = function() {
        return totalNumberNotifications;
    };

    api.getTotalUnreadNotificationsServer = function() {
        var urlBase = config.baseURI + '/api/notifications/unread';
        // console.log('getTotalUnreadNotificationsServer', urlBase);
        return dataService.getDataServer(urlBase)
        .then(function(data) {            
            totalUnreadNotifications = data.data;
            genPagination();            
        });
        // return Promise.resolve();
    };

    api.getTotalUnreadNotifications = function() {
        return totalUnreadNotifications;
    };

    api.setTotalUnreadNotifications = function(number) {
        totalUnreadNotifications = number;
    };    

    api.getPageNumbers = function() {
        return pageNumbers;
    };

    api.getNumberNewNotifications = function() {
        return numberNewNotifications;
    };

    api.setNumberNewNotifications = function(input) {
        numberNewNotifications = input;
    }

    api.setCurrentPage = function(page) {
        pageNumbers[currentPage] = false;
        pageNumbers[page] = true;
        currentPage = page;        
    };

    api.getCurrentPage = function() {
        return currentPage;
    }

    api.getListNotificationsServer = function() {
        var offset = currentPage * notificationsPerPage;
        var limit = notificationsPerPage;
        var urlBase = config.baseURI + '/api/notifications?offset=' + offset + '&limit=' + limit;
        // console.log('getListNotificationsServer', urlBase);    
        return dataService.getDataServer(urlBase)
        .then(function(data) {        
            // console.log('listNotifications', data.data);    
            listNotifications = data.data;
        });
        // return Promise.resolve();
    };

    api.getListNotifications = function() {
        return listNotifications;
    };

    api.readNotification = function(index) {
        if (listNotifications[index].isread) return;
        totalUnreadNotifications -= 1;
        listNotifications[index].isread = true;
        var urlBase = config.baseURI + '/api/notifications/' + listNotifications[index].notificationid;     
        // console.log('readNotification', urlBase);
        dataService.putDataServer(urlBase, listNotifications[index])
        .then(function(data) {
            console.log('readNotification', data);
        });
    };

    // Move update database to server
    api.addNotification = function(item) {
        var urlBase = config.baseURI + '/api/notifications';
        // console.log('addNotification', urlBase);
        dataService.postDataServer(urlBase, item)
        .then(function(data) {
            console.log('addNotification', data);
        });
    };

    return api;
}

notificationService.$inject = ['$q','$http', 'config', 'dataService'];

angular.module('app').factory('notificationService', notificationService);
