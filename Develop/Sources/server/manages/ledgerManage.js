/**
 * Created by Cao Khanh on 21/10/2015.
 */
var _ = require('lodash');

module.exports = function (app) {
    var db = app.get('models');

    var getAllLedger = function (req, res, next) {

        return db.generalledger.getAllLedger(db.store, db.order)
            .then(function (ledgerList) {
                res.status(200).json(ledgerList);
            }, function (err) {
                next(err);
            })
    };

    var getLedgerOfStore = function (req, res, next) {
        var storeid = req.params.storeid;
        var perioddate = req.params.perioddate;

        if (req.params.perioddate != 'null')
            perioddate = new Date(perioddate);

        //var enddate = new Date(req.params.enddate);
        //console.log(perioddate)
        return db.generalledger.getLedgerOfStore(db.store, storeid, perioddate)
            .then(function (ledgerList) {
                res.status(200).json(ledgerList);
            }, function (err) {
                next(err);
            })
    };

    var storeGetAllLedger = function (req, res, next) {
        var storeId = req.user.stores[0].storeid;
        db.generalledger.storeGetAllLedger(storeId)
        .then(function(list){
            res.status(200).json(list);
        }, function(err) {
            next(err);
        });
    };

    return {
        getAllLedger: getAllLedger,
        getLedgerOfStore: getLedgerOfStore,
        storeGetAllLedger : storeGetAllLedger
    }
}