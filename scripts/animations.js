var CONFETTI_NUMBER = 35;
var COLORS = ["purple", "yellow", "orange", "red", "brown", "blue"];
var BUGS = {
	fly: new Image(),
	bee: new Image(),
	ladybug: new Image()
};
var NUMBER_OF_BUGS = 3;

var iconsLoaded = 0;
var timerOn = false;

for (var bug in BUGS) {
	BUGS[bug].onload = function() {
		iconsLoaded++;
	};

	BUGS[bug].src = "assets/images/" + bug + "_icon.png";
}

var Animator = {

	initialize: function() {
		this.canvas = document.getElementById("canvas");
		this.confettiCanvas = document.getElementById("confettiCanvas");
		this.confettiContext = this.confettiCanvas.getContext("2d");
		this.context = this.canvas.getContext("2d");
		this.canvas.width = this.confettiCanvas.width = window.innerWidth;
		this.canvas.height = this.confettiCanvas.height = window.innerHeight;
	},

	playBug: function(from, to, bug) {
		if (iconsLoaded !== NUMBER_OF_BUGS) return;
		if (!(bug in BUGS)) return;

		var flyingBug = new FlyingBug(from, to, BUGS[bug]);

		var tick = function(now) {
			this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

			if (flyingBug.isDead()) return;

			flyingBug.tick(now);
			flyingBug.draw(this.context);

			window.requestAnimationFrame(tick);
		}.bind(this);

		window.requestAnimationFrame(tick);
	},

	playConfetti: function(fromX, toX) {
		var particles = [];

		var areaWidth = Math.abs(toX - fromX);

		for (var i = 0; i < CONFETTI_NUMBER; i++) {
			particles.push(new Confetti(fromX, toX, this.canvas.height));
		}

		var tick = function(now) {
			var self = this;
			this.confettiContext.clearRect(0, 0, this.confettiCanvas.width, this.confettiCanvas.height);

			particles.forEach(function(particle) {
				particle.tick(now);
				particle.draw(self.confettiContext);
			});

			window.requestAnimationFrame(tick);
		}.bind(this);

		window.requestAnimationFrame(tick);
	},

	playTimer: function(duration, parent) {
		timerOn = true;

		var timer = new Timer (
						duration,
						parent
					);

		var tick = function(now) {
			if (!timerOn) return;
			this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
			timer.tick(now);
			timer.draw(this.context);

			window.requestAnimationFrame(tick);
		}.bind(this);

		window.requestAnimationFrame(tick);
	},

	stopTimer: function() {
		timerOn = false;
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}
};

$(function() {
	Animator.initialize();
});