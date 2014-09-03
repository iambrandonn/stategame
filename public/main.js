/* 
	Yes, inquisitive one who pokes around in code rather than paying attention... 
	You will be rewarded for your curiousity.  Be the first to raise your hand and 
	say "Cowabunga", you will get a doughnut of your own!

	P.S. Please don't judge me on this throw away code I put together for the meeting :)
*/

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
	},
	wrapCss: {
		display: 'inline-block'
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