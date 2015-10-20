
module.exports = function(app){

 	var controller = require('./../../manages/userController')(app);
	var authManage = require('./../../manages/authManage')(app);

 	app.param('user_id', controller.params);

	app.get('/users',authManage.checkToken(),controller.get);



	//app.get('/users',function(req,res,next){
	//		controller.get(next).then(function(user){
	//			res.status(200).json(user);
	//		})
	//	});
}