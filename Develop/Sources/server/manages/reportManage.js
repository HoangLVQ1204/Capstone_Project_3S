/**
 * Created by Cao Khanh on 21/10/2015.
 */
var _ = require('lodash');

module.exports = function (app) {
    var db = app.get('models');

    var getOverView = function (req, res, next) {
        var listStore;
        var listShipper;
        var getStore = db.store.adminGetAllStoreNameAndStoreiD();
        var getShipper = db.user.getUserByRole(1);
        var getTotalOrder = db.order.adminCountAllOrder();
        var getTaskOfEachShipper = db.task.adminCountTaskOfEachShipper();        
        Promise.all([getStore,getShipper,getTotalOrder,getTaskOfEachShipper])
            .then(function(rs){                
                return res.status(200).json(rs);
            },function(err){
                next(err);
            })
        
    };

    // START HELPER FUNCTIONS
    var pushIntoArray = function(ar, obj){
        for (var i = 0; i !== ar.length; i++) {
            if(ar[i].name === obj.name){
                if(ar[i].hasOwnProperty("countNum") && obj.hasOwnProperty("countNum")){
                    ar[i].countNum += obj.countNum;
                }
                if(ar[i].hasOwnProperty("feeNum") && obj.hasOwnProperty("feeNum")){
                    ar[i].feeNum += obj.feeNum;
                }
                if(ar[i].hasOwnProperty("codNum") && obj.hasOwnProperty("codNum")){
                    ar[i].codNum += obj.codNum;
                }
                return i;
            }
        }
        ar.push(obj);
        return i++;
    };
    // END HELPER FUNCTIONS

    var getOrderCount = function(req, res, next){
        db.order.adminGetAllStatisticOrders().then(function(rows) {
            /*
            var rs = {};
            rows.forEach(function(row){
                row = row.toJSON();

                var count = row['count'];
                var type = row['type'];
                var month = row['month'];
                var year = row['year'];
                var store = row['store'];
                // Add data for all
                if (!rs.hasOwnProperty("all")) rs["all"] = {};
                if (!rs["all"].hasOwnProperty(year)) rs["all"][year] = {};
                if (!rs["all"][year].hasOwnProperty(month)) rs["all"][year][month] = {};
                if (!rs["all"][year][month].hasOwnProperty(type)) {
                    rs["all"][year][month][type] = parseInt(count)? parseInt(count):0;
                }else {
                    rs["all"][year][month][type] += parseInt(count) ? parseInt(count) : 0;
                }
                // Add data for each store
                if (!rs.hasOwnProperty(store)) rs[store] = {};
                if (!rs[store].hasOwnProperty(year)) rs[store][year] = {};
                if (!rs[store][year].hasOwnProperty(month)) rs[store][year][month] = {};
                rs[store][year][month][type] = parseInt(count)? parseInt(count):0;
            });
            return res.status(200).json(rs)
        },function(er){
            console.log(er);
            return res.status(400).json(er)
        });
        */
            var rs = [];
            rows.forEach(function(row){
                row = row.toJSON();

                var count = parseInt(row['count'])? parseInt(row['count']) : 0;
                var type = row['type'];
                var month = row['month'];
                var year = row['year'];
                var store = row['store'];
                // Add data for all
                var storeIndex = pushIntoArray(rs,{
                    "name":"all",
                    "years": []
                });
                var yearIndex = pushIntoArray(rs[storeIndex].years, {
                    "name": year,
                    "months": []
                });
                var monthIndex = pushIntoArray(rs[storeIndex].years[yearIndex].months, {
                    "name": month,
                    "types": []
                });
                var typeIndex = pushIntoArray(rs[storeIndex].years[yearIndex].months[monthIndex].types, {
                    "name": type,
                    "countNum": count
                });

                // Add data for each store
                storeIndex = pushIntoArray(rs,{
                    "name": store,
                    "years": []
                });
                yearIndex = pushIntoArray(rs[storeIndex].years, {
                    "name": year,
                    "months": []
                });
                monthIndex = pushIntoArray(rs[storeIndex].years[yearIndex].months, {
                    "name": month,
                    "types": []
                });
                typeIndex = pushIntoArray(rs[storeIndex].years[yearIndex].months[monthIndex].types, {
                    "name": type,
                    "countNum": count
                });
            });
            return res.status(200).json(rs)
        },function(er){
            console.log(er);
            return res.status(400).json(er)
        });
    };

    var getMoneyCount = function(req, res, next){
        /*
        db.order.adminGetMoneyStatisticOrders().then(function(rows) {
            var rs = {};
            rows.forEach(function(row){
                row = row.toJSON();
                var feeSum = row['feeSum'];
                var codSum = row['codSum'];
                var type = row['type'];
                var month = row['month'];
                var year = row['year'];
                var store = row['store'];
                // Add data for all
                if (!rs.hasOwnProperty("all")) rs["all"] = {};
                if (!rs["all"].hasOwnProperty(year)) rs["all"][year] = {};
                if (!rs["all"][year].hasOwnProperty(month)) rs["all"][year][month] = {};
                if (!rs["all"][year][month].hasOwnProperty(type)) rs["all"][year][month][type] = {};
                if (!rs["all"][year][month][type].hasOwnProperty("fee")) {
                    rs["all"][year][month][type]['fee'] = parseInt(feeSum)? parseInt(feeSum):0;
                }else{
                    rs["all"][year][month][type]['fee'] += parseInt(feeSum)? parseInt(feeSum):0;
                }
                if (!rs["all"][year][month][type].hasOwnProperty("cod")) {
                    rs["all"][year][month][type]['cod'] = parseInt(codSum)? parseInt(codSum):0;
                }else{
                    rs["all"][year][month][type]['cod'] += parseInt(codSum)? parseInt(codSum):0;
                }
                // Add data for each store
                if (!rs.hasOwnProperty(store)) rs[store] = {};
                if (!rs[store].hasOwnProperty(year)) rs[store][year] = {};
                if (!rs[store][year].hasOwnProperty(month)) rs[store][year][month] = {};
                if (!rs[store][year][month].hasOwnProperty(type)) rs[store][year][month][type] = {};
                rs[store][year][month][type]['fee'] = parseInt(feeSum)? parseInt(feeSum):0;
                rs[store][year][month][type]['cod'] = parseInt(codSum)? parseInt(codSum):0;
            });
            return res.status(200).json(rs)
        },function(er){
            console.log(er);
            return res.status(400).json(er)
        });
        */
        db.order.adminGetMoneyStatisticOrders().then(function (rows) {
            var rs = [];
            rows.forEach(function (row) {
                row = row.toJSON();

                var feeSum = parseInt(row['feeSum']) ? parseInt(row['feeSum']) : 0;
                var codSum = parseInt(row['codSum']) ? parseInt(row['codSum']) : 0;
                var type = row['type'];
                var month = row['month'];
                var year = row['year'];
                var store = row['store'];
                // Add data for all
                var storeIndex = pushIntoArray(rs, {
                    "name": "all",
                    "years": []
                });
                var yearIndex = pushIntoArray(rs[storeIndex].years, {
                    "name": year,
                    "months": []
                });
                var monthIndex = pushIntoArray(rs[storeIndex].years[yearIndex].months, {
                    "name": month,
                    "types": []
                });
                var typeIndex = pushIntoArray(rs[storeIndex].years[yearIndex].months[monthIndex].types, {
                    "name": type,
                    "feeNum": feeSum,
                    "codNum": codSum
                });

                // Add data for each store
                storeIndex = pushIntoArray(rs, {
                    "name": store,
                    "years": []
                });
                yearIndex = pushIntoArray(rs[storeIndex].years, {
                    "name": year,
                    "months": []
                });
                monthIndex = pushIntoArray(rs[storeIndex].years[yearIndex].months, {
                    "name": month,
                    "types": []
                });
                typeIndex = pushIntoArray(rs[storeIndex].years[yearIndex].months[monthIndex].types, {
                    "name": type,
                    "feeNum": feeSum,
                    "codNum": codSum
                });
            });
            return res.status(200).json(rs)
        }, function (er) {
            console.log(er);
            return res.status(400).json(er)
    });
    };

    var getCountOrdersDoneOrFail = function(req, res, next){
        /*
        db.order.adminCountOrdersDoneOrFail().then(function(rows) {
            var rs = {};
            rows.forEach(function(row){
                row = row.toJSON();

                var count = row['count'];
                var status = row['status'];
                var month = row['month'];
                var year = row['year'];
                var store = row['store'];
                // Add data for all
                if (!rs.hasOwnProperty("all")) rs["all"] = {};
                if (!rs["all"].hasOwnProperty(year)) rs["all"][year] = {};
                if (!rs["all"][year].hasOwnProperty(month)) rs["all"][year][month] = {};
                if (!rs["all"][year][month].hasOwnProperty(status)) {
                    rs["all"][year][month][status] = parseInt(count)? parseInt(count):0;
                }else {
                    rs["all"][year][month][status] += parseInt(count) ? parseInt(count) : 0;
                }
                // Add data for each store
                if (!rs.hasOwnProperty(store)) rs[store] = {};
                if (!rs[store].hasOwnProperty(year)) rs[store][year] = {};
                if (!rs[store][year].hasOwnProperty(month)) rs[store][year][month] = {};
                rs[store][year][month][status] = parseInt(count)? parseInt(count):0;
            });
            return res.status(200).json(rs)
        },function(er){
            console.log(er);
            return res.status(400).json(er)
        });
        */
        db.order.adminCountOrdersDoneOrFail().then(function(rows) {
            var rs = [];
            rows.forEach(function(row){
                row = row.toJSON();

                var count = parseInt(row['count'])? parseInt(row['count']) : 0;
                var status = row['status'];
                var month = row['month'];
                var year = row['year'];
                var store = row['store'];
                // Add data for all
                var storeIndex = pushIntoArray(rs,{
                    "name":"all",
                    "years": []
                });
                var yearIndex = pushIntoArray(rs[storeIndex].years, {
                    "name": year,
                    "months": []
                });
                var monthIndex = pushIntoArray(rs[storeIndex].years[yearIndex].months, {
                    "name": month,
                    "status": []
                });
                var typeIndex = pushIntoArray(rs[storeIndex].years[yearIndex].months[monthIndex].status, {
                    "name": status,
                    "countNum": count
                });

                // Add data for each store
                storeIndex = pushIntoArray(rs,{
                    "name": store,
                    "years": []
                });
                yearIndex = pushIntoArray(rs[storeIndex].years, {
                    "name": year,
                    "months": []
                });
                monthIndex = pushIntoArray(rs[storeIndex].years[yearIndex].months, {
                    "name": month,
                    "status": []
                });
                typeIndex = pushIntoArray(rs[storeIndex].years[yearIndex].months[monthIndex].status, {
                    "name": status,
                    "countNum": count
                });
            });
            return res.status(200).json(rs)
        },function(er){
            console.log(er);
            return res.status(400).json(er)
        });
    }

    return {
        getOverView: getOverView,
        getOrderCount: getOrderCount,
        getMoneyCount: getMoneyCount,
        getCountOrdersDoneOrFail: getCountOrdersDoneOrFail
        
    }
}