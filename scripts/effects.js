var W, H;

var CONF_NUMBER = 50;

var colors = ["blue", "yellow", "green", "red", "purple", "pink", "orange"];

function Confetti(from, to) {
	this.to = to;
	this.from = from;
	this.x = Math.random() * (to - from) + from;
	this.y = Math.random() * H - H;
	this.speed = 0.7;
	this.color = colors[Math.floor(Math.random() * colors.length)];
	this.last_time = null;
}

Confetti.prototype.draw = function(context) {
	context.beginPath();
	context.arc(this.x, this.y, 7, 0, 2 * Math.PI, false);
	context.fillStyle = this.color;
	context.fill();
	context.closePath();
};

Confetti.prototype.update = function(now) {
	if (!this.last_time) {
		this.last_time = now;
	}

	var dt = now - this.last_time;
	this.last_time = now;

	this.y += this.speed * dt;
	
	if (this.y > H) {
		this.x = Math.random() * (this.to - this.from) + this.from;
		this.y = Math.random() * H - H;
		this.color = colors[Math.floor(Math.random() * colors.length)];
	}
};

function playConfetti(from, to) {
	var canvas = document.getElementById("canvas");
	var context = canvas.getContext("2d");
	W = window.innerWidth;
	H = window.innerHeight;

	canvas.width = W;
	canvas.height = H;

	var conf = [];

	for (var i = 0; i < CONF_NUMBER; i++) {
		conf.push(new Confetti(from, to));
	}

	var tick = function(now) {
		context.clearRect(0, 0, W, H);

		for (var i = 0; i < conf.length; i++) {
			conf[i].update(now);
			conf[i].draw(context);
		}
		window.requestAnimationFrame(tick);
	};

	window.requestAnimationFrame(tick);
};