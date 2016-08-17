var TIMER_COLOR = "rgba(0, 0, 255, 0.8)";
var TIMER_LINE_WIDTH = 7;

function Timer(duration, parent) {
	this.parent = parent;
	this.angle = 2 * Math.PI;
	this.speed = this.angle / (duration * 1000);
	this.parentPos = parent.offset();

	this.init();
}

Timer.prototype = Object.create(Animatable.prototype);
Timer.prototype.constructor = Timer;

Timer.prototype.init = function() {
	this.center = {
		x: this.parent.offset().left + this.parent.outerWidth()/2,
		y: this.parent.offset().top + this.parent.outerHeight()/2
	};

	this.radius = Math.min(this.parent.outerWidth()/2,
					this.parent.outerHeight()/2) - TIMER_LINE_WIDTH;
};

Timer.prototype.draw = function(context) {
	if (this.angle < 0) return;
	context.beginPath();
	context.arc(this.center.x, this.center.y,
				this.radius, 0, this.angle, false);
	context.strokeStyle = TIMER_COLOR;
	context.lineWidth = TIMER_LINE_WIDTH;
	context.stroke();
	context.closePath();
};

Timer.prototype.update = function(interval) {
	this.angle -= this.speed * interval;

	var pos = this.parent.offset();
	if (pos.left !== this.parentPos.left || 
		pos.top !== this.parentPos.top) {
		this.parentPos = pos;
		this.init();
	}
};