// Create a button which represents a question of the game's board
Handlebars.registerHelper("button", function(row, col, context) {
	return new Handlebars.SafeString(
			"<input type='button' data-id='" + 
				row + "" + col + "'  class='btn-box'" +
				" data-toggle='modal' data-target='#myModal' />"
		);
});

Handlebars.registerHelper("letter", function(index) {
	return String.fromCharCode(65 + index);
});

Handlebars.registerHelper("oneUp", function(number) {
	return number + 1;
});

// Do an action n number of times
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

// Repeats an action in an interval [a, b], where index
// is the current value of the counter.
Handlebars.registerHelper("range", function(a, b, context) {
	var out = '',
		data = {};

	for (var i = a; i <= b; i++) {
		data.index = i;
		out += context.fn(i, {
				data: data
			}
		);
	}

	return out;
});