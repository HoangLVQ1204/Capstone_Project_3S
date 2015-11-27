/**
 * Created by KhanhKC on 19/11/2015.
 */

function adminReportController($scope,$state, $http,dataService, $filter, config, $stateParams) {
    $scope.height = 300;
    getComCanFromServer();
    getCodFeeFromServer();
    getExNoFromServer();
    getDateOverView();
    $scope.listStore = [];
    function getExNoFromServer() {
        var urlBase = config.baseURI + '/api/admin/report/orderCount';
        dataService.getDataServer(urlBase)
            .then(function (rs) {
                 rs = rs.data;
                 $scope.listStore = rs;                 
                 $scope.selectedStore = rs[0];
                 $scope.listYear = $scope.selectedStore.years;
                 $scope.selectedYear = $scope.listYear[0];
                 $scope.listOrderOfMonth = $scope.selectedYear.months;
                 setTimeout(function(){
                    caplet();
                },200);
                 
            })

    }

    $scope.updateDate = function(){
        $scope.listYear = $scope.selectedStore.years;
        $scope.selectedYear = $scope.listYear[0];
        $scope.listOrderOfMonth = $scope.selectedYear.months;
         function getDataForChart(){
            $scope.listYear = $scope.selectedStore.years;
        $scope.selectedYear = $scope.listYear[0];
       var listOrderOfMonth = $scope.selectedYear.months;
            return listOrderOfMonth;
    }
    var livedata = [] , totalPoints = getDataForChart().length;
        function getRandomData() {
            // if (livedata.length > 0)
            //     livedata = livedata.slice(1);
            //     while (livedata.length < totalPoints) {
            //         var prev = livedata.length > 0 ? livedata[livedata.length - 1] : 20,
            //             y = prev + Math.random() * 10 - 5;
            //             if (y < 0) {  y = 0; }else if (y > 30) {    y = 30; }
            //         $("#onlinerealtime  span").text(Math.ceil( y));
            //         livedata.push(y);
            //     }
            //     var res = [];
            //     for (var i = 0; i < livedata.length; ++i) {
            //         res.push([i, livedata[i]])
            //     }
            // return res;
            var listOrderOfMonth = getDataForChart();
            var myData =[];
            for(var i = 0; i<listOrderOfMonth.length;i++){
                myData.push([listOrderOfMonth[i].name,listOrderOfMonth[i].types[0].countNum]);
                
            }
           return myData;
        }

        var updateInterval = 2000;
        
        var plot = $.plot("#placeholder", [ getRandomData() ], {
            colors: ["#f35958"],
            series: { lines: { show: true  , fill:0.1 } ,shadowSize: 0 },
            yaxis: { tickColor: "rgba(0,0,0,0.2)" ,min: 0,},  
            grid: { borderWidth: { top: 0, right: 0, bottom: 1, left: 1 },color :  "rgba(0,0,0,0.2)" },
            tooltip: true,
            tooltipOpts: { content: ("%y")  },
            xaxis: { show: true}
        });

        //var plot = $.plot("#placeholder", [ getRandomData() ]);
        
        // // <div class="widget-chart chart-dark">
        // // <div id="placeholder" class="demo-placeholder" style="height:150px"></div>
        // // <div id="onlinerealtime" class="align-lg-center">Right now <span>0</span> visitors on site </div>
        // // </div><!-- // widget-chart -->
         console.log("=========================plot=========================");
        console.log(plot);
        console.log("=========================plot=========================");
        function update() {
            plot.setData( [getRandomData()] );
            plot.draw();
            console.log(getRandomData());
            setTimeout(update, updateInterval);
        }
        
        update();

    }

    function getComCanFromServer(){
        var urlBase = config.baseURI + '/api/admin/report/storeOrderCount';
        dataService.getDataServer(urlBase)
            .then(function (rs) {
                 rs = rs.data;
                 $scope.listStoreCC = rs;
                 $scope.selectedStoreCC = $scope.listStoreCC[0];
                 $scope.listYearCC = $scope.selectedStoreCC.years;
                 $scope.selectedYearCC = $scope.listYearCC[0];
                 $scope.listOrderOfMonthCC = $scope.selectedYearCC.months;
            })

    }
    function getCodFeeFromServer(){
        var urlBase = config.baseURI + '/api/admin/report/storeOrderCount';
        dataService.getDataServer(urlBase)
            .then(function (rs) {
                 rs = rs.data;
                 $scope.listStoreFin = rs;
                 $scope.selectedStoreFin = rs[0];
                 $scope.listYearFin = $scope.selectedStoreFin.years;
                 $scope.selectedYearFin = $scope.listYearFin[0];
                 $scope.listCodFeeOfMonthFin = $scope.selectedYearFin.months;
            })

    }

    function getDateOverView(){
        var urlBase = config.baseURI + '/api/admin/report/overView';
        dataService.getDataServer(urlBase)
            .then(function (rs) {
                rs = rs.data;
                $scope.totalStore = rs[0].length;
                $scope.totalShipper = rs[1].length;
                $scope.totalOrder = rs[2][0].totalOrder;
                if(rs[2][0].totalFee >1000){
                    $scope.totalFee = rs[2][0].totalFee/1000 + ' K';    
                }
                
            })
    }

    $scope.$watch('$viewContentLoaded', function (event) {
        
    });


}

adminReportController.$inject = ['$scope','$state', '$http','dataService', '$filter', 'config', '$stateParams'];
angular.module('app').controller('adminReportController',adminReportController);