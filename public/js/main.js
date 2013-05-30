requirejs.config({
	paths : {
		underscore : 'lib/underscore',
		bootstrap : 'lib/bootstrap'
	},
	shim : {
		'underscore' : {
			exports : '_'
		}
	}
});

require(['jquery', 'underscore'], function($, _) {
	$(function() {
		$(document).click(function() {
			if (document.documentElement.mozRequestFullScreen)
				document.documentElement.mozRequestFullScreen();
		});
		$('.vlauncher').click(function() {
			$("#vcontainer").fadeOut(2000, function() {
				$(".centered").fadeIn(1000);
			});
		});
	});
});
