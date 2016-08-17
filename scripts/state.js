var GameState = {

	data: {},

	load: function() {
		this.data = JSON.parse(localStorage.data);
		var team1 = this.data.team1;
		var team2 = this.data.team2;
		this.data.team1 = new Team(0, 0, 0);
		this.data.team1.copy(team1);
		this.data.team2 = new Team(0, 0, 0);
		this.data.team2.copy(team2);
		this.loaded = true;
	},

	// Save the current game state to local storage
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

	savePoints: function(team1, team2) {
		this.data.team2.copy(team2);
		this.data.team1.copy(team1);
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

	getTeamPoints: function(team) {
		return calculatePoints(this.data[team]);
	},

	getTeam: function(team) {
		return this.data[team];
	}
};