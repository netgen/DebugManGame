function Animatable() {
	this.last_time = null;
}

Animatable.prototype.tick = function(now) {
	if (!this.last_time) {
		this.last_time = now;
	}

	var dt = now - this.last_time;
	this.last_time = now;

	this.update(dt);
};

Animatable.prototype.update = function(interval) {};

Animatable.prototype.draw = function(context) {};