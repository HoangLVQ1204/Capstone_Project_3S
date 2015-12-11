/**
 * Created by Kaka Hoang Huy on 12/1/2015.
 */

var expect  = require("chai").expect;
var request = require("request");
var server = require('../server');
var shipperManage = require("../manages/shipperManage")(server.app);

/*
 * By HuyTDH - 30/11/2015
 *
 * These UT functions is used to test ORDER-MANAGE FUNCTIONS
 *
 * */
describe("SHIPPER-MANAGE FUNCTIONS TEST:", function () {

    /*
     * By HuyTDH - 11/29/15
     * Test GET ALL ORDERS of store
     */
    describe("FUNCTION GET ALL TASK HISTORY:", function () {
        //TEST CASE SP01_01
        it("Test case SP01_01", function (done) {
            shipperManage.getHistory("SP000002", 1).then(function(rs){
            },function(er){
                //expect(false).to.be.true;
            }).then(function(){
                done();
            });
        });

        it("Test case SP01_01", function (done) {
            shipperManage.getHistory("SP000001", 1).then(function(rs){
            },function(er){
                //expect(false).to.be.true;
            }).then(function(){
                done();
            });
        });

        it("Test case SP01_02", function (done) {
            shipperManage.getHistory(null, null).then(function(rs){
                console.log(rs)
            },function(er){
                expect(er).to.equal("Can't not get datas");
            }).then(function(){
                done();
            });
        });

    });
});