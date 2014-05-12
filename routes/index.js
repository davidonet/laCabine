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

function zeroFill(number, width) {
	width -= number.toString().length;
	if (width > 0) {
		return new Array(width + (/\./.test(number) ? 2 : 1)).join('0') + number;
	}
	return number + "";
	// always return a string
}

exports.postImg = function(req, res) {
	var data = req.body.data;
	var header = '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/2.2/DTD/svg11.dtd">\n';
	fs.writeFile('/tmp/temp.svg', header + data, function() {
		var convertProc = childProcess.exec('rsvg-convert --background-color=black -o ' + '/tmp/anim/frame-' + zeroFill(req.params.frame, 5) + '.png /tmp/temp.svg', function(error, stdout, stderr) {
		});
		convertProc.on('exit', function(code) {
			res.json({
				success : true
			});
		});
	});
};

exports.generateAnim = function(req, res) {
	var convertProc = childProcess.exec('ffmpeg -r 25 -i /tmp/anim/frame-%05d.png -vcodec qtrle "/home/dolivari/Dropbox/Partages/partageLaCabine/DESSINS ATELIERS GRAPH AVRIL14/TestRendu/' + req.params.file + '.mov"', function(error, stdout, stderr) {
	});
	convertProc.on('exit', function(code) {
		childProcess.exec('rm -f /tmp/anim/*.png');
		res.json({
			success : true
		});
	});
};

var recursive = require('recursive-readdir');

var filelist;
var fileindex = 22;

recursive('/run/media/dolivari/234fd977-dd73-4733-8ba3-33a22ebf7d09/Dropbox/Partages/partageLaCabine/DESSINS ATELIERS GRAPH AVRIL14/', function(err, files) {
	filelist = files.filter(function(elt) {
		return 0 < elt.indexOf("svg");
	});
});

exports.inkling = function(req, res) {
	fs.readFile(filelist[fileindex], function(err, data) {
		res.render('inkling', {
			data : data
		});
		fileindex++;
	});
};

var redis = require("redis"), client = redis.createClient();

exports.feedback = function(req, res) {
	console.log(req.params.file, req.params.level);
	client.sadd(req.params.file, req.params.level);
	res.json({
		success : true
	});
};

