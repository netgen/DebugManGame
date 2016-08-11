var CONFETTI_NUMBER = 35;
var COLORS = ["purple", "yellow", "orange", "red", "brown", "blue"];

function AnimationManager() {

	var width, height,
		canvas, context;

	this.initialize= function() {
		canvas = document.getElementById("canvas");
		context = canvas.getContext("2d");
		width = window.innerWidth;
		height = window.innerHeight;

		canvas.width = width;
		canvas.height = height;
	}

	this.playConfetti = function(fromX, toX) {
		var particles = [];

		for (var i = 0; i < CONFETTI_NUMBER; i++) {
			particles.push(new Confetti(fromX, toX, height));
		}

		var tick = function(now) {
			context.clearRect(0, 0, width, height);

			particles.forEach(function(particle) {
				particle.update(now);
				particle.draw(context);
			});

			window.requestAnimationFrame(tick);
		};

		window.requestAnimationFrame(tick);
	}
}

var Animator = new AnimationManager();

$(function () {
	Animator.initialize();
});

function Confetti(fromX, toX, height) {
	this.toX = toX;
	this.fromX = fromX;
	this.speed = 0.7;
	this.last_time = null;
	this.height = height;

	this.init();
}

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

Confetti.prototype.update = function(now) {
	if (!this.last_time) {
		this.last_time = now;
	}

	var dt = now - this.last_time;
	this.last_time = now;

	this.y += this.speed * dt;
	
	if (this.y > this.height) {
		this.init();
	}
};