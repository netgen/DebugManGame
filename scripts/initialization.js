$(function() {
	
	$(window).on('hashchange', function() {
		var uri = decodeURI(window.location.hash); 
		render(uri);
	});

	$(window).trigger('hashchange');

	function clear() {
		$('.page').hide();
	}

	function render(url) {
		var temp = url.split('/')[0];
		$('.main-content .page').hide();

		var map = {
			'' : function() {
				renderFormPage();
			},

			'#board' : function() {
				renderBoardPage(null);
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
		var noRows = 7,
			noColumns = 7;

		clear();
		$('.game-board').show();
        popup();
	}

	function renderErrorPage() {
		clear();
		$('.error-page').show();
	}

	$("#paramForm").submit(function(event) {
		event.preventDefault();
	});

	Handlebars.registerHelper("button", function(row, col, context) {
		return new Handlebars.SafeString(
				"<input type='button' id='" + 
					row + "" + col + "'  class='btn-box' onclick='setIdClickedButton(id)'" +
					" data-toggle='modal' data-target='#myModal' />"
			);
	});

	Handlebars.registerHelper("letter", function(index) {
		return String.fromCharCode(65 + index);
	});

	Handlebars.registerHelper("oneUp", function(number) {
		return number + 1;
	});

	Handlebars.registerHelper("times", function(n, context) {
		var out = '',
			data = {};

		for (var i = 0; i < n; i++) {
			data.index = i + 1;
			out += context.fn(i, {
					data: data
				}
			);
		}

		return out;
	});

	$('[data-toggle="tooltip"]').tooltip();

	var form_script = $(".selector").html();
	var template = Handlebars.compile(form_script);

	$(".selector").html(template({}));
});