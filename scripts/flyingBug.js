function FlyingBug(from, to, image) {
	this.image = image;
	this.position = from;
	this.to = to;
	var distance = [to.x - from.x, to.y - from.y];
	var norm = Math.sqrt(Math.pow(distance[0], 2) + Math.pow(distance[1], 2));
	this.direction = { x: distance[0] / norm, y: distance[1] / norm };
	this.speed = 10;
}

FlyingBug.prototype.draw = function(context) {
	context.drawImage(this.image, this.position.x, this.position.y);
};

FlyingBug.prototype.update = function(now) {
	this.position.x += this.direction.x * this.speed;
	this.position.y += this.direction.y * this.speed;
};