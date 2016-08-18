if (!Object.create) {
	// Incompatible browser
	Object.create = function(o) {
		function F() {}
		F.prototype = o;
		return new F();
	};
}

$(function() {
	
	$(window).on('hashchange', function() {
		var uri = decodeURI(window.location.hash); 
		render(uri);
	});

	// Trigger the first hashchange, to initialize everything.
	$(window).trigger('hashchange');

	function clear() {
		$('.page').hide();
	}

	// Router based on hashchanges.
	function render(url) {
		var temp = url.split('/')[0];
		$('.main-content .page').hide();

		var map = {
			'' : function() {
				renderFormPage();
			},

			'#board' : function() {
				renderBoardPage(null);
				console.log(GameState)
				!GameState.loaded && (window.location.href = 'index.html')
			}
		};

		if (map[temp]) {
			map[temp]();
		} else {
			renderErrorPage();
		}
	}

	function renderFormPage() {
		clear();
		$('.intro-form').show();
	}

	function renderBoardPage() {
		clear();
		$('.game-board').show();
        init();
	}

	function renderErrorPage() {
		clear();
		$('.error-page').show();
	}

	$('[data-toggle="tooltip"]').tooltip();

	// Load the two pages and fill them with Handlebars.
    $.when(
    	$.get('parameter_form.html'),
    	$.get('board_game.html')
	).then(function(response1, response2) {

		$(".intro-form").html(response1[0]);
		$(".game-board").html(response2[0]);

		var form_script = $("#template_select_row").html();
		var template = Handlebars.compile(form_script);
		$("#rowSelector").html(template());

		form_script = $("#template_select_col").html();
		template = Handlebars.compile(form_script);
		$("#colSelector").html(template());

		// Prevent the default action of the form.
		$(document.body).on('submit', "#paramForm", function(e) {
			e.preventDefault();
			if (validateBugs()) {
				parseInput();
			}
		});

		$(".bugNumber").change(validateBugs);
	});

	// Grab all canvases (layers) and their contexts.
	Animator.initialize();
});