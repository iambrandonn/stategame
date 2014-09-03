var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var users = [];
var states = ['KY', 'OR', 'GA', 'AZ', 'IL', 'WY', 'OH', 'NY', 'MO'];
var stateIndex = 0;

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
	res.sendfile('public/index.html');
});

io.on('connection', function(socket) {
	socket.on('join', function(msg) {
		socket.user = msg;
		addUser(msg);
		socket.broadcast.emit('joined', JSON.stringify(users));

		io.sockets.emit('nextPic', states[stateIndex]);
	});

	socket.on('guess', function(msg) {
		var state = msg.substr(msg.lastIndexOf(':') + 1);
		if (state === states[stateIndex]) {
			incrementUserScore(socket.user);
			
			io.sockets.emit('winner', JSON.stringify({
				winner: socket.user,
				users: users
			}));
			
			stateIndex++;
			if (stateIndex >= states.length) {
				stateIndex = 0;
			}

			io.sockets.emit('nextPic', states[stateIndex]);
		}
	});

	socket.on('disconnect', function() {
		removeUser(socket.user);
		socket.broadcast.emit('left', JSON.stringify(users));		
	});
});

function removeUser(username) {
	users = users.filter(function(user) {
		return user.name !== username;
	});
}

function addUser(username) {
	users.push({
		name: username,
		score: 0
	});
}

function incrementUserScore(username) {
	for (var i = 0; i < users.length; i++) {
		if (users[i].name === username) {
			users[i].score++;
			return;
		}
	}
}

server.listen(process.env.PORT || 5000);