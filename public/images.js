// Socket IO stuff
var socket = io();

// Angular
var app = angular.module('images', []);
app.controller('scoreboardCtrl', ['$scope', function($scope) {
	$scope.winnerName = undefined;
	$scope.users = [];
	$scope.started = false;

	$scope.next = function() {
		$scope.started = true;
		$scope.winnerName = undefined;
	};

	socket.on('joined', function(msg) {
		$scope.users = JSON.parse(msg);
		$scope.$apply();
	});

	socket.on('left', function(msg) {
		$scope.users = JSON.parse(msg);
		$scope.$apply();
	});

	socket.on('winner', function(msg) {
		var data = JSON.parse(msg);
		$scope.users = data.users;
		$scope.winnerName = data.winner;
		$scope.$apply();
	});

	socket.on('nextPic', function(msg) {
		$scope.state = msg;
	});
}]);