var username;
var disabled = false;
var guessTimeout;

$('img').mapster({
	render_highlight: {
		fillOpacity: 0.2,
		stroke: 1
	},
	render_select: {
		fillOpacity: 0.0
	},
	mapKey: 'state',
	onClick: function(state) {
		if (!disabled) {
			socket.emit('guess', username + ':' + state.key);
			disabled = true;
			guessTimeout = setTimeout(function() {
				guessTimeout = undefined;
				disabled = false;
			}, 4000);
		}
		else {
			alert('Please wait four seconds between guesses!');
		}
	}
});

$('.username').keypress(function(e) {
	if (e.keyCode === 13) {
		$('.join-button').click();
	}
});

$('.join-button').click(function() {
	username = $('.username').val();
	$('.login').hide();
	socket.emit('join', username);
});

var socket = io();

socket.on('winner', function() {
	clearTimeout(guessTimeout);
	disabled = false;
});