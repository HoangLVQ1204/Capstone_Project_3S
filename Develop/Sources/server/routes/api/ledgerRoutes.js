/**
 * Created by Cao Khanh on 21/10/2015.
 */
module.exports = function (app) {
    var controller = require('./../../manages/ledgerManage')(app);
    var authManage = require('./../../manages/authManage')(app);
    var checkAll = [authManage.checkToken(),authManage.checkRole()];

    app.route('/api/ledgerList')
        .get(controller.getAllLedger);

    app.route('/api/getLedgerOfStore/:storeid/:perioddate')
        .get(controller.getLedgerOfStore)

    app.route('/api/store/ledger/getLedgerList')
        .get(checkAll,controller.storeGetAllLedger)

}