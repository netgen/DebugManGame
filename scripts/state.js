function _(name) {
	return JSON.parse(localStorage.data)[name];
}

var GameState = {

	closeQuestion: function(buttonID) {
		var data = JSON.parse(localStorage.data);

		var y = parseInt(buttonID.charAt(0)),
        	x = parseInt(buttonID.charAt(1));
        
        data.grid[y][x].closed = true;

		localStorage.data = JSON.stringify(data);
	},

	savePoints: function(bluePoints, greenPoints) {
		var data = JSON.parse(localStorage.data);

		data.bluePts = bluePoints;
		data.greenPts = greenPoints;

		localStorage.data = JSON.stringify(data);
	},

	saveTurn: function(team) {
		var data = JSON.parse(localStorage.data);

		data["turn"] = team;
		
		localStorage.data = JSON.stringify(data);
	},

	getQuestion: function(buttonID) {
		var y = parseInt(buttonID.charAt(0)),
        	x = parseInt(buttonID.charAt(1));
    	return _("grid")[y][x];
	},

	getRows: function() {
		return _("noRows");
	},

	getColumns: function() {
		return _("noColumns");
	}
};