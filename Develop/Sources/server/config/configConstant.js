/**
 * Created by Kaka Hoang Huy on 10/22/2015.
 */

var pathToStatusList = require('./statusList.json');

var constant = {
    orderType: {
        EXPRESS_TYPE: 1,
        COMMON_TYPE: 2
    },
    statusList: pathToStatusList
};
module.exports = constant;