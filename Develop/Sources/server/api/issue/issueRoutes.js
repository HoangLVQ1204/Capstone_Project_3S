/**
 * Created by Kaka Hoang Huy on 10/13/2015.
 */
module.exports = function(app) {

    var controller = require("./issueController")(app);
    app.param('issue_id',controller.params);
    app.route('/api/issues')
        .get(controller.get)
        .post(controller.post);

    app.route('/api/issues/:issue_id')
        .get(controller.getOne);
        //.put(controller.put)
        //.delete(controller.del);
    app.route('/api/issueAll')
        .get(controller.getAll);
}