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


(function (){
    var b = document.getElementById("blueTeamId");
    b.style.backgroundColor ="#bad5ff";
    b.style.fontSize = "x-large";
    
    setBugs();
})(); 

function setBugs(){
    fill();
    var xBug;
    var yBug;
    for (var i=0; i<z; i++){
        xBug = Math.floor((Math.random() * z));
        yBug = Math.floor((Math.random() * z));
        bugs[xBug][yBug] = "Z";
    }
    
    console.log(bugs);
    
}


function fill(){
    bugs = new Array(x);
    for (var i = 0; i < x; i++) {
        bugs[i] = new Array(y);
    }
    for(i=0; i<x; i++){
        for (var j=0; j<y; j++){
            bugs[i][j]=0;
        }
    }
}


function correctAnswer(){
    
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


function wrongAnswer(){

    if (turn == "blue"){
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
    }
    else {
        g.style.backgroundColor = "transparent";
        g.style.fontSize = "medium";
        turn = "blue";
        
        b.style.backgroundColor ="#bad5ff";
        b.style.fontSize = "x-large";
    }
}

function checkBug(clickedButton) {
    var yClick = clickedButton % 10;
    var xClick = (clickedButton - yClick) / 10;
    
    if(bugs[xClick][yClick] == "Z"){
        document.getElementById(clickedButton).style.backgroundImage = "url('assets/images/ladybug.png')";
    }
}


function setIdClickedButton(buttonId) {
    clickedButton = buttonId;
    var y = parseInt(buttonId.charAt(0));
    var x = parseInt(buttonId.charAt(1));
    var questionObj = JSON.parse(localStorage.grid)[y][x];
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




