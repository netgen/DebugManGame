var RADIUS_OF_DYING = 18;

function FlyingBug(from, to, image) {
	this.dead = false;
	this.image = image;
	this.position = from;
	this.to = to;
	this.size = {
		width: image.width,
		height: image.height
	};

	var distance = [to.x - from.x, to.y - from.y];
	var norm = Math.sqrt(
				Math.pow(distance[0], 2) +
				Math.pow(distance[1], 2)
			);
	this.direction = { x: distance[0] / norm, y: distance[1] / norm };
	this.speed = 1;
}

FlyingBug.prototype = Object.create(Animatable.prototype);
FlyingBug.prototype.constructor = FlyingBug;

FlyingBug.prototype.isDead = function() {
	return this.dead;
}

FlyingBug.prototype.distance = function() {
	var dx = this.position.x - this.to.x,
		dy = this.position.y - this.to.y;

	return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
};

FlyingBug.prototype.draw = function(context) {
	context.drawImage(this.image, this.position.x, this.position.y);
};

FlyingBug.prototype.update = function(interval) {
	if (this.distance() < RADIUS_OF_DYING) {
		this.dead = true;
		return;
	}

	this.position.x += this.direction.x * this.speed * interval;
	this.position.y += this.direction.y * this.speed * interval;
	this.speed *= 0.97;
};