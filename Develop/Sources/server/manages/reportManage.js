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
        Promise.all([getStore,getShipper])
            .then(function(rs){                
                return res.status(200).json(rs);
            },function(err){
                next(err);
            })
        
    };

    var getOrderCount = function(req, res, next){
        db.order.adminGetAllStatisticOrders().then(function(rows) {
            var rs = {};
            rows.forEach(function(row){
                row = row.toJSON();
                var count = row['count'];
                var type = row['type'];
                var month = row['month'];
                var year = row['year'];
                var store = row['store'];
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
    }

    return {
        getOverView: getOverView,
        getOrderCount: getOrderCount
        
    }
}