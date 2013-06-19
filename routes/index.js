/*
 * GET home page.
 */

var fs = require('fs');
var async = require('async');

function shuffleArray(array) {
	for (var i = array.length - 1; i > 0; i--) {
		var j = Math.floor(Math.random() * (i + 1));
		var temp = array[i];
		array[i] = array[j];
		array[j] = temp;
	}
	return array;
}

var mediadir = '/home/dolivari/Dropbox/Partages/partageLaCabine/VideoTel/';

var mediainfo = require("mediainfo");
exports.index = function(req, res) {
	fs.readdir(mediadir, function(err, files) {
		function isImage(element, index, array) {
			return (element.slice(-3) == 'jpg');
		};
		files = files.filter(isImage);
		shuffleArray(files);
		var lFiles = files.slice(0, 6);

		var lData = [];
		async.each(lFiles, function(file, done) {
			var moviename = file.slice(0, -3) + "mov";
			mediainfo(mediadir + moviename, function(err, res) {
				if (err) {
					return console.log(err);
				}
				lData.push({
					f : file,
					t : res[0].sonm,
					i : moviename
				});
				done();
			});

		}, function(err) {
			res.render('index', {
				title : 'Express',
				img_row1 : lData.slice(0, 3),
				img_row2 : lData.slice(3, 6)
			});
		});
	});
};

var childProcess = require('child_process');

exports.cover = function(req, res) {
	res.sendfile(mediadir + req.params.file);
};

exports.play = function(req, res) {
	console.log("playing", req.params.file);
	var playProc = childProcess.exec('mplayer ' + mediadir + req.params.file + ' -fs', function(error, stdout, stderr) {
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
}
