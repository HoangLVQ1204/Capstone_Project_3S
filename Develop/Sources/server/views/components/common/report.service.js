function reportService(config,dataService){

	function getExNoFromServer() {
        var urlBase = config.baseURI + '/api/admin/report/orderCount';
        dataService.getDataServer(urlBase)
            .then(function (rs) {
                return rs.data;
            })
    }

    function getComCanFromServer(){
        var urlBase = config.baseURI + '/api/admin/report/storeOrderCount';
        dataService.getDataServer(urlBase)
            .then(function (rs) {
              	return rs.data;
            })
    }

    function getCodFeeFromServer(){
        var urlBase = config.baseURI + '/api/admin/report/storeOrderCount';
        dataService.getDataServer(urlBase)
            .then(function (rs) {
                return rs.data;
            })       
    }

    function getDateOverView(){
        var urlBase = config.baseURI + '/api/admin/report/overView';
        return dataService.getDataServer(urlBase);
    }
    
    // var dataExNo = [];
    // var dataComCan = [];
    // var dataCodFee = [];
    // var dataOverView = [];

        // var urlBase = config.baseURI + '/api/admin/report/overView';
        // dataService.getDataServer(urlBase)
        //     .then(function (rs) {
        //          console.log("---REPORT");
        //          console.log(rs.data);
        //          return rs.data;   
        //     })
    // getDateOverView().then(function(rs){
    //     console.log("---REPORT");
    //     console.log(rs.data);
    //     return rs.data;
    // })
    // getComCanFromServer().then(function(rs){
    //     console.log("---REPORT");
    //     console.log(rs);
    //     return rs;
    // });
    // getCodFeeFromServer().then(function(rs){ dataCodFee = rs;});
    // getExNoFromServer().then(function(rs){ dataExNo = rs;});
    // getDateOverView().then(function(rs){ dataOverView = rs;});

    return {
    	getExNoFromServer: getExNoFromServer,
    	getComCanFromServer: getComCanFromServer,
    	getCodFeeFromServer: getCodFeeFromServer,
    	getDateOverView: getDateOverView,
        get10: 1
    }
}

reportService.$inject = ['config','dataService'];

angular.module('app').factory('reportService', reportService);
