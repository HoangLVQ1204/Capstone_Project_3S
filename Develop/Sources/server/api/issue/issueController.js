/**
 * Created by Kaka Hoang Huy on 10/13/2015.
 */
module.exports = function (app) {
    var db = app.get('models');
    var get = function (req, res, next) {
        db.userlogin.findAll({
            //attributes: ["issueid", "category", "priority", "description"],
            //attributes: '',
            where: {
                category: 1
            }
        })
            //okReturn()
            .then(function (users) {
                res.status(200).json(users.map(function (user) {
                    return user.toJSON();
                }));
            }, function (err) {
                next(err);
            })
    };
    return {
        get: get
        //getOne: getOne,
        //post: post,
        //put: put,
        //del: del,
        //params: params
    }
};