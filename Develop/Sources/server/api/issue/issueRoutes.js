/**
 * Created by Kaka Hoang Huy on 10/13/2015.
 */

module.exports = function(app) {

    var controller = require("./issueController")(app);
    app.route('/api/issues')
        .get(controller.get);
        //.post(controller.post);

    //app.route('/api/users/:user_id')
    //    .get(controller.getOne)
    //    .put(controller.put)
    //    .delete(controller.del);
}