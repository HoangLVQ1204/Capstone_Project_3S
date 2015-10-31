/**
 * Created by hoanglvq on 10/17/15.
 */
var jwt         = require('jsonwebtoken');
var config      = require('../config/config');
var expressJwt  = require('express-jwt')({ secret: config.secrets.jwt });
var fs          = require('fs');


module.exports  = function(app){

    /*
     * By HoangLVQ - 22/10/2015
     *
     * This function is used to get entity
     *
     * */
    var db = app.get('models');

    /*
     * By HoangLVQ - 22/10/2015
     *
     * This function is used to check token if valid
     *
     * */
    var checkToken = function(){
        return true;
        return function(req,res,next){
            expressJwt(req,res,next);
        }
    };

    /*
     * By HoangLVQ - 22/10/2015
     *
     * This function is used to check role of current login user
     * (1) : shipper
     * (2) : store
     * (3) : admin
     *
     * */
    var checkRole = function(){
        return function(req,res,next){

            var currentRoute        = req.route.path;
            console.log('ccc', currentRoute);
            var currentRole         = req.user.userrole;
            var currentAccessRoles  = [];
            config.pathAccessRole.forEach(function(item){
                console.log(item);
                if(item.url == currentRoute){
                    currentAccessRoles = item.role;
                    return;
                }
            });

            if(currentAccessRoles.indexOf(currentRole) != -1){
                next();
            }else{
                console.log("err");
                res.status(401).send('Your permission is denied');
            }
        }
    }



    /*
     * By HoangLVQ - 22/10/2015
     *
     * This function is used to verify user if user is exist
     *
     * */
    var verifyUser = function(){
        return function(req,res,next){
            var userName = req.body.username;
            var passWord = req.body.password;

            if(!userName || !passWord) {
                res.status(400).send(req.body);
                return;
            }

            db.user.findUserByUsername(userName)
                .then(function(user){
                    if(!user){
                        res.status(401).send('No user with the given username');
                    }else{

                        if(!user.authenticate(passWord)){
                            res.status(401).send('Wrong password');
                        }else{

                            //db.managestore.getAllData(db)
                            //    .then(function(data){
                            //        console.log("DATA HERE: ");
                            //        console.log(data);
                            //    })

                            if(user.userrole == 2 ){
                                db.managestore.getStoresOfUser(user.username)
                                    .then(function(listStore){
                                        var stores = listStore.map(function(data){
                                            console.log(data.toJSON().storeid);
                                            return data.toJSON().storeid;
                                        });
                                        user.stores = stores;
                                        req.user = user;
                                        next();
                                    },function(err){
                                        next(err);
                                    });
                            }else{
                                req.user = user;
                                next();
                            }

                        }
                    }
                },function(err){
                    next(err);
                });
        }
    }

    /*
     * By HoangLVQ - 22/10/2015
     *
     * This function is used to generate a new token for client
     *
     * */
    var signToken = function(user){

        return jwt.sign(
            {
                username       : user.username,
                userrole       : user.userrole,
                userstatus     : user.userstatus,
                workingstatusid: user.workingstatusid,
                stores         : user.stores,
                time           : new Date()
            },
            config.secrets.jwt,
            {
                expiresIn: config.expireTime
            }
        )
    }

    /*
     * By HoangLVQ - 22/10/2015
     *
     * This function is used to sign in
     *
     * */
    var signIn = function (){

        return function(req,res,next){

            var newToken = signToken(req.user);

            console.log("New Token: "+newToken);

            res.json({
                token: newToken
            })
        }
    }

    return {
        verifyUser: verifyUser,
        signIn : signIn,
        checkToken: checkToken,
        checkRole: checkRole
    }
}