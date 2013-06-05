requirejs.config({
	paths : {
		underscore : 'lib/underscore',
		bootstrap : 'lib/bootstrap',
		literallycanvas : 'lib/literallycanvas'
	},
	shim : {
		'underscore' : {
			exports : '_'
		}
	}
});

var myLC;

require(['jquery', 'underscore'], function($, _) {
	$(function() {
		$(document).one('click', function() {
			if (document.documentElement.mozRequestFullScreen)
				document.documentElement.mozRequestFullScreen();
		});

		$(document).bind('touchmove', function(e) {
			if (e.target === document.documentElement) {
				return e.preventDefault();
			}
		});
		$('.vlauncher').click(function() {
			$("#vcontainer").fadeOut(1000, function() {
				$(".centered").fadeIn(1000, function() {
					setTimeout(function() {
						$(".centered").fadeOut(500, function() {
							$("#drawaword").show();
						});
					}, 5000)
				});
			});
		});
		$('#drawaword').hide();
		require(['literallycanvas'], function() {
			myLC = $('.literally').literallycanvas({
				backgroundColor : '#eee',
				primaryColor : '#333333',
				imageURLPrefix : '/img',
				sizeToContainer : false
			});
		});
	});
});
