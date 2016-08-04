var zKoef = 6;
var wKoef = 4;
var qKoef = 2;

var time;
var fulltime = 30;
var timerReset;


var boxes = localStorage.noRows * localStorage.noColumns;
var clickedButton;
var bugs = [];

var bluePoints = 0;
var greenPoints = 0;
var turn = "blue";

function correctAnswer() {
    $("#"+clickedButton).css ({
        backgroundColor: "#c4ffc9",
        pointerEvents: "none"
    });
    
    var points = checkBug(clickedButton);
    showAnswer();
    
    if (turn == "blue"){
        bluePoints+=points;
        $("#blueP").html(bluePoints);
        changeTurn(turn);
    }
    else {
        greenPoints+=points;
        $("#greenP").html(greenPoints);
        changeTurn(turn);
    }

    playSound("correct_answer");
    
    boxes--;
    if (boxes == 0) {
        gameOver()
    }
}


function showAnswer(){
    var questionObj = getQuestion(clickedButton);
    $("#correctBtn").attr("disabled", true);   
    $("#wrongBtn").attr("disabled", true); 
    $("#timer").html(questionObj.answer);
    time=0;
    clearTimeout(timerReset);
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
    $('#myModal').modal('hide');
}

function changeTurn(){
    
    if (turn == "blue"){
        turn = "green";
        $("#greenTeamId").toggleClass("greenActive").toggleClass("notActive");;
        $("#blueTeamId").toggleClass("blueActive");
        $("#blueTeamId").toggleClass("notActive");
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
        if(questionObj.difficulty == 1){
              $("#"+clickedButton).css('backgroundImage','url(assets/images/ladybug.png)');
            return zKoef;
        }
        if(questionObj.difficulty == 2){
            $("#"+clickedButton).css('backgroundImage','url(assets/images/bee.png)');
            return wKoef;
        }
        if(questionObj.difficulty == 3){
              $("#"+clickedButton).css('backgroundImage','url(assets/images/fly.png)');
            return qKoef;
        }
    }
    else {
        return 1;
    }
}


function setIdClickedButton(buttonID) {
    clickedButton = buttonID;
    var questionObj = getQuestion(buttonID);
    $("#question").text(questionObj.question);
    resetTime();
     $("#correctBtn").attr("disabled", false);   
     $("#wrongBtn").attr("disabled", false); 
}


function gameOver(){
    alert("Game over!");
}

function resetTime(){
    $("#timer").html(fulltime+"s");
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
           // $('#myModal').modal('hide');
            wrongAnswer();
            return;
        }
		timer();
	}, 1000);
}