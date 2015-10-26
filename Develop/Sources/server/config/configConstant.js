/**
 * Created by Kaka Hoang Huy on 10/22/2015.
 */

var pathToExpressStatus = require('./expressStatusList.json');
var pathToNormalStatus = require('./normalStatusList.json');

var constant = {
    orderType: {
        EXPRESS_TYPE: 1,
        COMMON_TYPE: 2
    },
    expressStatusList: pathToExpressStatus,
    normalStatusList: pathToNormalStatus
};
module.exports = constant;