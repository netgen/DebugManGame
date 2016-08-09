var GameState = {

	data: {},

	load: function() {
		this.data = JSON.parse(localStorage.data);
	},

	pushChanges: function() {
		localStorage.data = JSON.stringify(this.data);
		$("#btnUndo").attr("disabled", false);
	},

	saveQuestion: function(buttonID, team) {
		var y = parseInt(buttonID.charAt(0)),
        	x = parseInt(buttonID.charAt(1));

        this.data.grid[y][x].closed = true;
        this.data.grid[y][x].opener = team; 
	},

	savePoints: function(team1Points, team2Points) {
		this.data.team1Pts = team1Points;
		this.data.team2Pts = team2Points;
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

	getTeam1Points: function() {
		return this.data.team1Pts;
	},

	getTeam2Points: function() {
		return this.data.team2Pts;
	}
};