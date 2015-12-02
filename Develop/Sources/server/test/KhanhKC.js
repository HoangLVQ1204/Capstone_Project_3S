/**
 * Created by KhanhKC on 12/02/2015.
 */

var expect  = require("chai").expect;
var request = require("request");
var server = require('../server');
var orderManage = require("../manages/orderManage")(server.app);

/*
 * By KhanhKC - 01/12/2015
 *
 * These UT functions is used to test ORDER-MANAGE FUNCTIONS
 *
 * */
describe("ORDER API FOR STORE:", function () {

    /*
     * By KhanhKC - 01/12/2015
     * Test GET ALL ORDERS of a store
     */
    describe("FUNCTION GET ALL ORDER:", function () {
        //TEST CASE ST01_01
        // it("Test case ST01_01", function (done) {
        //     orderManage.getAllOrder("STR001").then(function(rs){
        //         console.log("===============rs============");
        //         console.log(rs);
        //         console.log("===============rs============");
        //         expect(rs).not.to.be.null;
        //     },function(er){
        //         expect(er).to.be.null;
        //     }).then(function(){
        //         done();
        //     });
        // });

        it("Test case ST01_02", function (done) {
            orderManage.getAllOrder("ST").then(function(rs){
            },function(er){
                console.log(er);

                // expect(er).to.deep.equal(new Error('empty'));
            }).then(function(){
                done();
            });

            // expect(function(){
            //     orderManage.getAllOrder("ST").then(function(rs){
                   
            //     },then(function(err){
            //         throw err;
            //     }))
            // }).to.throw('empty');

        });

        // it("Test case ST01_03", function (done) {
        //     orderManage.getAllOrder(null).then(function(rs){
        //     },function(er){
        //         console.log(er);
        //         expect(er).to.deep.equal(new Error('empty'));
        //     }).then(function(){
        //         done();
        //     });
        // });

    });
});