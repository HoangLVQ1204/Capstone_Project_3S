/**
 * Created by hoanglvq on 12/1/15.
 */
var expect  = require("chai").expect;
var should  = require("chai").should();
var server = require('../server');
var socket = server.app.get('io');
/*
 * By HoangLVQ - 30/11/2015
 *
 * This function is used to test shipper API
 *
 * */

describe("Socket Server", function() {


    describe("receiverSocket(receiver)", function() {

        it("UTCID01", function(done) {
            expect(function(){
                socket.socket.receiverSocket(null);
            }).to.throw('Receiver is null');
            done();
        });

        it("UTCID02", function(done) {
            var result =  socket.socket.receiverSocket("");
            // console.log(rs)
            // should.equal(rs, undefined);
            expect(result).to.be.undefined;
            done();
        });

        it("UTCID03", function(done) {
            var input1 = "admin";
            var result = socket.socket.receiverSocket(input1);
            expect(result).to.be.an('object');
            done();
        });        

        it("UTCID04", function(done) {
            var input1 = {};
            var result = socket.socket.receiverSocket(input1);
            expect(result).to.be.undefined;
            done();
        });                
        
        it("UTCID05", function(done) {
            var input1 = { room: '' };
            var result = socket.socket.receiverSocket(input1);
            expect(result).to.be.undefined;
            done();
        });                
        
        it("UTCID06", function(done) {
            var input1 = { room: 'SP000001' };
            var result = socket.socket.receiverSocket(input1);
            expect(result).to.be.an('object');
            done();
        });                

        it("UTCID07", function(done) {
            var input1 = {};
            var result = socket.socket.receiverSocket(input1);
            expect(result).to.be.undefined;
            done();
        });                
        
        it("UTCID08", function(done) {
            var input1 = { clientID: '' };
            var result = socket.socket.receiverSocket(input1);
            expect(result).to.be.undefined;
            done();
        });                
        
        it("UTCID09", function(done) {
            var input1 = { clientID: 'ST000001', type: 'shipper' };
            var result = socket.socket.receiverSocket(input1);
            expect(result).to.be.undefined;
            done();
        });                

        it("UTCID10", function(done) {
            var input1 = { clientID: 'ST000001', type: 'store' };
            var result = socket.socket.receiverSocket(input1);
            expect(result).to.be.an('object');
            done();
        });                

        it("UTCID11", function(done) {
            var input1 = { clientID: 'ST000001', type: 'admin' };
            var result = socket.socket.receiverSocket(input1);
            expect(result).to.be.undefined;
            done();
        });                

        it("UTCID12", function(done) {
            var input1 = { clientID: 'ST000001', type: null };
            var result = socket.socket.receiverSocket(input1);
            expect(result).to.be.undefined;
            done();
        });                

        it("UTCID13", function(done) {
            var input1 = { clientID: 'ST000001', type: '' };
            var result = socket.socket.receiverSocket(input1);
            expect(result).to.be.undefined;
            done();
        });                
    });
    
    describe("reply(receiver, msg, eventName, callback)", function() {

        it("UTCID01", function(done) {
            var receiver = null;
            var msg = null;
            var eventName = null;
            var callback = null;
            expect(function(){
                socket.socket.reply(receiver, msg, eventName, callback);
            }).to.throw('Invalid receiver');
            done();
        });

        it("UTCID02", function(done) {
            var receiver = {};
            var msg = {};
            var eventName = "";
            var callback = null;
            expect(function(){
                socket.socket.reply(receiver, msg, eventName, callback);
            }).to.throw('Invalid receiver');
            done();
        });

        it("UTCID03", function(done) {
            var receiver = { clientID: '' };
            var msg = {};
            var eventName = "";
            var callback = null;
            expect(function(){
                socket.socket.reply(receiver, msg, eventName, callback);
            }).to.throw('Invalid receiver');
            done();
        });        

        it("UTCID04", function(done) {
            var receiver = { clientID: 'SP000001', type: 'shipper' };
            var msg = {};
            var eventName = 'event';
            var callback = null;            
            var result = socket.socket.reply(receiver, msg, eventName, callback);
            expect(result).to.be.undefined;
            done();
        });                
        
        it("UTCID05", function(done) {
            var receiver = { clientID: 'SP000001', type: 'store' };
            var msg = {};
            var eventName = 'event';
            var callback = function() {};            
            expect(function(){
                socket.socket.reply(receiver, msg, eventName, callback);
            }).to.throw('Invalid receiver');
            done();
        });                
        
        it("UTCID06", function(done) {
            var receiver = { clientID: 'SP000001', type: 'admin' };
            var msg = {};
            var eventName = 'event';
            var callback = function() {};            
            expect(function(){
                socket.socket.reply(receiver, msg, eventName, callback);
            }).to.throw('Invalid receiver');
            done();
        });                

        it("UTCID07", function(done) {
            var receiver = { clientID: 'SP000001', type: null };
            var msg = {};
            var eventName = 'event';
            var callback = function() {};            
            expect(function(){
                socket.socket.reply(receiver, msg, eventName, callback);
            }).to.throw('Invalid receiver');
            done();
        });                
        
        it("UTCID08", function(done) {
            var receiver = { clientID: 'SP000001', type: '' };
            var msg = {};
            var eventName = 'event';
            var callback = function() {};            
            expect(function(){
                socket.socket.reply(receiver, msg, eventName, callback);
            }).to.throw('Invalid receiver');
            done();
        });                 

    });

    describe("forward(sender, receiver, msg, eventName, callback)", function() {

        it("UTCID01", function(done) {
            var sender = null;
            var receiver = null;
            var msg = null;
            var eventName = null;
            var callback = null;
            expect(function(){
                socket.socket.forward(sender, receiver, msg, eventName, callback);
            }).to.throw('Invalid receiver');
            done();
        });

        it("UTCID02", function(done) {
            var sender = {};
            var receiver = '';
            var msg = {};
            var eventName = '';
            var callback = null;
            expect(function(){
                socket.socket.forward(sender, receiver, msg, eventName, callback);
            }).to.throw('Invalid receiver');
            done();
        });

        it("UTCID03", function(done) {
            var sender = { clientID: '' };
            var receiver = 'shipper';
            var msg = {};
            var eventName = 'event';
            var callback = null;
            var result = socket.socket.forward(sender, receiver, msg, eventName, callback);
            expect(result).to.be.undefined;            
            done();
        });        

        it("UTCID04", function(done) {
            var sender = { clientID: 'ST000001', type: 'store' };
            var receiver = {};
            var msg = {};
            var eventName = 'event';
            var callback = null;
            expect(function(){
                socket.socket.forward(sender, receiver, msg, eventName, callback);
            }).to.throw('Invalid receiver');
            done();
        });                
        
        it("UTCID05", function(done) {
            var sender = { clientID: 'ST000001', type: 'store' };
            var receiver = { room: '' };
            var msg = {};
            var eventName = 'event';
            var callback = null;
            expect(function(){
                socket.socket.forward(sender, receiver, msg, eventName, callback);
            }).to.throw('Invalid receiver');
            done();
        });                
        
        it("UTCID06", function(done) {
            var sender = { clientID: 'ST000001', type: 'store' };
            var receiver = { room: 'SP000001' };
            var msg = {};
            var eventName = 'event';
            var callback = null;
            var result = socket.socket.forward(sender, receiver, msg, eventName, callback);
            expect(result).to.be.undefined;            
            done();
        });                

        it("UTCID07", function(done) {
            var sender = { clientID: 'ST000001', type: 'store' };
            var receiver = {};
            var msg = {};
            var eventName = 'event';
            var callback = null;
            expect(function(){
                socket.socket.forward(sender, receiver, msg, eventName, callback);
            }).to.throw('Invalid receiver');
            done();
        });                
        
        it("UTCID08", function(done) {
            var sender = { clientID: 'ST000001', type: 'store' };
            var receiver = { clientID: '' };
            var msg = {};
            var eventName = 'event';
            var callback = function() {};
            expect(function(){
                socket.socket.forward(sender, receiver, msg, eventName, callback);
            }).to.throw('Invalid receiver');
            done();
        });                 

        it("UTCID09", function(done) {
            var sender = { clientID: 'ST000001', type: 'store' };
            var receiver = { clientID: 'SP000001', type: 'shipper' };
            var msg = {};
            var eventName = 'event';
            var callback = function() {};            
            var result = socket.socket.forward(sender, receiver, msg, eventName, callback);
            expect(result).to.be.undefined;            
            done();
        });                 

        it("UTCID10", function(done) {
            var sender = { clientID: 'ST000001', type: 'store' };
            var receiver = { clientID: 'SP000001', type: 'store' };
            var msg = {};
            var eventName = 'event';
            var callback = function() {};
            expect(function(){
                socket.socket.forward(sender, receiver, msg, eventName, callback);
            }).to.throw('Invalid receiver');
            done();
        });                 

        it("UTCID11", function(done) {
            var sender = { clientID: 'ST000001', type: 'store' };
            var receiver = { clientID: 'SP000001', type: 'admin' };
            var msg = {};
            var eventName = 'event';
            var callback = function() {};
            expect(function(){
                socket.socket.forward(sender, receiver, msg, eventName, callback);
            }).to.throw('Invalid receiver');
            done();
        });                 

        it("UTCID12", function(done) {
            var sender = { clientID: 'ST000001', type: 'store' };
            var receiver = { clientID: 'SP000001', type: null };
            var msg = {};
            var eventName = 'event';
            var callback = function() {};
            expect(function(){
                socket.socket.forward(sender, receiver, msg, eventName, callback);
            }).to.throw('Invalid receiver');
            done();
        });                          

        it("UTCID13", function(done) {
            var sender = { clientID: 'ST000001', type: 'store' };
            var receiver = { clientID: 'SP000001', type: '' };
            var msg = {};
            var eventName = 'event';
            var callback = null;
            expect(function(){
                socket.socket.forward(sender, receiver, msg, eventName, callback);
            }).to.throw('Invalid receiver');
            done();
        });                          

    });

    describe("addToRoom(socket, roomID)", function() {

        it("UTCID01", function(done) {
            var input1 = null;
            var input2 = null;
            expect(function(){
                socket.socket.addToRoom(input1, input2);
            }).to.throw('Invalid input');
            done();
        });

        it("UTCID02", function(done) {
            var input1 = null;
            var input2 = '';
            expect(function(){
                socket.socket.addToRoom(input1, input2);
            }).to.throw('Invalid input');
            done();
        });

        it("UTCID03", function(done) {
            var input1 = null;
            var input2 = 'shipper';
            expect(function(){
                socket.socket.addToRoom(input1, input2);
            }).to.throw('Invalid input');
            done();
        });        

        it("UTCID04", function(done) {
            var input1 = { join: function() {} };
            var input2 = null;
            var result = socket.socket.addToRoom(input1, input2);
            expect(result).to.be.undefined;
            done();
        });

        it("UTCID05", function(done) {
            var input1 = { join: function() {} };
            var input2 = '';
            var result = socket.socket.addToRoom(input1, input2);
            expect(result).to.be.undefined;
            done();
        });

        it("UTCID06", function(done) {
            var input1 = { join: function() {} };
            var input2 = 'shipper';
            var result = socket.socket.addToRoom(input1, input2);
            expect(result).to.be.undefined;
            done();
        });        

    });    
    
    describe("leaveRoom(socket, roomID)", function() {

        it("UTCID01", function(done) {
            var input1 = null;
            var input2 = null;
            expect(function(){
                socket.socket.leaveRoom(input1, input2);
            }).to.throw('Invalid input');
            done();
        });

        it("UTCID02", function(done) {
            var input1 = null;
            var input2 = '';
            expect(function(){
                socket.socket.leaveRoom(input1, input2);
            }).to.throw('Invalid input');
            done();
        });

        it("UTCID03", function(done) {
            var input1 = null;
            var input2 = 'shipper';
            expect(function(){
                socket.socket.leaveRoom(input1, input2);
            }).to.throw('Invalid input');
            done();
        });        

        it("UTCID04", function(done) {
            var input1 = { leave: function() {} };
            var input2 = null;
            var result = socket.socket.leaveRoom(input1, input2);
            expect(result).to.be.undefined;
            done();
        });

        it("UTCID05", function(done) {
            var input1 = { leave: function() {} };
            var input2 = '';
            var result = socket.socket.leaveRoom(input1, input2);
            expect(result).to.be.undefined;
            done();
        });

        it("UTCID06", function(done) {
            var input1 = { leave: function() {} };
            var input2 = 'shipper';
            var result = socket.socket.leaveRoom(input1, input2);
            expect(result).to.be.undefined;
            done();
        });        

    });    

    describe("getDataForStore(storeID)", function() {

        it("UTCID01", function(done) {
            var input1 = null;            
            var result = socket.socket.getDataForStore(input1);
            expect(result).to.be.an('object');
            done();
        });

        it("UTCID02", function(done) {
            var input1 = '';            
            var result = socket.socket.getDataForStore(input1);
            expect(result).to.be.an('object');
            done();
        });

        it("UTCID03", function(done) {
            var input1 = 'ST000001';            
            var result = socket.socket.getDataForStore(input1);
            expect(result).to.be.an('object');
            done();
        });        

    });    

    describe("getDataForShipper(shipperID)", function() {

        it("UTCID01", function(done) {
            var input1 = null;            
            var result = socket.socket.getDataForShipper(input1);
            expect(result).to.be.an('object');
            done();
        });

        it("UTCID02", function(done) {
            var input1 = '';            
            var result = socket.socket.getDataForShipper(input1);
            expect(result).to.be.an('object');
            done();
        });

        it("UTCID03", function(done) {
            var input1 = 'SP000001';            
            var result = socket.socket.getDataForShipper(input1);
            expect(result).to.be.an('object');
            done();
        });        

    });    

    describe("getShipperBySocketID(socketID)", function() {

        it("UTCID01", function(done) {
            var input1 = null;            
            var result = socket.socket.getShipperBySocketID(input1);
            expect(result).to.be.null;
            done();
        });

        it("UTCID02", function(done) {
            var input1 = '';            
            var result = socket.socket.getShipperBySocketID(input1);
            expect(result).to.be.null;
            done();
        });

        it("UTCID03", function(done) {
            var input1 = 'abc123';            
            var result = socket.socket.getShipperBySocketID(input1);
            expect(result).to.be.an('object');
            done();
        });        

    });    

    describe("getOrderIDsOfShipper(shipperID)", function() {

        it("UTCID01", function(done) {
            var input1 = null;            
            var result = socket.socket.getOrderIDsOfShipper(input1);
            expect(result).to.be.empty;            
            done();
        });

        it("UTCID02", function(done) {
            var input1 = '';            
            var result = socket.socket.getOrderIDsOfShipper(input1);
            expect(result).to.be.empty;
            done();
        });

        it("UTCID03", function(done) {
            var input1 = 'SP000001';            
            var result = socket.socket.getOrderIDsOfShipper(input1);
            expect(result.length).to.be.above(0);
            done();
        });        

    });    

    describe("getOrdersOfShipper(shipperID)", function() {

        it("UTCID01", function(done) {
            var input1 = null;            
            var result = socket.socket.getOrdersOfShipper(input1);
            expect(result).to.be.empty;            
            done();
        });

        it("UTCID02", function(done) {
            var input1 = '';            
            var result = socket.socket.getOrdersOfShipper(input1);
            expect(result).to.be.empty;
            done();
        });

        it("UTCID03", function(done) {
            var input1 = 'SP000001';            
            var result = socket.socket.getOrdersOfShipper(input1);
            expect(result.length).to.be.above(0);
            done();
        });        

    });        

    describe("getOneShipper(shipperID)", function() {

        it("UTCID01", function(done) {
            var input1 = null;            
            var result = socket.socket.getOneShipper(input1);
            expect(result).to.be.null;            
            done();
        });

        it("UTCID02", function(done) {
            var input1 = '';            
            var result = socket.socket.getOneShipper(input1);
            expect(result).to.be.null;
            done();
        });

        it("UTCID03", function(done) {
            var input1 = 'SP000001';            
            var result = socket.socket.getOneShipper(input1);
            expect(result).to.be.an('object');
            done();
        });        

    });        

    describe("findSocketIdByShipperId(shipperID)", function() {

        it("UTCID01", function(done) {
            var input1 = null;            
            var result = socket.socket.findSocketIdByShipperId(input1);
            expect(result).to.be.null;            
            done();
        });

        it("UTCID02", function(done) {
            var input1 = '';            
            var result = socket.socket.findSocketIdByShipperId(input1);
            expect(result).to.be.null;
            done();
        });

        it("UTCID03", function(done) {
            var input1 = 'SP000001';            
            var result = socket.socket.findSocketIdByShipperId(input1);
            expect(result).to.be.a('string');
            done();
        });        

    });        

    describe("getOneStore(storeID)", function() {

        it("UTCID01", function(done) {
            var input1 = null;            
            var result = socket.socket.getOneStore(input1);
            expect(result).to.be.null;            
            done();
        });

        it("UTCID02", function(done) {
            var input1 = '';            
            var result = socket.socket.getOneStore(input1);
            expect(result).to.be.null;
            done();
        });

        it("UTCID03", function(done) {
            var input1 = 'ST000001';            
            var result = socket.socket.getOneStore(input1);
            expect(result).to.be.an('object');
            done();
        });        

    });        

    describe("getNumberPendingShippersOfStore(storeID)", function() {

        it("UTCID01", function(done) {
            var input1 = null;            
            var result = socket.socket.getNumberPendingShippersOfStore(input1);
            expect(result).to.equal(0);            
            done();
        });

        it("UTCID02", function(done) {
            var input1 = '';            
            var result = socket.socket.getNumberPendingShippersOfStore(input1);
            expect(result).to.equal(0);
            done();
        });

        it("UTCID03", function(done) {
            var input1 = 'ST000001';            
            var result = socket.socket.getNumberPendingShippersOfStore(input1);
            expect(result).to.be.a('number');
            done();
        });        

    });        

        //it("UTCID01", function(done) {
        //    request(url, function(error, response, body) {
        //        expect(response.statusCode).to.equal(401);
        //        expect(body).not.to.be.null;
        //        done();
        //    });
        //});
        //
        //it("UTCID01", function(done) {
        //    request(url, function(error, response, body) {
        //        expect(response.statusCode).to.equal(401);
        //        expect(body).not.to.be.null;
        //        done();
        //    });
        //});
        //it("UTCID01", function(done) {
        //    request(url, function(error, response, body) {
        //        expect(response.statusCode).to.equal(401);
        //        expect(body).not.to.be.null;
        //        done();
        //    });
        //});
        //
        //it("UTCID01", function(done) {
        //    request(url, function(error, response, body) {
        //        expect(response.statusCode).to.equal(401);
        //        expect(body).not.to.be.null;
        //        done();
        //    });
        //});
        //
        //it("UTCID01", function(done) {
        //    request(url, function(error, response, body) {
        //        expect(response.statusCode).to.equal(401);
        //        expect(body).not.to.be.null;
        //        done();
        //    });
        //});
        //
        //it("UTCID01", function(done) {
        //    request(url, function(error, response, body) {
        //        expect(response.statusCode).to.equal(401);
        //        expect(body).not.to.be.null;
        //        done();
        //    });
        //});
        //
        //it("UTCID01", function(done) {
        //    request(url, function(error, response, body) {
        //        expect(response.statusCode).to.equal(401);
        //        expect(body).not.to.be.null;
        //        done();
        //    });
        //});
        //
        //it("UTCID01", function(done) {
        //    request(url, function(error, response, body) {
        //        expect(response.statusCode).to.equal(401);
        //        expect(body).not.to.be.null;
        //        done();
        //    });
        //});


});