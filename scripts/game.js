function generateBoard() {
	var array = $("#paramForm").serializeArray();

	for (var i = 0; i < array.length; i++) {
		var pair = array[i];
		localStorage.setItem(pair["name"], pair["value"]);
	}

	var template_script = $("#board-temp").html();
	var template = Handlebars.compile(template_script);
	$(".game-board").html(template(localStorage));
}

$(function() {
	$("#submitButton").click(generateBoard);
});