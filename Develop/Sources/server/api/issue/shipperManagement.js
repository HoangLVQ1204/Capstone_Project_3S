/**
 * Created by Kaka Hoang Huy on 10/15/2015.
 */
module.exports = function (app) {
    var listAll = function (response) {
        var db = app.get('models');
        console.log(1111111111111111);
        var fa = db.issues.findAll({
            attributes: ["issueid", "category", "priority", "description"],
            //attributes: '',
            where: {
                //issueid: issue_id
            }
        })
            .then(function (rs) {
                response(200,'',rs);
            }, function (err) {
                response(404,err, none);
            });
        //return fa.promise();
    };
    return {
        listAllIssues: listAll
    }
};