requirejs.config({
	paths : {
		underscore : 'lib/underscore',
		bootstrap : 'lib/bootstrap',
		literallycanvas : 'lib/literallycanvas',
		socket : '/socket.io/socket.io'
	},
	shim : {
		'underscore' : {
			exports : '_'
		}
	}
});

var myLC;

require(['jquery', 'underscore', 'socket'], function($, _) {
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
		var socket = io.connect();

		$('.vlauncher').click(function() {
			var filename = $(this).attr("name");
			$('#counter').text("5");
			$('#maintxt').text("Vous pouvez maintenant entrer dans la cabine");
			$('#subtxt').text("N'oubliez pas de laisser trois mots ici en sortant");
			$("#vcontainer").fadeOut(1000, function() {
				$('#counter').css({
					color : "#E0E4CC"
				});
				$("#centered").css({
					top : 250
				});
				$("#centered").fadeIn(100, function() {
					// Wait before go inside the box
					var counter = 5;
					var myInt1 = setInterval(function() {
						$('#counter').text(counter--);
						if (counter < 0) {
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
								var myInt2 = setInterval(function() {
									$('#counter').text(counter--);
									if (counter < 0) {
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
											counter = 18;
											$('#counter').text(counter);
											$("#centered").fadeIn(500);
											myLC.clear();
											$("#drawaword").fadeIn(500);
											var myInt3 = setInterval(function() {
												$('#counter').text(counter--);
												if (counter < 0) {
													clearInterval(myInt3);
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
															$("#centered").fadeOut(500, function() {
																$("#vcontainer").fadeIn();

															});
														}, 3000)
													});
												}
											}, 1000);
										});
									}
								}, 1000);
							});

						}
					}, 1000)
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
