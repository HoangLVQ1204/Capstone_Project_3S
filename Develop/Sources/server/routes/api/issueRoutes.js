/**
 * Created by Cao Khanh on 21/10/2015.
 */
module.exports = function (app) {
    var controller = require('./../../manages/issueManage')(app);
    var authManage = require('./../../manages/authManage')(app);
    var checkAll = [authManage.checkToken(),authManage.checkRole()];

    app.route('/api/getAllIssue')
        .get(controller.getAllIssue);

    app.route('/api/getUserGetIssue')
        .get(controller.getUserGetIssue);

    app.route('/api/getIssueContent/:issueid?')
        .get(checkAll,function(req,res,next){
            var id = req.query.issueid;
            controller.getIssueDetail(id).then(function(data){
                res.status(200).json(data);
            })
                .catch(function(err){
                    next(err);
                })
        });

    app.route('/api/updateResolveIssue/:issueid?')
        .put(checkAll,function(req,res,next){
            var id = req.query.issueid;
            var updateIssue = req.body;
            controller.updateResolveIssue(id, updateIssue).then(function(data){
                res.status(201).json(data);
            })
                .catch(function(err){
                    next(err);
                })
        });

    app.route('/api/log/postBannedLog')
        .post(controller.postBannedLog);
}