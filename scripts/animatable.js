// Any object which is drawable on canvas and
// must be updated.
function Animatable() {
	this.last_time = null;
}

// Called on every frame, receives current
// time as its argument.
Animatable.prototype.tick = function(now) {
	if (!this.last_time) {
		this.last_time = now;
	}

	var dt = now - this.last_time;
	this.last_time = now;

	this.update(dt);
};

// Also called on every frame; receives time passed
// between the last call as its argument.
Animatable.prototype.update = function(interval) {};

// All drawing steps ought to be here. Receives a
// 2D context of an HTML5 canvas.
Animatable.prototype.draw = function(context) {};