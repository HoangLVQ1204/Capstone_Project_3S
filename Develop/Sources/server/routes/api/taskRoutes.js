/**
 * Created by Cao Khanh on 21/10/2015.
 */
module.exports = function (app) {
    var controller = require('./../../manages/taskManage')(app);

    app.route('/api/getTaskList')
        .get(controller.getAllTask);

    app.route('/api/getAllTaskStatus')
        .get(controller.getAllTaskStatus);

    app.route('/api/getAllTaskType')
        .get(controller.getAllTaskType);

    app.route('/api/updateAllTaskState')
        .put(controller.updateTaskState);

    app.route('/api/updateTaskStateOfIssue')
        .put(controller.updateTaskStateOfIssue);

    app.route('/api/updateStateOfStoreCancelIssue')
        .put(controller.updateStateOfStoreCancelIssue);

    app.route('/api/updateTaskNoShipper')
        .put(controller.updateTaskNoShipper);

    app.route('/api/createTask')
        .post(controller.createTask);

    app.route('/api/countProcessingTaskOfShipper/:shipperid?')//link api: api/countActiveTaskOfShipper?shipperid=SP000001
        .get(controller.countProcessingTaskOfShipper);


}