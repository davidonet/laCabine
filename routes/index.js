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
		console.log("players killed");
	});
	if (0 < lData.length) {
		var sel = shuffleArray(lData);
		res.json({
			imgs : sel.slice(0, 6)
		});
	} else {
		fs.readdir(mediadir, function(err, files) {
			function isImage(element, index, array) {
				return (element.slice(-3) == 'jpg');
			};
			files = files.filter(isImage);

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
	fs.writeFile('/tmp/temp-' + zeroFill(req.params.frame, 5) + '.svg', data, function() {
		var convertProc = childProcess.exec('rsvg-convert --background-color=black -o ' + '/tmp/anim/frame-' + zeroFill(req.params.frame, 5) + '.png /tmp/temp-' + zeroFill(req.params.frame, 5) + '.svg', function(error, stdout, stderr) {
		});
		convertProc.on('exit', function(code) {
			console.log('done', '/tmp/temp-' + zeroFill(req.params.frame, 5) + '.svg');
			childProcess.exec('rm -f /tmp/temp-' + zeroFill(req.params.frame, 5) + '.svg');
		});
		res.json({
			success : true
		});
	});
};

exports.generateAnim = function(req, res) {
	var convertProc = childProcess.exec('ffmpeg -y -r 25 -i /tmp/anim/frame-%05d.png -vf format=yuv420p "/home/dolivari/Dropbox/Partages/partageLaCabine/DESSINS ATELIERS GRAPH AVRIL14/TestRendu/' + req.params.file + '.mov"');
	convertProc.on('exit', function(code) {
		var rm = childProcess.exec('rm -f /tmp/anim/*.png');
		rm.on('exit', function(code) {
			res.json({
				success : true
			});
		});
	});
};
/*
 var recursive = require('recursive-readdir');

 var filelist;
 var fileindex = 0;

 recursive('/run/media/dolivari/234fd977-dd73-4733-8ba3-33a22ebf7d09/Dropbox/Partages/partageLaCabine/DESSINS ATELIERS GRAPH AVRIL14/17avril FDA adultes', function(err, files) {
 filelist = files.filter(function(elt) {
 return 0 < elt.indexOf("svg");
 });
 console.log(filelist.length);
 });
 */
exports.inkling = function(req, res) {
	fs.readFile(filelist[fileindex], function(err, data) {
		console.log('rendering', filelist[fileindex])
		res.render('inkling', {
			data : data
		});
		fileindex++;
	});
};

var redis = require("redis"), client = redis.createClient();

exports.feedback = function(req, res) {
	console.log(req.params.file, req.params.level);
	client.incr(req.params.file + "-" + req.params.level, function(err) {
		var close = [], keys = [];
		for (var j = 0; j < 9; j++) {
			keys[j] = {
				idx : j,
				key : req.params.file + "-" + j
			};
		}
		console.log(keys);
		async.each(keys, function(key, done) {
			client.get(key.key, function(err, val) {
				console.log(key.idx, val);
				close[key.idx] = val;
				done();
			});
		}, function(err) {
			res.json({
				close : close
			});
		});
	});
};

