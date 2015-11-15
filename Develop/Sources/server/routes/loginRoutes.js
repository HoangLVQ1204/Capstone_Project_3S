/**
 * Created by hoanglvq on 10/16/15.
 */

module.exports = function(app){

    var authManage = require('../manages/authManage')(app);

    app.post('/auth/signin',authManage.verifyUser(),authManage.signIn());
}