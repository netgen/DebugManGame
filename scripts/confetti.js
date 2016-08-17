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

Confetti.prototype.init = function() {
	this.x = Math.random() * (this.toX - this.fromX) + this.fromX;
	this.y = Math.random() * this.height - this.height;
	this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
};

Confetti.prototype.draw = function(context) {
	context.beginPath();
	context.arc(this.x, this.y, 5, 0, 2 * Math.PI, false);
	context.fillStyle = this.color;
	context.fill();
	context.closePath();
};

Confetti.prototype.update = function(interval) {
	this.y += this.speed * interval;
	
	if (this.y > this.height) {
		this.init();
	}
};