var CONFETTI_NUMBER = 35;
var COLORS = ["purple", "yellow", "orange", "red", "brown", "blue"];

var Animator = {

	initialize: function() {
		this.canvas = document.getElementById("canvas");
		this.context = canvas.getContext("2d");

		this.canvas.width = window.innerWidth;;
		this.canvas.height = window.innerHeight;
	},

	playConfetti: function(fromX, toX) {
		var particles = [];

		for (var i = 0; i < CONFETTI_NUMBER; i++) {
			particles.push(new Confetti(fromX, toX, this.canvas.height));
		}

		var tick = function(now) {
			this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

			particles.forEach(function(particle) {
				particle.update(now);
				particle.draw(this.context);
			});

			window.requestAnimationFrame(tick);
		}.bind(this);

		window.requestAnimationFrame(tick);
	}
}


$(function() {
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