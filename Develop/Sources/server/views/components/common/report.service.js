function reportService(config,dataService){

    /* This function use to get data order express/normal from server */
    function getExNoFromServer() {
        var urlBase = config.baseURI + '/api/admin/report/orderCount';

        return  dataService.getDataServer(urlBase)
                .then(function (rs) {
                    console.log("---URL REPORT---");
                    console.log(urlBase);
                    console.log("---URL REPORT---");
                    return rs.data;
                })
    }

    /* This function use to get data order complete/cancel from server */
    function getComCanFromServer(){
        var urlBase = config.baseURI + '/api/admin/report/storeOrderCount';
        return dataService.getDataServer(urlBase)
            .then(function (rs) {
              	return rs.data;
            })
    }

    /* This function use to get COD/Fee from server */
    function getCodFeeFromServer(){
        var urlBase = config.baseURI + '/api/admin/report/moneyCount';
        return dataService.getDataServer(urlBase)
            .then(function (rs) {
                return rs.data;
            })       
    }

    function getDataOverView(){
        var urlBase = config.baseURI + '/api/admin/report/overView';
        return dataService.getDataServer(urlBase)
                .then(function(rs){
                    return rs.data;
                });
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
    	getDataOverView: getDataOverView,
        get10: 1
    }
}

reportService.$inject = ['config','dataService'];

angular.module('app').factory('reportService', reportService);
