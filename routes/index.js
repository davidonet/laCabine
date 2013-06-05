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

var test_txt = ["mon chien, mon père", "amour touche 2", "style pompier", "russian style"]

exports.index = function(req, res) {
	fs.readdir('public/cover', function(err, files) {
		shuffleArray(files);
		var lFiles = files.slice(0, 6);

		var lData = [];
		for (var file in lFiles) {
			lData.push({
				f : lFiles[file],
				t : test_txt[Math.floor(Math.random() * test_txt.length)]
			});
		}
		res.render('index', {
			title : 'Express',
			img_row1 : lData.slice(0, 3),
			img_row2 : lData.slice(3, 6)
		});
	});
};
