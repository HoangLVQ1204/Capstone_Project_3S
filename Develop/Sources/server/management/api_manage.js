var UserRouter = require('../api/user/userRoutes');
var IssueRouter = require('../api/issue/issueRoutes');
var OrderRouter = require('../api/order/orderRoutes');

module.exports = function (app) {
    
    UserRouter(app);
    IssueRouter(app);
    OrderRouter(app);

};
