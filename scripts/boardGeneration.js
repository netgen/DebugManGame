function validate() {
	var valid = isNumber("#qBugs") && isNumber("#wBugs") && isNumber("#zBugs");
    if (!valid) {
        alert("Needed a number of questions!");
        $("#submitButton").attr("disabled", valid);
    } 
}

function isNumber(objName) {
	var value = $(objName).val();
	if (value === "") return false;

	var num_regex = /^[0-9]+$/;
	return num_regex.test(value);
}

function checkParameters() {
	var zBugs = parseInt(localStorage["zBugs"]);
	var wBugs = parseInt(localStorage["wBugs"]);
	var qBugs = parseInt(localStorage["qBugs"]);
	var noRows = parseInt(localStorage["noRows"]);
	var noColumns = parseInt(localStorage["noColumns"]);

	if (zBugs + wBugs + qBugs > noRows * noColumns) {
		return false;
	}

	return true;
}

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

function shuffle(array) {
	var i = 0,
		j = 0,
		temp = null;

	for (i = array.length - 1; i > 0; i--) {
		j = Math.floor(Math.random() * (i));
		temp = array[i];
		array[i] = array[j];
		array[j] = temp; 
	}

	return array;
}

function create2DArray(rows, columns) {
	var array = new Array(rows);

	for (var i = 0; i < rows; i++) {
		array[i] = new Array();
	}

	return array;
}

function random(min, max) {
	return Math.floor(Math.random() * max) + min;
}

function freeSlot(array, rows, cols) {
	while (true) {
		var r = random(0, rows),
			c = random(0, cols);

		if (!array[r][c]) {

			return {
				row: r,
				column: c
			};
		}
	}
}

var around = [[1, -1], [1, 0], [1, 1], [0, -1],
			  [-1, -1], [-1, 0], [-1, 1], [0, 1]];

function inBoundaries(row, col, rows, cols) {
	return (row >= 0 && row < rows) &&
			(col >= 0 && col < cols);
}

function rangeSlot(array, rows, cols, bug) {
	for (var i = 0; i < around.length; i++) {
		var direction = around[i];
		var row = bug.row + direction[0],
			col = bug.column + direction[1];

		if (inBoundaries(row, col, rows, cols)) {
			if (!array[row][col]) {
				return {
					row: row,
					column: col
				}
			}
		}
	}

	return freeSlot(array, rows, cols);
}


function placeAround(centralBugs, followers, grid, rows, cols) {
	var limit = Math.min(centralBugs.length, followers.length);

	for (var i = 0; i < limit; i++) {
		var coordinates = rangeSlot(grid, rows, cols, centralBugs[i]);
		var row = coordinates.row,
			col = coordinates.column;
		grid[row][col] = createField(followers[i], true, row, col);
	}

	for (var i = limit; i < followers.length; i++) {
		var coordinates = freeSlot(grid, rows, cols);
		var row = coordinates.row,
			col = coordinates.column;
		grid[row][col] = createField(followers[i], true, row, col);
	}
}

function placeBugs(rows, cols, questions) {
	var easy = shuffle(questions["1"]);
	var ezBugs = easy.splice(0, parseInt(localStorage["zBugs"]));

	var normal = shuffle(questions["2"]);
	var normBugs = normal.splice(0, parseInt(localStorage["wBugs"]));

	var hard = shuffle(questions["3"]);
	var hardBugs = hard.splice(0, parseInt(localStorage["qBugs"]));

	var remainder = rows * cols - (ezBugs.length + normBugs.length + hardBugs.length);
	var otherQs = shuffle(easy.concat(normal, hard)).splice(0, remainder);
	var array = create2DArray(rows, cols);

	//randomly place hard bugs
	for (var i = 0; i < hardBugs.length; i++) {
		var coordinates = freeSlot(array, rows, cols);
		var row = coordinates.row,
			col = coordinates.column;
		var hField = createField(hardBugs[i], true, row, col);
		array[row][col] = hField;
	}

	placeAround(hardBugs, normBugs, array, rows, cols);
	placeAround(normBugs, ezBugs, array, rows, cols);

	for (var i = 0; i < rows; i++) {
		for (var j = 0; j < cols; j++) {
			if (!array[i][j]) {
				array[i][j] = createField(otherQs.pop(), false, i, j);
			}
		}
	}

	return array;
}

function generateBoard(questions) {
	var rows = localStorage["noRows"];
	var cols = localStorage["noColumns"];
	var array = placeBugs(rows, cols, questions);

	//inject freshly made board into HTML
	var template_script = $("#board-temp").html();
	var template = Handlebars.compile(template_script);
	var context = {
		grid: array,
		rows: array.length,
		cols: array[0].length
	};

	var data = {
		noRows: rows,
		noColumns: cols,
		grid: array,
		turn: "",
		team1: new Team(0, 0, 0),
		team2: new Team(0, 0, 0)
	};

	$(".game-board").html(template(context));
	localStorage.clear();
	localStorage.setItem("data", JSON.stringify(data));
	window.location.hash = '#board';

	$(".btn-box").hover(function () {
		var id = String($(this).data("id"));
		$("#row" + id.charAt(0)).toggleClass("fieldUnactive")
								.toggleClass("fieldActive");
		$("#col" + id.charAt(1)).toggleClass("fieldUnactive")
								.toggleClass("fieldActive");
	});

	GameState.load();
	$("#btnUndo").attr("disabled", true);
}

function createField(question, isBug, row, column) {
	question["hasBug"] = isBug;
	question["row"] = row;
	question["column"] = column;
	question["closed"] = false;
	question["opener"] = null;
	return question;
}

$(function() {
	$(document.body).on('submit', "#paramForm", function(e){
		e.preventDefault();
		parseInput();
	});
})