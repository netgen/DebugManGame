var COLORS = ["purple", "yellow", "orange", "red", "brown", "blue"];
var CONFETTI_NUMBER = 35;

var BUGS = {
	fly: new Image(),
	bee: new Image(),
	ladybug: new Image()
};
var NUMBER_OF_BUGS = 3;

// Singleton class containing all necessary methods
// for calling various animations.
var Animator = {

	// How many bug icons have been successfully loaded.
	iconsLoaded: 0,

	// True if the question timer is still ticking.
	timerOn: false,

	// Contains all layers - canvases stacked on top of each other.
	layers: {},

	initialize: function() {
		this.iconsLoaded = 0;
		this.timerOn = false;

		this.grabCanvas();
		this.loadBugs();
	},

	// Load the two necessary layers for the game.
	grabCanvas: function() {
		this.addLayer("canvas", "default");
		this.addLayer("confettiCanvas", "confetti");
	},

	// Load all bug icons for the flight animation.
	loadBugs: function() {
		for (var bug in BUGS) {
			BUGS[bug].onload = function() {
				Animator.iconsLoaded++;
			};

			BUGS[bug].src = "assets/images/" + bug + "_icon.png";
		}
	},

	// Adds a new canvas/layer with the specified ID and name.
	addLayer: function(id, layerName) {
		var canvas = document.getElementById(id);
		var layer = {
			canvas: canvas,
			context: canvas.getContext("2d")
		};

		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		this.layers[layerName] = layer;
	},

	// Clears the whole canvas/layer with the given name.
	clearLayer: function(layerName) {
		if (!(layerName in this.layers)) return;

		var layer = this.layers[layerName];
		layer.context.clearRect(0, 0,
								layer.canvas.width,
								layer.canvas.height);
	},

	getLayer: function(layerName) {
		return this.layers[layerName];
	},

	// Flies the given bug between 'from' and 'to' coordinates.
	// Acceptable values for 'bug' are: 'ladybug', 'bee' and 'fly'.
	playBug: function(from, to, bug) {
		if (this.iconsLoaded !== NUMBER_OF_BUGS) return;
		if (!(bug in BUGS)) return;

		var flyingBug = new FlyingBug(from, to, BUGS[bug]);

		var tick = function(now) {
			this.clearLayer("default");

			if (flyingBug.isDead()) return;

			flyingBug.tick(now);
			flyingBug.draw(this.getLayer("default").context);

			window.requestAnimationFrame(tick);
		}.bind(this);

		window.requestAnimationFrame(tick);
	},

	// Drops a CONFETTI_NUMBER of confetti particles between
	// the given X coordinates on the 'confetti' layer.
	playConfetti: function(fromX, toX) {
		var particles = [];

		var areaWidth = Math.abs(toX - fromX);

		for (var i = 0; i < CONFETTI_NUMBER; i++) {
			particles.push(new Confetti(
								fromX,
								toX,
								this.getLayer("confetti").canvas.height
							)
			);
		}

		var tick = function(now) {
			var self = this;
			this.clearLayer("confetti");

			particles.forEach(function(particle) {
				particle.tick(now);
				particle.draw(self.getLayer("confetti").context);
			});

			window.requestAnimationFrame(tick);
		}.bind(this);

		window.requestAnimationFrame(tick);
	},

	// Starts the timer with the given duration in seconds
	// and draws it around the parent.
	playTimer: function(duration, parent) {
		this.timerOn = true;

		var timer = new Timer (
						duration,
						parent
					);

		var tick = function(now) {
			if (!this.timerOn) return;
			this.clearLayer("default");
			timer.tick(now);
			timer.draw(this.getLayer("default").context);

			window.requestAnimationFrame(tick);
		}.bind(this);

		window.requestAnimationFrame(tick);
	},

	// Stops the timer from being drawn.
	stopTimer: function() {
		this.timerOn = false;
		this.clearLayer("default");
	}
};

$(function() {
	Animator.initialize();
});