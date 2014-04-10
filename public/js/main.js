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
		$.get('/selection', function(data) {
			_.each(data.imgs, function(elt, idx) {
				var templ = '<div class="item" name="{{i}}"><img src="/cover/{{f}}"/><div class="container"><div class="carousel-caption"><h1>{{t}}</h1></div></div></div>';
				var vhtml = Mustache.render(templ, elt);
				$('#main').append(vhtml);
				if (idx == 0) {
					$('.item').first().addClass("active");
				}
			});
			var theCarousel = $('#myCarousel').carousel({
				interval : false
			});

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
						//this means that the swipe is to the right direction
						theCarousel.carousel('prev');
					} else {
						//this means that the swipe is to the left direction
						theCarousel.carousel('next');
					}
				}
			}

			function handleCircle(gest) {
				if ((gest.state === 'stop') && (gest.radius < 80)) {
					$.get('/play/' + $('.active').attr('name'), function(data) {
					});
				}
			}

			socket = io.connect();
			socket.on('play', function(data) {
				console.log(data);
			});
			controller.connect();
		});

	});
});
