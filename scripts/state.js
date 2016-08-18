// Contains all the recent data about the game.
var GameState = {

	// Game data.
	data: {},

	// Load data from the local storage.
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

	// Save the current game state to local storage.
	pushChanges: function() {
		localStorage.data = JSON.stringify(this.data);
	},

	// Update the status of the given question.
	saveQuestion: function(buttonID, team) {
		var y = parseInt(buttonID.charAt(0)),
        	x = parseInt(buttonID.charAt(1));

        this.data.grid[y][x].closed = true;
        this.data.grid[y][x].opener = team; 
	},

	// Update the points of both teams.
	savePoints: function(team1, team2) {
		this.data.team2.copy(team2);
		this.data.team1.copy(team1);
	},

	// Update the current team whose turn it is.
	saveTurn: function(team) {
		this.data["turn"] = team;
	},

	// Return the question 'under' the given button,
	// where the first digit of the ID is row and
	// the second oneis column.
	getQuestion: function(buttonID) {
		var y = parseInt(buttonID.charAt(0)),
        	x = parseInt(buttonID.charAt(1));
    	return this.data.grid[y][x];
	},

	// Return number of rows the question grid has.
	getRows: function() {
		return this.data.noRows;
	},

	// Return number of columns the question grid has.
	getColumns: function() {
		return this.data.noColumns;
	},

	// Return number of points of the given team.
	getTeamPoints: function(team) {
		return calculatePoints(this.data[team]);
	},

	getTeam: function(team) {
		return this.data[team];
	}
};