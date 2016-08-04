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
    
    $("#"+clickedButton).css ({
        backgroundColor: "#c4ffc9",
        pointerEvents: "none"
    });
    
    checkBug(clickedButton);
    
    if (turn == "blue"){
        bluePoints++;
        $("#blueP").html(bluePoints);
        changeTurn(turn);
    }
    else {
        greenPoints++;
        $("#greenP").html(greenPoints);
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
        $("#blueP").html(bluePoints);
        changeTurn(turn);
    }
    else {
        $("#greenP").html(greenPoints);
        changeTurn(turn);
    }
}

function changeTurn(){
    
    if (turn == "blue"){
        turn = "green";
        $("#greenTeamId").toggleClass("greenActive").toggleClass("notActive");;
        $("#blueTeamId").toggleClass("blueActive").toggleClass("notActive");
    } else {
        turn = "blue";
        $("#greenTeamId").toggleClass("greenActive").toggleClass("notActive");
        $("#blueTeamId").toggleClass("blueActive").toggleClass("notActive");
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