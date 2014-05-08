requirejs.config({
	paths : {
		underscore : 'lib/underscore',
		bootstrap : 'lib/bootstrap',
		socket : '/socket.io/socket.io',
		mustache : 'lib/mustache',
		jquery : 'lib/jquery-2.1.1.min',
		jssor : 'lib/jssor.slider.min'
	},
	shim : {
		'underscore' : {
			exports : '_'
		}
	}
});

var myLC, pass;

require(['jquery', 'underscore', 'mustache', 'socket', 'bootstrap', 'jssor'], function($, _, Mustache) {
	$(function() {
		$.get('/selection', function(data) {
			_.each(data.imgs, function(elt, idx) {
				var templ = '<div><img  u="image" t="*" src="/cover/{{f}}"/><div u="caption" class="caption">{{t}}</div></div>';
				var vhtml = Mustache.render(templ, elt);
				$('#main').append(vhtml);
			});
			var jssor_slider1 = new $JssorSlider$('slider1_container', {
				$AutoPlay : false
			});
			jssor_slider1.$GoTo(Math.floor(Math.random() * data.imgs.length));
			var controller = new Leap.Controller({
				enableGestures : true
			});

			var swiper = controller.gesture('swipe');
			var circler = controller.gesture('circle');

			var tolerance = 150;
			var cooloff = 300;

			var slider = _.debounce(function(xDir, yDir) {
				if (xDir != 0)
					if (0 < xDir) {
						//this means that the swipe is to the right direction
						jssor_slider1.$Prev();
					} else {
						//this means that the swipe is to the left direction
						jssor_slider1.$Next();
					}
			}, cooloff);

			swiper.update(function(g) {
				if (Math.abs(g.translation()[0]) > tolerance || Math.abs(g.translation()[1]) > tolerance) {
					var xDir = Math.abs(g.translation()[0]) > tolerance ? (g.translation()[0] > 0 ? -1 : 1) : 0;
					slider(xDir, 0);
				}
			});

			var currentVid;

			circler.stop(function(gest) {

				if (gest.lastGesture.radius < 80) {
					var idx = jssor_slider1.$CurrentIndex();
					currentVid = data.imgs[idx].i;
					controller.disconnect();
					$.get('/play/' + currentVid, function(data) {
					});
				}
			});

			controller.connect();

			socket = io.connect();
			socket.on('play', function(data) {
				window.location = "/feedback.html#" + currentVid;
			});

		});

	});
});
