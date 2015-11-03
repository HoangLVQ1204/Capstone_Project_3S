/**
 * Created by Cao Khanh on 21/10/2015.
 */
module.exports = function (app) {
    var controller = require('./../../manages/issueManage')(app);

    app.route('/api/getAllIssue')
        .get(controller.getAllIssue);

    app.route('/api/getIssueContent/:issueid?')
        .get(controller.getIssueDetail);
}