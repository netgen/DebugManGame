// Checks if the data entered as the number of
// bugs is an integer.
function validateBugs() {
	var valid = isNumber("#numHardBugs") &&
				isNumber("#numNormBugs") &&
				isNumber("#numEasyBugs");

	$("#submitButton").css("pointerEvents",
							valid ? 'all' : 'none');

	return valid;
}

// Checks if the value of an HTML object is numeric.
function isNumber(objName) {
	var value = $(objName).val();
	if (value === "") return false;

	var num_regex = /^[0-9]+$/;
	return num_regex.test(value);
}


// Checks if the total sum of bugs exceeds the board size.
function checkParameters() {
	var totalBugs = parseInt(localStorage["numEasyBugs"])
						+ parseInt(localStorage["numNormBugs"])
						+ parseInt(localStorage["numHardBugs"]);

	var noRows = parseInt(localStorage["noRows"]);
	var noColumns = parseInt(localStorage["noColumns"]);

	if (totalBugs > noRows * noColumns) {
		return false;
	}

	return true;
}

// Parses the input, validates the parameters and, if valid,
// generates the game board.
function parseInput() {
	var array = $("#paramForm").serializeArray();

	for (var i = 0; i < array.length; i++) {
		var pair = array[i];
		localStorage.setItem(pair["name"], parseInt(pair["value"]));
	}

	if (!checkParameters()) {
		alert("Number of bugs exceeds the board size!");
		return;
	}

	$('.page').hide();
	$('.loading-page').show();

	$.get("assets/questions.json")
		.success(generateBoard)
		.fail(function(json) {
			alert("Server dieded :(");
		});
}