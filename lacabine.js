/**
 * Module dependencies.
 */

var express = require('express'), routes = require('./routes'), http = require('http'), path = require('path'), socket = require('socket.io'), lessMiddleware = require('less-middleware');

var app = express();

app.configure(function() {
	app.set('port', process.env.PORT || 3000);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'ejs');
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(lessMiddleware(path.join(__dirname, '/public')));
	app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function() {
	app.use(express.errorHandler());
});

app.get('/selection', routes.selection);
app.get('/inkling', routes.inkling);
app.get('/play/:file', routes.play);
app.get('/cover/:file', routes.cover);
app.get('/video/:file', routes.video);
app.get('/feedback/:file/:level', routes.feedback);
app.post('/postImg/:frame', routes.postImg);
app.get('/generateAnim/:file', routes.generateAnim);

var server = http.createServer(app).listen(app.get('port'), function() {
	console.log("Express server listening on port " + app.get('port'));
});

global.io = socket.listen(server, {
	log : false
});

