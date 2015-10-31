/**
 * Created by Cao Khanh on 21/10/2015.
 */
module.exports = function (app) {
    var controller = require('./../../manages/ledgerManage')(app);

    app.route('/api/ledgerList')
        .get(controller.getAllLedger)

}