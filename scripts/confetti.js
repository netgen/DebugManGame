// Radius of every confetti particle, in pixels.
var CONFETTI_SIZE = 5;

// Creates a new confetti, which will be randomly
// spawned between x coordinates 'fromX' and 'toX',
// and will die at reaching y value of 'height'.
function Confetti(fromX, toX, height) {
	this.toX = toX;
	this.fromX = fromX;
	this.speed = 0.7;
	this.last_time = null;
	this.height = height;

	this.init();
}

Confetti.prototype = Object.create(Animatable.prototype);
Confetti.prototype.constructor = Confetti;

// Places the confetti at a random x coordinate.
Confetti.prototype.init = function() {
	this.x = Math.random() * (this.toX - this.fromX - CONFETTI_SIZE - 1)
				+ this.fromX;
	this.y = Math.random() * this.height - this.height;
	this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
};

Confetti.prototype.draw = function(context) {
	context.beginPath();
	context.arc(this.x, this.y, CONFETTI_SIZE, 0, 2 * Math.PI, false);
	context.fillStyle = this.color;
	context.fill();
	context.closePath();
};

Confetti.prototype.update = function(interval) {
	this.y += this.speed * interval;
	
	// Reposition the confetti at the start of the screen.
	if (this.y > this.height) {
		this.init();
	}
};