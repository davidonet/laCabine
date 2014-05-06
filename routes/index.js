/*
 * GET home page.
 */

var fs = require('fs');
var async = require('async');
var request = require('request');

function shuffleArray(array) {
	for (var i = array.length - 1; i > 0; i--) {
		var j = Math.floor(Math.random() * (i + 1));
		var temp = array[i];
		array[i] = array[j];
		array[j] = temp;
	}
	return array;
}

var mediadir = '/home/dolivari/Dropbox/Partages/partageLaCabine/mainum/';
var mediainfo = require("mediainfo");
var lData = [];
exports.selection = function(req, res) {
	var killProc = childProcess.exec('killall mplayer', function(error, stdout, stderr) {
		if (error) {
		}
	});
	killProc.on('exit', function(code) {
		console.log("players killed")
	});
	if (0 < lData.length) {
		res.json({
			imgs : lData
		});
	} else {
		fs.readdir(mediadir, function(err, files) {
			function isImage(element, index, array) {
				return (element.slice(-3) == 'jpg');
			};
			files = files.filter(isImage);

			var lData = [];
			async.each(files, function(file, done) {
				var moviename = file.slice(0, -3) + "mov";
				mediainfo(mediadir + moviename, function(err, res) {

					if (err) {
						return console.log(err);
					}
					lData.push({
						f : file,
						t : res[0].movie_name,
						i : moviename
					});
					done();
				});

			}, function(err) {
				res.json({
					imgs : lData
				});
			});
		});
	}
};

var childProcess = require('child_process');

exports.cover = function(req, res) {
	res.sendfile(mediadir + req.params.file);
};

exports.video = function(req, res) {
	res.sendfile(mediadir + req.params.file);
};

exports.play = function(req, res) {
	console.log("playing", req.params.file);
	var aLog = [{
		type : 'laCabine',
		time : new Date(),
		data : {
			name : req.params.file
		}
	}];
	request.post("http://log.bype.org/1.0/event/put", {
		proxy : process.env.HTTP_PROXY,
		body : JSON.stringify(aLog)
	});
	var playProc = childProcess.exec('mplayer -really-quiet ' + mediadir + req.params.file + ' -fs', function(error, stdout, stderr) {
		if (error) {
			console.log(error.stack);
			console.log('Error code: ' + error.code);
			console.log('Signal received: ' + error.signal);
		}
	});
	playProc.on('exit', function(code) {
		console.log("play finished")
		io.sockets.emit('play', "finished");
	});
	res.json({
		success : true
	});
};

var decode64 = require('base64').decode;
var moment = require('moment')
exports.postImg = function(req, res) {
	var data = req.body.data.replace(/^data:image\/\w+;base64,/, "");
	var buf = new Buffer(data, 'base64');
	var path = mediadir + 'feedback/' + moment().format('YYYYMMDD') + '/';
	fs.mkdir(path, function(err) {
		fs.writeFile(path + moment().format('HHmmss') + '-' + req.body.video.slice(0, -4) + '.png', buf);
	});
	res.json({
		success : true
	});
};

exports.feedback = function(req, res) {
	console.log(req.params.file, req.params.level);
	res.json({
		success : true
	});
};

