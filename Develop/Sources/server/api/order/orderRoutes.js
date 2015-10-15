/**
 * Created by Cao Khanh on 15/10/2015.
 */
module.exports = function(app){
    var controller = require('./orderController')(app);

    app.route('/api/orders')
        .get(controller.get)
}