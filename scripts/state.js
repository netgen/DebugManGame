var GameState = {

	data: {},

	load: function() {
		this.data = JSON.parse(localStorage.data);
	},

	pushChanges: function() {
		localStorage.data = JSON.stringify(this.data);
		$("#btnUndo").attr("disabled", false);
	},

	saveQuestion: function(buttonID) {
		var y = parseInt(buttonID.charAt(0)),
        	x = parseInt(buttonID.charAt(1));

        this.data.grid[y][x].closed = true;
	},

	savePoints: function(bluePoints, greenPoints) {
		this.data.bluePts = bluePoints;
		this.data.greenPts = greenPoints;
	},

	saveTurn: function(team) {
		this.data["turn"] = team;
	},

	getQuestion: function(buttonID) {
		var y = parseInt(buttonID.charAt(0)),
        	x = parseInt(buttonID.charAt(1));
    	return this.data.grid[y][x];
	},

	getRows: function() {
		return this.data.noRows;
	},

	getColumns: function() {
		return this.data.noColumns;
	},

	getBluePoints: function() {
		return this.data.bluePts;
	},

	getGreenPoints: function() {
		return this.data.greenPts;
	}
};