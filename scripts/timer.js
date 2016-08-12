function Timer(duration, center, radius) {
	this.color = "rgba(0, 0, 255, 0.8)";
	this.center = center;
	this.radius = radius;
	this.angle = 2 * Math.PI;
	this.speed = this.angle / (duration * 1000);
}

Timer.prototype.draw = function(context) {
	if (this.angle < 0) return;

	context.beginPath();
	context.arc(this.center.x, this.center.y,
				this.radius, 0, this.angle, false);
	context.strokeStyle = this.color;
	context.lineWidth = 5;
	context.stroke();
	context.closePath();
};

Timer.prototype.update = function(now) {
	if (!this.last_time) {
		this.last_time = now;
	}

	var dt = now - this.last_time;
	this.last_time = now;

	this.angle -= this.speed * dt;
};