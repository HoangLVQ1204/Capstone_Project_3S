/**
 * Created by Cao Khanh on 21/10/2015.
 */
var _ = require('lodash');

module.exports = function (app) {
    var db = app.get('models');

    // var getOverView = function (req, res, next) {
    //     var listStore;
    //     var listShipper;
    //     db.store.getAllStores()
    //         .then(function (Rs) {
    //             for(var i = 0; i < Rs.length;i++){
    //                 listStore.push(
    //                     {
    //                         'storeid': Rs[i].storeid,
    //                         'storeName' : Rs[i].name
    //                     }
    //                 );
    //             }
    //         }, function (err) {
    //             next(err);
    //         })
    //     db.user.getUserByRole(1)
    //         .then(function(Rs){
    //             listShipper = Rs;
    //         },function(err){
    //             next(err);
    //         })
    //     var data = {'listShipper' : listShipper, 'listStore': listStore};
    //     res.status(200).json(data);
    // };

    

    return {
        // getOverView: getOverView,
        
    }
}