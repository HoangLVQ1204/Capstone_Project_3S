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
            var rs =  socket.socket.receiverSocket("");
            console.log(rs)
            should.equal(rs, undefined);
            done();
        });

        //it("UTCID01", function(done) {
        //    var rs =  socket.socket.receiverSocket(null);
        //    expect(rs).to.equal("");
        //    done();
        //});
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