/**
 * Created by KhanhKC on 12/02/2015.
 */

 var expect  = require("chai").expect;
 var request = require("request");
 var server = require('../server');
 var orderManage = require("../manages/orderManage")(server.app);
 var storeManage = require("../manages/storeManage")(server.app);

/*
 * By KhanhKC - 01/12/2015
 *
 * These UT functions is used to test ORDER-MANAGE FUNCTIONS
 *
 * */
describe("ORDER API FOR STORE:", function () {

    describe("FUNCTION GET ALL ORDER OF STORE FOR DASHBOARD:", function () {

       
        it("Test case ST01_01", function (done) {
            orderManage.getAllOrder("null").then(function (rs){

            },function(er){
                expect(er).to.deep.equal(new Error('empty'));
                done();
            });
        });

        it("Test case ST01_02", function (done) {
             orderManage.getAllOrder("STR001").then(function (rs){
                console.log("===========2=========");
                console.log(rs);
                console.log("===========2=========");
                expect(rs).to.be.not.null;
                done();
            },function(er){
                //console.log(er);
                //expect(er).to.deep.equal(new Error('empty'));
                //done();
            });
        });

        it("Test case ST01_03", function (done) {
             orderManage.getAllOrder("STR002").then(function (rs){
                console.log("===========3=========");
                console.log(rs);
                console.log("===========3=========");
                expect(rs).to.be.not.null;
                done();
            },function(er){
                //console.log(er);
                //expect(er).to.deep.equal(new Error('empty'));
                //done();
            });
        });

        it("Test case ST01_04", function (done) {
             orderManage.getAllOrder("abc").then(function (rs){
                // expect(rs).to.be.not.null;
                // done();
            },function(er){
                console.log("===========4=========");
                console.log(er);
                console.log("===========4=========");
                expect(er).to.deep.equal(new Error('empty'));
                done();
            });
        });
    });

    /*
     * By KhanhKC - 01/12/2015
     * Test calcalate ship fee of a store
     */
    describe("FUNCTION CALCULATE SHIP FEE:", function () {
        //TEST CASE SP01_01
        var innerCity = ['001','002','003','005','006','007','008','009'];

        it("Test case ST01_01", function (done) {
            expect(orderManage.calculateShipFee(null,null,null)).to.deep.equal("Undefind");            
            done();            
        });

        it("Test case ST01_02", function (done) {
            expect(orderManage.calculateShipFee(null,null,1)).to.deep.equal("Undefind");            
            done();            
        });

        it("Test case ST01_03", function (done) {
            expect(orderManage.calculateShipFee(null,null,2)).to.deep.equal("Undefind");            
            done();            
        });               

        it("Test case ST01_04", function (done) {
            expect(orderManage.calculateShipFee(null,innerCity,null)).to.deep.equal("Undefind");            
            done();
        });               

        it("Test case ST01_05", function (done) {
            expect( orderManage.calculateShipFee(null,innerCity,1)).to.deep.equal("Undefind");            
            done();            
        });               

        it("Test case ST01_06", function (done) {
            expect(orderManage.calculateShipFee(null,innerCity,2)).to.deep.equal("Undefind");            
            done();            
        });               

        it("Test case ST01_07", function (done) {
            expect(orderManage.calculateShipFee('001',null,null)).to.deep.equal("Undefind");            
            done();
        });               

        it("Test case ST01_08", function (done) {
            expect(orderManage.calculateShipFee('001',null,1)).to.deep.equal("Undefind");
            done();
        });               

        it("Test case ST01_09", function (done) {
            expect(orderManage.calculateShipFee('001',null,2)).to.deep.equal("Undefind");            
            done();
        });               

        it("Test case ST01_10", function (done) {
            expect(orderManage.calculateShipFee('001',innerCity,null)).to.deep.equal("Undefind");
            done();            
        });               

        it("Test case ST01_11", function (done) {
            expect(orderManage.calculateShipFee('001',innerCity,1)).to.deep.equal(10000);            
            done();
        });               

        it("Test case ST01_12", function (done) {           
            expect(orderManage.calculateShipFee('001',innerCity,2)).to.deep.equal(20000);            
            done();
        });     

        it("Test case ST01_13", function (done) {
            expect(orderManage.calculateShipFee('011',null,null)).to.deep.equal("Undefind");            
            done();
        });               

        it("Test case ST01_14", function (done) {
            expect(orderManage.calculateShipFee('011',null,1)).to.deep.equal("Undefind");
            done();
        });               

        it("Test case ST01_15", function (done) {
            expect(orderManage.calculateShipFee('011',null,2)).to.deep.equal("Undefind");            
            done();
        });               

        it("Test case ST01_16", function (done) {
            expect(orderManage.calculateShipFee('011',innerCity,null)).to.deep.equal("Undefind");
            done();            
        });               

        it("Test case ST01_17", function (done) {
            expect(orderManage.calculateShipFee('011',innerCity,1)).to.deep.equal(20000);            
            done();
        });               

        it("Test case ST01_18", function (done) {           
            expect(orderManage.calculateShipFee('011',innerCity,2)).to.deep.equal(30000);            
            done();
        });              


    });

/*
     * By KhanhKC - 01/12/2015
     * Test calculate over weight fee of a store
     */
    describe("FUNCTION CALCAULATE OVER WEIGHT FEE:", function () {
        //TEST CASE SP01_01
        var innerCity = ['001','002','003','005','006','007','008','009'];
        var listgoods = [
            {
                amount:5,
                weight: 3000
            },
            {
                amount: 4,
                weight: 4000
            }

        ];

        it("Test case ST02_01", function (done) {
            expect(orderManage.calculateOverWeightFee(null,null,null)).to.deep.equal("Undefind");            
            done();            
        });

        it("Test case ST02_02", function (done) {
            expect(orderManage.calculateOverWeightFee(null,null,[])).to.deep.equal("Undefind");            
            done();            
        });

        it("Test case ST02_03", function (done) {
            expect(orderManage.calculateOverWeightFee(null,null,listgoods)).to.deep.equal("Undefind");            
            done();            
        });               

        it("Test case ST02_04", function (done) {
            expect(orderManage.calculateOverWeightFee(null,innerCity,null)).to.deep.equal("Undefind");            
            done();
        });               

        it("Test case ST02_05", function (done) {
            expect( orderManage.calculateOverWeightFee(null,innerCity,[])).to.deep.equal("Undefind");            
            done();            
        });               

        it("Test case ST02_06", function (done) {
            expect(orderManage.calculateOverWeightFee(null,innerCity,listgoods)).to.deep.equal("Undefind");            
            done();            
        });               

        it("Test case ST02_07", function (done) {
            expect(orderManage.calculateOverWeightFee('001',null,null)).to.deep.equal("Undefind");            
            done();
        });               

        it("Test case ST02_08", function (done) {
            expect(orderManage.calculateOverWeightFee('001',null,[])).to.deep.equal("Undefind");
            done();
        });               

        it("Test case ST02_09", function (done) {
            expect(orderManage.calculateOverWeightFee('001',null,listgoods)).to.deep.equal("Undefind");            
            done();
        });               

        it("Test case ST02_10", function (done) {
            expect(orderManage.calculateOverWeightFee('001',innerCity,null)).to.deep.equal("Undefind");
            done();            
        });               

        it("Test case ST02_11", function (done) {
            expect(orderManage.calculateOverWeightFee('001',innerCity,[]))>0;            
            done();
        });               

        it("Test case ST02_12", function (done) {           
            expect(!orderManage.calculateOverWeightFee('001',innerCity,listgoods))>0;            
            done();
        });     

        it("Test case ST02_13", function (done) {
            expect(orderManage.calculateOverWeightFee('011',null,null)).to.deep.equal("Undefind");            
            done();
        });               

        it("Test case ST02_14", function (done) {
            expect(orderManage.calculateOverWeightFee('011',null,[])).to.deep.equal("Undefind");
            done();
        });               

        it("Test case ST02_15", function (done) {
            expect(orderManage.calculateOverWeightFee('011',null,listgoods)).to.deep.equal("Undefind");            
            done();
        });               

        it("Test case ST02_16", function (done) {
            expect(orderManage.calculateOverWeightFee('011',innerCity,null)).to.deep.equal("Undefind");
            done();            
        });               

        it("Test case ST02_17", function (done) {
            expect(orderManage.calculateOverWeightFee('011',innerCity,[]))>0;            
            done();
        });               

        it("Test case ST02_18", function (done) {           
            expect(orderManage.calculateOverWeightFee('011',innerCity,listgoods))>0;            
            done();
        });              


    });

    /*
     * By KhanhKC - 01/12/2015
     * Test function get orders for order history
     */

    describe("FUNCTION GET LIST ORDER:", function () {
        //TEST CASE SP01_01
        it("Test case SP08_01", function (done) {
            orderManage.storeGetOrderList("STR001").then(function (rs){
                expect(rs).to.be.not.null;
                done();
            },function(er){
                //console.log(er);
                //expect(er).to.deep.equal(new Error('empty'));
                done();
            });
        });

        it("Test case SP08_02", function (done) {
            orderManage.storeGetOrderList("abc").then(function(rs){
                expect(rs).to.be.not.null;
                done();
            },function(er){
                expect(er).to.deep.equal(new Error('empty'));
                done();
            })
        });

        it("Test case SP08_03", function (done) {
            orderManage.storeGetOrderList(null).then(function(rs){
                expect(rs).to.be.not.null;
                done();
            },function(er){
                //console.log(er);
                expect(er).to.deep.equal(new Error('empty'));
               done();
            });
        });

    });

    
    describe.only("FUNCTION POST ORDER:", function () {
        //TEST CASE SP01_01
        var data = {
            order:{
                storeid: 'STR001',
                ordertypeid : '1',
                pickupaddress: '12,Ha Noi',
                deliveryaddress: '120',
                recipientphone: '0989898998',
                recipientname: 'Kieu Cao Khanh',
                statusid: '1',
                isdraff: false,
                deliveryprovinceid: '01',
                deliverydistrictid:'001',
                deliverywardid:'00001',
                gatheringCode:'123456',
                deliverCode:'435654',
                cod:20000
            },
            goods:[
            {
                goodsname: 'abc',
                description:'',
                weight: 3000,
                lengthsize: 30,
                widthsize: 30,
                heightsize: 30,
                amount: 5
            }]
        }
        it("Test case SP04_01", function (done) {
            orderManage.postOneOrder(data).then(function (rs){
                // console.log("================");
                // console.log(rs);
                // console.log("================");
                expect(rs).to.be.not.null;
                done();
            },function(er){
                //console.log(er);
                //expect(er).to.deep.equal(new Error('empty'));
                done();
            });
        });
        
        it("Test case SP04_03", function (done) {
            expect(orderManage.postOneOrder(null)).to.deep.equal("data is empty");
            done();
            
        });

    });

    describe.only("FUNCTION Update ORDER:", function () {
        //TEST CASE SP01_01
        var data = {
            order:{
                ordertypeid : '1',
                deliveryaddress: '120',
                recipientphone: '0989898998',
                recipientname: 'Kieu Cao Khanh',
                deliveryprovinceid: '01',
                deliverydistrictid:'001',
                deliverywardid:'00001',
                cod:20000
            },
            listgoods:[
            {
                goodsname: 'abc',
                description:'',
                weight: 3000,
                lengthsize: 30,
                widthsize: 30,
                heightsize: 30,
                amount: 5
            },
            user:[{storeid:STR001}]]
        }
        it("Test case SP04_01", function (done) {
            orderManage.postOneOrder(data).then(function (rs){
                // console.log("================");
                // console.log(rs);
                // console.log("================");
                expect(rs).to.be.not.null;
                done();
            },function(er){
                //console.log(er);
                //expect(er).to.deep.equal(new Error('empty'));
                done();
            });
        });
        
        it("Test case SP04_03", function (done) {
            expect(orderManage.postOneOrder(null)).to.deep.equal("data is empty");
            done();
            
        });

    });


    describe("FUNCTION GET LIST STORE NAME:", function () {
    //TEST CASE SP01_01
        var listStoreID1 = ['STR001','STR002'];
        var listStoreID2 = ['TR001','STR005'];
        it("Test case SP09_01", function (done) {
            storeManage.getAllStoreName(null).then(function(rs){
            },function(er){
               expect(er).to.deep.equal(new Error('emt'));
               done();
            })
        });

        it("Test case SP09_02", function (done) {
            storeManage.getAllStoreName([]).then(function(rs){
            },function(er){
                expect(er).to.deep.equal(new Error('empty'));
                done();
            })
        });

        it("Test case SP08_03", function (done) {
            storeManage.getAllStoreName(listStoreID2).then(function(rs){
            },function(er){
                console.log("======================");
                console.log(er);
                console.log("======================");
                expect(er).to.be.not.null;
                done();
            })
        });

         it("Test case SP08_04", function (done) {
            storeManage.getAllStoreName(listStoreID1).then(function(rs){
            },function(er){
                expect(er).to.be.not.null;
                done();
            })
        });

    });


});