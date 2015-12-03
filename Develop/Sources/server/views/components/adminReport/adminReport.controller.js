/**
 * Created by KhanhKC on 19/11/2015.
 */

function adminReportController($scope,$state, $http,dataService, $filter, config, $stateParams) {
    console.log("======xcd======",$scope.dataChart);
    $scope.customClass = ['tab-pane','active']
    drawCharFirstTimeRun();
    $scope.updateCharExNoByStore = function(){
        $scope.listYearExNo = $scope.selectedStoreExNo.years;
        $scope.selectedYearExNo = $scope.listYearExNo[0];
        var listOrderOfMonthExNo = $scope.selectedYearExNo.months;

        var charExNoid = "#chartExNo";
        var dataExNo = getDataForChart(listOrderOfMonthExNo);
        drawChart(charExNoid,dataExNo);
    }

    $scope.updateCharComCanByStore = function(){
        $scope.listYearComCan = $scope.selectedStoreComCan.years;
        $scope.selectedYearComCan = $scope.listYearComCan[0];
        var listOrderOfMonthComCan = $scope.selectedYearComCan.months;

        var charComCanid = "#chartComCan";
        var dataComCan = getDataForChart(listOrderOfMonthComCan);
        drawChart(charComCanid,dataComCan);
    }

    $scope.updateCharFinByStore = function(){
        $scope.listYearFin = $scope.selectedStoreFin.years;
        $scope.selectedYearFin = $scope.listYearFin[0];
        var listOrderOfMonthFin = $scope.selectedYearFin.months;

        var charFinid = "#chartFinance";
        var dataFin = getDataForChart(listOrderOfMonthFin);
        drawChart(charFinid,dataFin);
    }

     function drawCharFirstTimeRun(){

        var overViewData = $scope.dataChart.dataOverView;
        $scope.totalStore = overViewData[0].length;
        $scope.totalShipper = overViewData[1].length;
        $scope.totalOrder = 0;
        $scope.totalFee = 0;
        for(var i = 0; i <overViewData[2].length;i++){
            $scope.totalOrder = $scope.totalOrder + parseInt(overViewData[2][i].numberOrder);
            $scope.totalFee = $scope.totalFee + parseInt(overViewData[2][i].totalFee);
        }
        if($scope.totalFee >1000){
            $scope.totalFee = $scope.totalFee/1000 + ' K';    
        }
        console.log("===order===",$scope.totalOrder);
        console.log("===fee===",$scope.totalFee);
        
        /* data for "order by month" char - tab "Express/Normal" */ 
        if($scope.dataChart.dataExNo.length == 0){
            var charExNoid = "#chartExNo";
            var dataExNo = createDefaultData();
            drawChart(charExNoid,dataExNo);            
        } else {
            $scope.listStore = $scope.dataChart.dataExNo;
            $scope.selectedStoreExNo = $scope.listStore[0];
            $scope.listYearExNo = $scope.selectedStoreExNo.years;
            $scope.selectedYearExNo = $scope.listYearExNo[0];
            var listOrderOfMonthExNo = $scope.selectedYearExNo.months;

            var charExNoid = "#chartExNo";
            var dataExNo = getDataForChart(listOrderOfMonthExNo);
            drawChart(charExNoid,dataExNo);    
        }
        

        /*data for "order by moth" char - tab "complete/Cancel" */
        if($scope.dataChart.dataComCan.length==0){
            var charComCanid = "#chartComCan";
            var dataComCan = createDefaultData();
            drawChart(charComCanid,dataComCan);  
        } else{
            $scope.listStoreCC = $scope.dataChart.dataComCan;
            $scope.selectedStoreCC = $scope.listStoreCC[0];
            $scope.listYearCC = $scope.selectedStoreCC.years;
            $scope.selectedYearCC = $scope.listYearCC[0];
            var listOrderOfMonthCC = $scope.selectedYearCC.months;

            var charComCanid = "#chartComCan";
            var dataComCan = getDataForChart(listOrderOfMonthCC);
            drawChart(charComCanid,dataComCan);  
        }
        
        /*data for "Finance by moth" char */
        if($scope.dataChart.dataCodFee.length==0){
            var charFinid = "#chartFinance";
            var dataFin = createDefaultData();
            drawChart(charFinid,dataFin);  
        } else {
            $scope.listStoreFin = $scope.dataChart.dataCodFee;
            $scope.selectedStoreFin = rs[0];
            $scope.listYearFin = $scope.selectedStoreFin.years;
            $scope.selectedYearFin = $scope.listYearFin[0];
            var listCodFeeOfMonthFin = $scope.selectedYearFin.months;

            var charFinid = "#chartFinance";        
            var dataFin = getDataForChart(listCodFeeOfMonthFin);
            drawChart(charFinid,dataFin);
        }
        $scope.customClass.pop('active');

        if($scope.dataChart.dataOverView[2].length > 0){
            var chartOrderPercentid = "#orderPercent";
            var dataPrderPercent =getDataForPeiChar($scope.dataChart.dataOverView[2]);
            drawPeiChart(chartOrderPercentid,dataPrderPercent);
        }

        if($scope.dataChart.dataOverView[3].length > 0){
            var chartTaskPercentid = "#taskPercent";
            var dataTaskPercent =getDataForPeiChar($scope.dataChart.dataOverView[2]);
            drawPeiChart(chartTaskPercentid,dataTaskPercent);
        }
        
    }
        
    /* This function is use to create data for char when data form server is null */
    function createDefaultData(){
        var defaultData;
        var data1 = [];
        var data2 = [];
        for (var i = 1; i<=12;i++ ){
            data1.push([i,0]);
            data2.push([i,0]);
        }
        defaultData = [{ data:data1, label:"", bars:{ show:true, align: "left", barWidth:0.3}}
        ,{ data:data2, label:"", bars:{ show:true, barWidth:0.3,align: "right"}}];
         return defaultData;
    }

    /* This function is use to create data for function drawChar */
    function getDataForChart(listOrderOfMonth){
        var myData;
        var data1 = [];
        var data2=[];
console.log("===========yahaaaa=======");
            console.log(listOrderOfMonth);
            console.log("===========yahaaa=======");
        for(var i = 0; i<listOrderOfMonth.length;i++){
            if(listOrderOfMonth[i].types.length == 2){
                data1.push([listOrderOfMonth[i].name,listOrderOfMonth[i].types[0].countNum]);
                data2.push([listOrderOfMonth[i].name,listOrderOfMonth[i].types[1].countNum]);    
            }  else if (listOrderOfMonth[i].types.length == 1) {
                if(listOrderOfMonth[i].types[0].name == 1){
                    data1.push([listOrderOfMonth[i].name,listOrderOfMonth[i].types[0].countNum]);
                    data2.push([listOrderOfMonth[i].name,0]);    
                } else if (listOrderOfMonth[i].types[0].name == 2){
                    data1.push([listOrderOfMonth[i].name,0]);
                    data2.push([listOrderOfMonth[i].name,listOrderOfMonth[i].types[0].countNum]);    
                }
            } else {
                data1.push([listOrderOfMonth[i].name,0]);
                data2.push([listOrderOfMonth[i].name,0]);    
            }          
            
        }
        myData = [{ data:data1, label:"", bars:{ show:true, align: "left", barWidth:0.3},fill:true, fillColor:"#0AA699"}
        ,{ data:data2, label:"", bars:{ show:true, barWidth:0.3,align: "right"}}];
        return myData;
    }

    // /* This function is ues to draw chart */
    // function drawChar(data1,data2,charid){
    //    var plot = $.plot(charid, [data1,data2], {
    //     colors: ["#f35958"],
    //     label: "y=3",
    //     series: { lines: { show: true  ,barWidth: 0.4, align: "center", fill:0.1 } ,shadowSize: 0 },
    //     yaxis: { tickColor: "rgba(0,0,0,0.2)" ,min: 0,},  
    //     grid: { borderWidth: { top: 0, right: 0, bottom: 1, left: 1 },color :  "rgba(0,0,0,0.2)" },
    //     tooltip: true,
    //     tooltipOpts: { content: ("%y")  },
    //     xaxis: { min: 0,max: 12, show: true}
    //     });

    //     plot.setData( [data] );
    //     plot.draw();       
    // }
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

        function getDataForPeiChar(data){
            var peiData = [];
            var rootData = data;
            $scope.totalOrder = 0;

            var totalOrder =0;            
            for(var i = 0; i <rootData.length;i++){
                totalOrder = totalOrder + parseInt(rootData[i].numberOrder);
            }
            //count = 0;
            for(var i = 0; i<rootData.length; i++){
                peiData.push([rootData[i].storeid,rootData[i].numberOrder/totalOrder*100]);                
            }
            return peiData;
        }

        function drawPeiChart(chartid,data){
            options = {
                series: {
                    pie: {
                        innerRadius: 0.7,
                        show: true,
                        tooltip: true,
                        label: {
                            show: true,
                            radius: 3/4,
                            //formatter: labelFormatter,
                            background: {
                                opacity: 0.5
                            }   
                        }
                    }
                },  
                grid: {
                    hoverable: true
                },
                colors:["#0AA699","#FFCC33","#77D7B0","#E15258"]
            }
            $.plot(chartid,data,options);
        }

        function drawChart(chartid,data){
            options = {
                grid: { borderWidth: { top: 0, right: 0, bottom: 1, left: 1 },color :  "rgba(0,0,0,0.2)" },
                tooltip: true,
                tooltipOpts: { content: ("%y")},
                yaxis: {min: 0,},
                colors:["#0AA699","#FFCC33","#77D7B0","#E15258"]
            };
            $.plot(chartid,data,options);
        }

    $scope.$watch('$viewContentLoaded', function (event) {
    
    });


}

adminReportController.$inject = ['$scope','$state', '$http','dataService', '$filter', 'config', '$stateParams'];
angular.module('app').controller('adminReportController',adminReportController);