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

    return {
        getAllLedger: getAllLedger
    }
}