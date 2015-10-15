/**
 * Created by Hoang on 10/13/2015.
 */
module.exports = function(app) {


    var controller = require("./adminController")(app);
    app.param('admin_id', controller.getIdParam);
    app.route('/api/admin')
        .get(controller.getAllAdmins)
        .post(controller.postAdmins);

    app.route('/api/admin/:admin_id')
        //.get(controller.getOne)
        .put(controller.put)
        .delete(controller.deleteOneAdmin);
}