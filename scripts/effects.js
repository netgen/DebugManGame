function Confetti(color, width, height) {
	this.x = Math.random() * width;
	this.y = Math.random() * height - height + 600;
	this.color = color;
}

Confetti.prototype.draw = function(context) {
	context.beginPath();
	context.arc(this.x, this.y, 20, 0, 2 * Math.PI, false);
	context.fillStyle = this.color;
	context.fill();
	context.closePath();
};

Confetti.prototype.update = function(now) {
	this.y -= now / 100;
};

$(function () {
	var canvas = document.getElementById("canvas");
	var context = canvas.getContext("2d");
	var width = window.innerWidth;
	var height = window.innerHeight;

	canvas.width = width;
	canvas.height = height;

	var conf = new Confetti("green", width, height);

	var tick = function(now) {
		context.clearRect(0, 0, width, height);
		conf.update(now);
		conf.draw(context);
		window.requestAnimationFrame(tick);
	};

	window.requestAnimationFrame(tick);
});