/*
 * GET home page.
 */

fs = require('fs');

function shuffleArray(array) {
	for (var i = array.length - 1; i > 0; i--) {
		var j = Math.floor(Math.random() * (i + 1));
		var temp = array[i];
		array[i] = array[j];
		array[j] = temp;
	}
	return array;
}

exports.index = function(req, res) {
	fs.readdir('public/cover', function(err, files) {
		shuffleArray(files);
		res.render('index', {
			title : 'Express',
			img_row1 : files.slice(0,3),
			img_row2 : files.slice(3,6)
		});
	});
};
