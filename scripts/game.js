var x = 7;
var y = 7;
var z = 7;
var w = 7;
var q = 7;

var time;
var fulltime = 5;
var timerReset;

var boxes = x*y;
var clickedButton;
var bugs = [];

var bluePoints = 0;
var greenPoints = 0;
var turn ="blue";

function correctAnswer() {
    document.getElementById(clickedButton).style.backgroundColor= "#c4ffc9";
    document.getElementById(clickedButton).style.pointerEvents = 'none';
    
    checkBug(clickedButton);
    
    if (turn == "blue"){
        bluePoints++;
        document.getElementById("blueP").innerHTML = bluePoints;
        changeTurn(turn);
    }
    else {
        greenPoints++;
        document.getElementById("greenP").innerHTML = greenPoints;
        changeTurn(turn);
    }

    boxes--;
    if (boxes == 0) {
        gameOver();
    }
    time = 5;
}


function wrongAnswer() {
    if (turn == "blue") {
        document.getElementById("blueP").innerHTML = bluePoints;
        changeTurn(turn);
    }
    else {
        document.getElementById("greenP").innerHTML = greenPoints;
        changeTurn(turn);
    }
}

function changeTurn(){
        var g = document.getElementById("greenTeamId");
        var b = document.getElementById("blueTeamId");
    
    if (turn == "blue"){
        b.style.backgroundColor = "transparent";
        b.style.fontSize = "medium";
        turn = "green";
        g.style.backgroundColor ="#95f892";
        g.style.fontSize = "x-large";
    } else {
        g.style.backgroundColor = "transparent";
        g.style.fontSize = "medium";
        turn = "blue";
        
        b.style.backgroundColor ="#bad5ff";
        b.style.fontSize = "x-large";
    }
}

function getQuestion(buttonID) {
    var y = parseInt(buttonID.charAt(0)),
        x = parseInt(buttonID.charAt(1));
    return JSON.parse(localStorage.grid)[y][x];
}

function checkBug(buttonID) {
    var questionObj = getQuestion(buttonID);
    if(questionObj.hasBug){
        document.getElementById(clickedButton).style.backgroundImage = "url('assets/images/ladybug.png')";
    }
}


function setIdClickedButton(buttonID) {
    clickedButton = buttonID;
    var questionObj = getQuestion(buttonID);
    $("#question").text(questionObj.question);
    resetTime();
}


function gameOver(){
    alert("Game over!");
}

function resetTime(){
    document.getElementById("timer").innerHTML = "5s";
    clearTimeout(timerReset);
    time = fulltime;
    timer();
}


function timer() {
	timerReset = setTimeout(function () {
		var timerDiv = document.getElementById("timer");
		time--;
		timerDiv.innerHTML = time + "s";
        if (time == 0) {
            $('#myModal').modal('hide');
            wrongAnswer();
            return;
        }
		timer();
	}, 1000);
}