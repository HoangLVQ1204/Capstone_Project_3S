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

        return db.generalledger.getLatestAutoAccountDate()
            .then(function (ledger) {
                console.log(ledger);
                if (ledger != null)
                    db.generalledger.getLedgerOfStore(db.store, storeid, perioddate, ledger.paydate)
                        .then(function (ledgerList) {
                            res.status(200).json(ledgerList);
                        }, function (err) {
                            next(err);
                        })
        }, function (err) {
                next(err);
            })
    };

/*
    By KhanhKC
    This function is use to get all transaction of a store
*/    
    function storeGetAllLedger(storeid){
       return db.generalledger.storeGetAllLedger(storeid)
        .then(function(list){
            return list;
        }, function(err) {
            throw err;
        });
    }

    return {
        getAllLedger: getAllLedger,
        getLedgerOfStore: getLedgerOfStore,
        storeGetAllLedger : storeGetAllLedger
    }
}