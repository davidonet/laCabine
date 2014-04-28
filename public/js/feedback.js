requirejs.config({
	paths : {
		underscore : 'lib/underscore',
		bootstrap : 'lib/bootstrap',
		socket : '/socket.io/socket.io',
		mustache : 'lib/mustache',
	},
	shim : {
		'underscore' : {
			exports : '_'
		}
	}
});

var myLC, pass;

require(['jquery', 'underscore', 'mustache', 'socket', 'bootstrap'], function($, _, Mustache) {
	$(function() {

		var controller = new Leap.Controller({
			enableGestures : true
		});

		controller.on('gesture', function(gesture) {
			if (gesture.type === 'swipe') {
				handleSwipe(gesture);
			}
			if (gesture.type === 'circle') {
				handleCircle(gesture);
			}
		});

		function handleSwipe(swipe) {
			var startFrameID;
			if ((swipe.state === 'stop') && (100000 < swipe.duration)) {
				if (swipe.direction[0] > 0) {
				} else {
				}
			}
		}

		var st = 0;
		var radius = $(document).height() * .5;
		var radiusmax = $(document).height() * .85;
		var radiusmin = $(document).height() * .05;
		function handleCircle(gest) {
			if (gest.normal[2] <= 0) {
				radius += gest.progress;
			} else {
				radius -= gest.progress;
			}
			if (radius < radiusmin)
				radius = radiusmin
			if (radiusmax < radius)
				radius = radiusmax
			$('#circle01').css({
				width : radius,
				height : radius,
				"border-radius" : radius
			});

			var newst = Math.floor(8 * (radius - radiusmin) / (radiusmax - radiusmin));
			if (newst != st) {
				st = newst;
				var sp;
				switch(st) {
					case 0:
						sp = "pas du tout du tout";
						break;
					case 1:
						sp = "pas du tout";
						break;
					case 2:
						sp = "pas vraiment";
						break
					case 3:
						sp = "un peu";
						break
					case 4:
						sp = "moyennement";
						break
					case 5:
						sp = "assez";
						break
					case 6:
						sp = "très";
						break
					case 7:
						sp = "tellement";
						break
					case 8:
						sp = "immensément";
						break

				}
				$("#strenght").fadeOut(function() {
					$("#strenght").text(sp);
					$("#strenght").fadeIn();
				})
			}
		}

		socket = io.connect();
		controller.connect();

		$('#circle01').css({
			top : '1%',
			left : '-1%',
			width : radius,
			height : radius,
			"border-radius" : radius
		});

		$('.circle').fadeIn();

	});
});
