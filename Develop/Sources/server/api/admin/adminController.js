/**
 * Created by Hoang on 10/13/2015.
 */
var _ = require('lodash');

module.exports = function (app) {
    var db = app.get('models');


    var getIdParam = function (req, res, next, admin_id) {
        console.log(admin_id);
        db.admins.findOne({
            attributes: ['adminid', 'name', 'address', 'email', 'dob', 'phonenumber', 'identitycard'],
            where: {
                'adminid': admin_id
            }
    }).then(function(admin){
            if (admin) {
                req.admin = admin;
                next();
            } else {
                next(new Error('No post with that id'));
            }
        }, function(err) {

            next(err);
        })
    }

    var getAllAdmins = function (req, res, next) {
        db.admins.findAll({
            //  attributes: ["adminid"],
            //attributes: '',
            where: {

            }
        })
            //okReturn()
            .then(function (admin) {
                res.status(200).json(admin.map(function (admin) {
                    return admin.toJSON();
                }));
            }, function (err) {
                next(err);
            })
    };


    var postAdmins = function (req, res, next) {
        console.log(req.body);
        var newPost = req.body;
        db.admins.build(newPost)
            .save()
            //okReturn()
            .then(function (admin) {
                res.status(201).json(admin.map(function (admin) {
                    return admin.toJSON();
                }));
            }, function (err) {
                next(err);
            })
    };

    var deleteOneAdmin = function(req, res, next) {

        db.admins.destroy({
            where: {
                adminid: req.admin.adminid
            }
        })
            .then(function(deleted) {
                // C?ng t??ng t? DELETE trong SQL
                // kh�c ? ch? truy?n v�o thu?c t�nh force: true,
                // t?c l� sau khi x�a trong database th� KH�NG TH? kh�i ph?c l?i ???c
                req.admin.destroy({ force: true })
                    .then(function() {
                        res.status(200).json(req.admin.adminid);
                    }, function(err) {
                        next(err);
                    });
            }, function(err) {
                next(err);
            });
    };


    var put = function(req, res, next) {
        var newAdmin = _.cloneDeep(req.body);
        //newAdmin.UserId = req.user.UserId;
        //delete newPost.Categories;

        var curPost = req.admin;

        // _.merge th�m v� ghi ?� c�c thu?c t�nh c?a ??i t??ng newPost v�o ??i t??ng curPost
        _.merge(curPost, newPost);

        // H�m save n�y g?i t? Instance d�ng ??
        // c?p nh?t gi� tr? c?a 1 b?n ghi trong b?ng Post
        curPost.save().then(function(){
            res.status(201).json(curPost);
        })

    };

    return {
        getAllAdmins: getAllAdmins,
        getIdParam: getIdParam,
        //getOne: getOne,
        postAdmins: postAdmins,
        put: put,
        deleteOneAdmin: deleteOneAdmin,
        //params: params
    }
};