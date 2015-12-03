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
        it.only("Test case SP01_01", function (done) {
            shipperManage.getHistory("SP000002", 1).then(function(rs){
                expect({ foo: 'baz' }).to.have.property('foo')
                    .and.not.equal('baz');
                //console.log(rs);
                //expect(rs).to.equal(2);
                done();
            },function(er){
                //expect(false).to.be.true;
                done();
            }).then(function(){
                //done();
            });
        });

        it("Test case OD01_02", function (done) {
            shipperManage.getAllOrder(null).then(function(rs){
            },function(er){
                expect(er).to.equal("Can't not get datas");
            }).then(function(){
                done();
            });
        });

    });

    describe("FUNCTION2 GET ALL ORDER:", function () {
        //TEST CASE SP01_01
        it("Test case OD01_01", function (done) {
            shipperManage.getAllOrder("STR001").then(function(rs){
                expect(rs).not.to.be.null;
            },function(er){
                expect(er).to.be.null;
            }).then(function(){
                done();
            });
        });

        it("Test case OD01_02", function (done) {
            shipperManage.getAllOrder(null).then(function(rs){
            },function(er){
                expect(er).to.equal("Can't not get datas");
            }).then(function(){
                done();
            });
        });

    });
});