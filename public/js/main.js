requirejs.config({
	paths : {
		underscore : 'lib/underscore',
		bootstrap : 'lib/bootstrap',
		literallycanvas : 'lib/literallycanvas',
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

require(['jquery', 'underscore', 'mustache', 'socket'], function($, _, Mustache) {
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

		var socket;

		function reload() {
			$('#reload').show();
			$.get('/selection', function(data) {
				$('.vlauncher').remove();
				_.each(data.img_row1, function(elt, idx) {
					var templ = '<div class="vlauncher" name="{{i}}"><img src="/cover/{{f}}"/><div class="description"><p class="description_content">{{t}}</p></div></div>';
					var vhtml = Mustache.render(templ, elt);
					$('#row1').append(vhtml);
				});
				_.each(data.img_row2, function(elt, idx) {
					var templ = '<div class="vlauncher" name="{{i}}"><img src="/cover/{{f}}"/><div class="description"><p class="description_content">{{t}}</p></div></div>';
					var vhtml = Mustache.render(templ, elt);
					$('#row2').append(vhtml);
				});
				$('.vlauncher').click(function() {
					playseq($(this).attr("name"))
				});
				$("#centered").fadeOut(500, function() {
					$("#vcontainer").fadeIn();
				});
			});
		};

		$('#reload').click(reload);

		reload();

		function playseq(filename) {

			var myInt1, myInt2, myInt3;
			var counter;

			function outro() {
				var canvas = document.getElementById('tagit');
				var dataImg = canvas.toDataURL("image/png");
				$.ajax({
					type : "POST",
					url : "/postImg",
					data : {
						data : dataImg,
						video : filename,
					},
					success : function() {
						console.log('image sent');
					}
				});

				clearInterval(myInt3);
				$('#submit').hide();
				$("#drawaword").fadeOut(500);
				$("#centered").fadeOut(500, function() {
					$("#centered").css({
						top : 250
					});
					$('#counter').css({
						color : "#FABE28"
					});
					$('#counter').text("Merci");
					$('#maintxt').html("Vous venez de contribuer au projet transmedia<br/>La Cabine");
					$('#subtxt').text("Plus d'infos sur le site : www.la-cabine.org");
					$("#centered").fadeIn(500);

					setTimeout(function() {
						reload();
					}, 1000);
				})
			}

			function draw() {

				clearInterval(myInt2);

				$("#centered").fadeOut(500, function() {
					$("#centered").css({
						top : 50
					});
					$('#counter').css({
						color : "#333333"
					});
					$('#maintxt').text("Vous venez de voir une vidéo");
					$('#subtxt').text("Avec le stylo, laissez 3 mots");
					// Wait for writing
					counter = 60;
					$('#counter').text(counter);
					$("#centered").fadeIn(500);
					myLC.clear();
					$("#drawaword").fadeIn(500);
					myInt3 = setInterval(function() {
						$('#counter').text(counter--);
						if (counter == 50) {
							$('#submit').fadeIn(2000);
						}
						$('#submit').click(function() {
							counter = 0;
						});
						if (counter < 0) {
							outro();
						}
					}, 1000)
				});
			};

			function play() {
				socket = io.connect();
				$.get('/play/' + filename, function(data) {
				});

				clearInterval(myInt1);
				$("#centered").fadeOut(500, function() {
					$('#maintxt').text("La Cabine est en cours d'utilisation");
					$('#subtxt').text("Patientez jusqu'à la fin du compte à rebours");
					// Wait 3 minutes for the video
					counter = 180;
					$('#counter').text(counter);
					$("#centered").delay(1000).fadeIn(500);
					socket.on('play', function(data) {
						if (data == "finished")
							counter = 0;
					});
					myInt2 = setInterval(function() {
						$('#counter').text(counter--);
						if (counter < 0) {
							socket.socket.reconnect();
							draw();
						}
					}, 1000);
				});
			}

			function intro() {
				$('#reload').hide();
				$('#counter').text("5");
				$('#maintxt').text("Vous pouvez maintenant entrer dans la cabine");
				$('#subtxt').text("N'oubliez pas de laisser trois mots ici en sortant");
				$("#vcontainer").fadeOut(300, function() {
					$('#counter').css({
						color : "#E0E4CC"
					});
					$("#centered").css({
						top : 250
					});
					$("#centered").fadeIn(100, function() {
						// Wait before go inside the box
						counter = 4;
						myInt1 = setInterval(function() {
							$('#counter').text(counter--);
							if (counter < 0) {
								play();
							}
						}, 1000);
					});

				})
			};

			intro();
		}


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
