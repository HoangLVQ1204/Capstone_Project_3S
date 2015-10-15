/**
 * Created by Cao Khanh on 15/10/2015.
 */
var _ = require('lodash');

module.exports = function (app) {
    var db = app.get('models');
    var get = function (req, res, next) {
        db.orders.findAll({
            attributes: ['orderid', 'deliveryaddress', 'goods']
        })
        okReturn()
            .then(function (orderRs) {
                res.status(200).json(orderRs.map(function (order) {
                    return order.toJSON()
                }));
            }, function (err) {
                next(err);
            })
    }

    return{
        get: get
    }
}
var okReturn = function () {
    return "OKKKKKK";
}