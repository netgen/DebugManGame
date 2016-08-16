function FlyingBug(from, to, image) {
	this.dead = false;
	this.image = image;
	this.position = from;
	this.to = to;
	var distance = [to.x - from.x, to.y - from.y];
	var norm = Math.sqrt(Math.pow(distance[0], 2) + Math.pow(distance[1], 2));
	this.direction = { x: distance[0] / norm, y: distance[1] / norm };
	this.speed = 1;
}

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

FlyingBug.prototype.update = function(now) {
	if (this.distance() < 18) {
		this.dead = true;
		return;
	}

	if (!this.last_time) {
		this.last_time = now;
	}

	var dt = now - this.last_time;
	this.last_time = now;

	this.position.x += this.direction.x * this.speed * dt;
	this.position.y += this.direction.y * this.speed * dt;
	this.speed *= 0.97;
};