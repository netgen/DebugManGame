var CONFETTI_NUMBER = 35;
var COLORS = ["purple", "yellow", "orange", "red", "brown", "blue"];
var timerOn = false;

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
	},

	playTimer: function(duration, parent) {
		timerOn = true;

		var timer = new Timer (
						duration,
						{
							x: parent.offset().left + parent.outerWidth()/2,
							y: parent.offset().top + parent.outerHeight()/2
						},
						Math.min(parent.outerWidth()/2, parent.outerHeight()/2) - 5
					);

		var tick = function(now) {
			if (!timerOn) return;
			this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
			timer.update(now);
			timer.draw(this.context);

			window.requestAnimationFrame(tick);
		}.bind(this);

		window.requestAnimationFrame(tick);
	},

	stopTimer: function() {
		console.log("CLEAR!");
		timerOn = false;
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}
};


$(function() {
	Animator.initialize();
});

function Timer(duration, center, radius) {
	this.color = "rgba(0, 0, 255, 0.8)";
	this.center = center;
	this.radius = radius;
	this.angle = 2 * Math.PI;
	this.speed = this.angle / (duration * 1000);
}

Timer.prototype.draw = function(context) {
	if (this.angle < 0) return;

	context.beginPath();
	context.arc(this.center.x, this.center.y,
				this.radius, 0, this.angle, false);
	context.strokeStyle = this.color;
	context.lineWidth = 5;
	context.stroke();
	context.closePath();
};

Timer.prototype.update = function(now) {
	if (!this.last_time) {
		this.last_time = now;
	}

	var dt = now - this.last_time;
	this.last_time = now;

	this.angle -= this.speed * dt;
};

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