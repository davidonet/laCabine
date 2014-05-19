requirejs.config({
	paths : {
		underscore : 'lib/underscore',
		bootstrap : 'lib/bootstrap',
		socket : '/socket.io/socket.io',
		mustache : 'lib/mustache',
		jquery : 'lib/jquery-2.1.1.min',
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

		var timeStamp = new Date().getTime();

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

		function finish() {
			$(document).unbind('keyup keydown');
			var videoName = window.location.hash.slice(1);
			$.get('/feedback/' + videoName + '/' + st, function(data) {
				$('#circle01').animate({
					width : 20 * (st + 1),
					height : 20 * (st + 1),
					"border-radius" : 20 * (st + 1)
				}, 3000, function() {
					$("#thx").fadeIn(function() {
						setTimeout(function() {
							$('body').fadeOut(function() {
								document.location = '/';
							});
						}, 2000);
					});
				});
				_.each(data.close, function(elt, idx) {
					if (elt != null)
						for (var nb = 0; nb < parseInt(elt); nb++) {
							var dataCircle = {
								top : Math.floor(Math.random() * $(document).height()) + 'px',
								left : Math.floor(Math.random() * $(document).width()) + 'px',
								idx : idx,
								g : Math.floor(55 + Math.random() * 100)

							};
							var $sc = $(Mustache.render("<div class='sc{{idx}} smallcircle' style='top:{{top}};left:{{left}};background:rgba(0,{{g}},0,.7)'></div>", dataCircle));
							$('#others').append($sc);
							$sc.fadeIn((9 - idx) * 500);

						}
				});
			});
		}

		handleSwipe = _.debounce(function(swipe) {
			if ((swipe.state === 'stop') && (150 < Math.abs(swipe.startPosition[0] - swipe.position[0]))) {
				var now = new Date().getTime();
				if (2000 < (now - timeStamp)) {
					controller.disconnect();
					finish();
				}
			}
		}, 300);

		var st = 0;
		var radius = $(document).height() * .5;
		var radiusmax = $(document).height() * .85;
		var radiusmin = $(document).height() * .05;

		function updateCircle() {
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
				});
			}
		}


		$(document).keydown(function(event) {
			if (event.keyCode == 109)
				radius -= 8;
			if (event.keyCode == 107)
				radius += 8;
			updateCircle();
		});

		$(document).keyup(function(event) {
			if (event.keyCode == 13)
				finish();
		});

		function handleCircle(gest) {
			if (gest.normal[2] <= 0) {
				radius += gest.progress;
			} else {
				radius -= gest.progress;
			}
			updateCircle();
		}

		socket = io.connect();
		controller.connect();

		$('#circle01').animate({
			top : '1%',
			left : '-1%',
			width : radius,
			height : radius,
			"border-radius" : radius
		});

		$('.circle').fadeIn();

	});
});
