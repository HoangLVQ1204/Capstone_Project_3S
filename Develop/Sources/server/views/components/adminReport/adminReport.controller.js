/**
 * Created by KhanhKC on 19/11/2015.
 */

function adminReportController($scope,$state, $http,dataService, $filter, config, $stateParams) {
    console.log("======xcd======",$scope.dataChart);
    drawCharFirstTimeRun();
    $scope.updateCharOrderByStore = function(){
        $scope.listYearExNo = $scope.selectedStoreExNo.years;
        $scope.selectedYearExNo = $scope.listYearExNo[0];
        var listOrderOfMonthExNo = $scope.selectedYearExNo.months;

        var charid = "#chartExNo";
        var data = getDataForChart(listOrderOfMonthExNo);
        drawChar(data,charid);
    }

    function drawCharFirstTimeRun(){
        
        /* data for "order by month" char - tab "Express/Normal" */    
        $scope.listStore = $scope.dataChart.dataExNo;
        $scope.selectedStoreExNo = $scope.listStore[0];
        $scope.listYearExNo = $scope.selectedStoreExNo.years;
        $scope.selectedYearExNo = $scope.listYearExNo[0];
        var listOrderOfMonthExNo = $scope.selectedYearExNo.months;

        var charExNoid = "#chartExNo";
        var dataExNo = getDataForChart(listOrderOfMonthExNo);
        drawChar(dataExNo,charExNoid);

        /*data for "order by moth" char - tab "complete/Cancel" */
        // $scope.listStoreCC = $scope.dataChart.dataComCan;
        // $scope.selectedStoreCC = $scope.listStoreCC[0];
        // $scope.listYearCC = $scope.selectedStoreCC.years;
        // $scope.selectedYearCC = $scope.listYearCC[0];
        // var listOrderOfMonthCC = $scope.selectedYearCC.months;

        // var charComCanid = "#chartComCan";
        // var dataComCan = getDataForChart(listOrderOfMonthCC);
        // drawChar(dataComCan,charComCanid);

        /*data for "Finance by moth" char */
        // $scope.listStoreFin = getCodFeeFromServer;
        // $scope.selectedStoreFin = rs[0];
        // $scope.listYearFin = $scope.selectedStoreFin.years;
        // $scope.selectedYearFin = $scope.listYearFin[0];
        // var listCodFeeOfMonthFin = $scope.selectedYearFin.months;

        var overViewData = $scope.dataChart.dataOverView;
        $scope.totalStore = overViewData[0].length;
        $scope.totalShipper = overViewData[1].length;
        $scope.totalOrder = overViewData[2][0].totalOrder;
        if(overViewData[2][0].totalFee >1000){
            $scope.totalFee = overViewData[2][0].totalFee/1000 + ' K';    
        }
                
    }
        
    
    /* This function is ues to create data for function drawChar */
    function getDataForChart(listOrderOfMonth){
        var myData =[];
        for(var i = 0; i<listOrderOfMonth.length;i++){
            myData.push([listOrderOfMonth[i].name,listOrderOfMonth[i].types[0].countNum,listOrderOfMonth[i].types[1].countNum]);
        }
        return myData;
    }

    /* This function is ues to draw chart */
    function drawChar(data,charid){
       var plot = $.plot(charid, [data], {
        colors: ["#f35958"],
        series: { lines: { show: true  , fill:0.1 } ,shadowSize: 0 },
        yaxis: { tickColor: "rgba(0,0,0,0.2)" ,min: 0,},  
        grid: { borderWidth: { top: 0, right: 0, bottom: 1, left: 1 },color :  "rgba(0,0,0,0.2)" },
        tooltip: true,
        tooltipOpts: { content: ("%y")  },
        xaxis: { show: true}
        });

        plot.setData( [data] );
        plot.draw();       
    }
    // //var livedata = [] , totalPoints = getDataForChart().length;

    
    //     function getRandomData() {
    //         // if (livedata.length > 0)
    //         //     livedata = livedata.slice(1);
    //         //     while (livedata.length < totalPoints) {
    //         //         var prev = livedata.length > 0 ? livedata[livedata.length - 1] : 20,
    //         //             y = prev + Math.random() * 10 - 5;
    //         //             if (y < 0) {  y = 0; }else if (y > 30) {    y = 30; }
    //         //         $("#onlinerealtime  span").text(Math.ceil( y));
    //         //         livedata.push(y);
    //         //     }
    //         //     var res = [];
    //         //     for (var i = 0; i < livedata.length; ++i) {
    //         //         res.push([i, livedata[i]])
    //         //     }
    //         // return res;
    //         var listOrderOfMonth = getDataForChart();
    //         var myData =[];
    //         for(var i = 0; i<listOrderOfMonth.length;i++){
    //             myData.push([listOrderOfMonth[i].name,listOrderOfMonth[i].types[0].countNum]);
                
    //         }
    //        return myData;
    //     }

    //     var updateInterval = 2000;
        
    //     var plot = $.plot("#placeholder", [ getRandomData() ], {
    //         colors: ["#f35958"],
    //         series: { lines: { show: true  , fill:0.1 } ,shadowSize: 0 },
    //         yaxis: { tickColor: "rgba(0,0,0,0.2)" ,min: 0,},  
    //         grid: { borderWidth: { top: 0, right: 0, bottom: 1, left: 1 },color :  "rgba(0,0,0,0.2)" },
    //         tooltip: true,
    //         tooltipOpts: { content: ("%y")  },
    //         //xaxis: { show: true}
    //     });

    //     //var plot = $.plot("#placeholder", [ getRandomData() ]);
        
    //     function update() {
    //         plot.setData( [getRandomData()] );
    //         plot.draw();
    //         //setTimeout(update, updateInterval);
    //     }
        
    //     update();

    /////////////////////////////////////

    // function getComCanFromServer(){
    //     var urlBase = config.baseURI + '/api/admin/report/storeOrderCount';
    //     dataService.getDataServer(urlBase)
    //         .then(function (rs) {
    //              rs = rs.data;
    //              $scope.listStoreCC = rs;
    //              $scope.selectedStoreCC = $scope.listStoreCC[0];
    //              $scope.listYearCC = $scope.selectedStoreCC.years;
    //              $scope.selectedYearCC = $scope.listYearCC[0];
    //              $scope.listOrderOfMonthCC = $scope.selectedYearCC.months;
    //         })

    // }
    // function getCodFeeFromServer(){
    //     var urlBase = config.baseURI + '/api/admin/report/storeOrderCount';
    //     dataService.getDataServer(urlBase)
    //         .then(function (rs) {
    //              rs = rs.data;
    //              $scope.listStoreFin = rs;
    //              $scope.selectedStoreFin = rs[0];
    //              $scope.listYearFin = $scope.selectedStoreFin.years;
    //              $scope.selectedYearFin = $scope.listYearFin[0];
    //              $scope.listCodFeeOfMonthFin = $scope.selectedYearFin.months;
    //         })

    // }
    $scope.$watch('$viewContentLoaded', function (event) {
        
    });


}

adminReportController.$inject = ['$scope','$state', '$http','dataService', '$filter', 'config', '$stateParams'];
angular.module('app').controller('adminReportController',adminReportController);