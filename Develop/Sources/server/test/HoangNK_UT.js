/**
 * Created by HoangNK
 */

var expect  = require("chai").expect;
var request = require("request");
var server = require('../server');
var orderManage = require("../manages/orderManage")(server.app);
var storeManage = require("../manages/storeManage")(server.app);
var shipperManage = require("../manages/shipperManage")(server.app);
var userManage = require("../manages/userManage")(server.app);

/*
 * By HoangNK - 30/11/2015
 *
 * These UT functions is used to test ORDER-MANAGE FUNCTIONS
 *
 * */
describe("ADD NEW SHIPPER FUNCTIONS TEST:", function () {

    /*
     * By HoangNK - 11/29/15
     * Test GET ALL ORDERS of store
     */
    describe("FUNCTION ADD NEW SHIPPER ID:", function () {
        //TEST CASE AD_Function1
        //var user1 = null;
        //it("Test case AD_Function1_01", function (done) {
        //    userManage.addNewUser(user1).then(function(rs){
        //        //expect(rs).not.to.be.null;
        //        console.log('BBB');
        //    },function(er){
        //        //expect(er).to.be.not.null;
        //        console.log('AAA');
        //        //done();
        //    }).catch(function(err){
        //        console.log(err);
        //        done();
        //    });
        //});

        var user2 = {
            account: {
                'username' : 'SP111111',
                'userrole': 1,
                'userstatus': 2
            },
            profile: {
                'username' : 'SP111111',
                'name': 'Nguyen Van A',
                'identitycard': '123456789',
                'address': 'So 36, Xuan Thuy, Cau Giay, Ha Noi',
                'dob': '01/01/1993',
                'email': 'nguyenvana@gmail.com',
                'phonenumber': '0986468965',
                'avatar': './default.png',
            }
        }
        it("Test case AD_Function1_02", function (done) {
            userManage.addNewUser(user2).then(function (rs){
            }).catch(function(err){
                //console.log(er);
                //var err = new ReferenceError('This is a bad function.');
                //var fn = function () { throw err; }
                done(err);
                //expect(er).to.throw(Error);
            })
        });

    });
});