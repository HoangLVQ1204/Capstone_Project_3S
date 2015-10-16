var bodyParser     = require('body-parser');
var morgan 		   = require('morgan');
var methodOverride = require('method-override');
var path           = require('path');
var express 	   = require('express');
var logger         = require('./util/logger');
var config         = require('./config/config');
var models 		   = require('./entities');
var cors = require('cors');
var app            = express();

// setup middleware
app.set('models', models);
app.use(express.static(path.resolve('other')));
app.use('/libs',express.static(path.join(__dirname, '../node_modules')));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(cors());
// setup routes
require('./routes')(app);

// seed the database
//if (config.seed) {
//	require('./util/seedDB')(app);
//};

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