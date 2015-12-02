/**
 * Created by Cao Khanh on 13/11/2015.
 */
 var _ = require('lodash');

module.exports = function (app) {
    var db = app.get('models');

    /*
        By KhanhKC
        This function is use to get all province
    */
    function getProvince(){
        var districtModel = db.district;
        var wardModel = db.ward;
        return db.province.getAllProvince(districtModel,wardModel)
        .then(function(province){
            return province;            
        }, function(err) {
            throw err;
        });
    }

    return {
        getAllProvince: getProvince      
    }
}