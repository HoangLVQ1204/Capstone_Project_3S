var UserRouter = require('../api/user/userRoutes');
var IssueRouter = require('../api/issue/issueRoutes');

module.exports = function (app) {
    
    UserRouter(app);
    IssueRouter(app);

};
