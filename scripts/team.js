var EASY_BUG_POINTS = 2;
var NORM_BUG_POINTS = 4;
var HARD_BUG_POINTS = 6;

// Creates a new team object with the give number
// of bugs.
function Team(easyBugs, normBugs, hardBugs) {
	this.easyBugs = easyBugs;
	this.normBugs = normBugs;
	this.hardBugs = hardBugs;
}

Team.prototype.addBug = function(name) {
	this[name + "Bugs"]++;
};

Team.prototype.getBugs = function(name) {
	return this[name + "Bugs"];
};

Team.prototype.setBugs = function(name, amount) {
	this[name + "Bugs"] = amount;
};

Team.prototype.getPoints = function() {
	return this.easyBugs * EASY_BUG_POINTS
		+ this.normBugs * NORM_BUG_POINTS
		+ this.hardBugs * HARD_BUG_POINTS;
};

// Sets all number of this team's bugs to the
// given 'team' ones.
Team.prototype.copy = function(team) {
	this.easyBugs = team.easyBugs;
	this.normBugs = team.normBugs;
	this.hardBugs = team.hardBugs;
};

var team1 = new Team(0, 0, 0);
var team2 = new Team(0, 0, 0);
var turn = "team2";