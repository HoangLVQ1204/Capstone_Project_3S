var logger = require('./util/logger');
var express = require('express');
var app = express();
var config = require('./config/config');


// setup app management
require('./management/middleware_manage')(app);

// setup routes
require('./management/api_manage')(app);

// setup global error handler
app.use(function(err, req, res, next) {
	logger.error(err.stack);
	res.status(500).send('Oops');
})

// setup database, start server after syncing database
app.get('models').sequelize.sync().then(function() {
	app.listen(config.port, function() {
		logger.log('Listening on http://localhost:' + config.port);
	});
});