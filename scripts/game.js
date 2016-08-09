var zKoef = 2;
var wKoef = 4;
var qKoef = 6;

var time;
var fulltime = 30;
var timerReset;


var boxes;
var clickedButton;

var bluePoints = 0;
var greenPoints = 0;
var turn = "green";

var myWindow;

//creates a popup window with answers

function popup() {
    myWindow = window.open("", "", "width=400,height=200");
    boxes = GameState.getRows() * GameState.getColumns();
}


//change appearance of clicked button
function correctAnswer() {
    $("#" + clickedButton).addClass("btn-closed");

    GameState.pushChanges();

    GameState.saveQuestion(clickedButton);

    var points = checkBug(clickedButton);
    showAnswer();

    if (turn == "blue") {
        bluePoints += points;
        $("#blueP").html(bluePoints);
    } else {
        greenPoints += points;
        $("#greenP").html(greenPoints);
    }

    GameState.savePoints(bluePoints, greenPoints);

    changeTurn(turn);
    reduceBoxes();
    
}

//reduces number of remaining boxes
function reduceBoxes() {
    boxes--;
    if (boxes == 0) {
        gameOver()
    }  
}


//shows answer in modal and resets timer
//disables clicking on buttons if correct answers
function showAnswer(){
    var questionObj = getQuestion(clickedButton);
    $("#correctBtn").attr("disabled", true);   
    $("#wrongBtn").attr("disabled", true); 
    $("#timer").html(questionObj.answer);
    time = 0;
    clearTimeout(timerReset);
}


//this method is called on closing modal when answer is correct
//adds points to team and change the team on the move
function closeAfterCorrect(){
    
    playSound('assets/sounds/correct_answer.mp3');
    
    var points = checkBug(clickedButton);
    
     if (turn == "blue"){
            bluePoints+=points;
            $("#blueP").html(bluePoints);
        }
        else {
            greenPoints+=points;
            $("#greenP").html(greenPoints);
        }
        changeTurn(turn);
}


//change the team on move
function changeTurn(){    
    if (turn == "blue") {
        turn = "green";
        $("#greenTeamId p").fadeTo("slow",1.0);
        $("#blueTeamId p").fadeTo("slow",0.0);
    } else {
        turn = "blue";
        $("#blueTeamId p").fadeTo("slow",1.0);
        $("#greenTeamId p").fadeTo("slow",0.0);
    }
}


//this method is called when answer is wrong
//closes modal and change the team on the move
function wrongAnswer() {
    GameState.pushChanges();

    if (turn == "blue") {
        $("#blueP").html(bluePoints);
    } else {
        $("#greenP").html(greenPoints);
    }

    changeTurn(turn);
    GameState.savePoints(bluePoints, greenPoints);
    
    $('#myModal').modal('hide');
}

function showAnswer() {
    var questionObj = GameState.getQuestion(clickedButton);
    $("#correctBtn").attr("disabled", true);
    $("#wrongBtn").attr("disabled", true);
    $("#timer").html(questionObj.answer);
    time = 0;
    clearTimeout(timerReset);
}

function changeTurn() {
    if (turn == "blue") {
        turn = "green";
        $("#greenTeamId").toggleClass("activeSidebar").toggleClass("notActive");
        $("#greenTeamId p").fadeTo("slow", 1.0);
        $("#blueTeamId").toggleClass("activeSidebar").toggleClass("notActive");
        $("#blueTeamId p").fadeTo("slow", 0.2);
    } else {
        turn = "blue";
        $("#greenTeamId").toggleClass("activeSidebar").toggleClass("notActive");
        $("#blueTeamId p").fadeTo("slow", 1.0);
        $("#blueTeamId").toggleClass("activeSidebar").toggleClass("notActive");
        $("#greenTeamId p").fadeTo("slow", 0.2);
    }

    GameState.saveTurn(turn);
}

function checkBug(buttonID) {
    var questionObj = GameState.getQuestion(buttonID);
    if(questionObj.hasBug) {
        if(questionObj.difficulty === 1) {
            $("#"+buttonID).css(
                'backgroundImage', 'url(assets/images/fly.png)'
            );

            return zKoef;
        } else if(questionObj.difficulty === 2) {
            $("#"+buttonID).css(
                'backgroundImage','url(assets/images/bee.png)'
            );

            return wKoef;
        } else if(questionObj.difficulty === 3) {
            $("#"+buttonID).css(
                'backgroundImage','url(assets/images/ladybug.png)'
            );

            return qKoef;
        }
    } else {
        return 1;
    }
}


//returns question

function getQuestion(buttonID) {
    var y = parseInt(buttonID.charAt(0)),
        x = parseInt(buttonID.charAt(1));
    return JSON.parse(localStorage.grid)[y][x];
}


//this method is called after button on the board is clicked
//writes in popup window answer to the question on that button
//enables clicking on correct/wrong buttons i modal
//resets time

function setIdClickedButton(buttonID) {
    clickedButton = buttonID;
    var questionObj = GameState.getQuestion(buttonID);
    
    popupAnswer(questionObj);
    
    $("#question").text(questionObj.question);
    $("#correctBtn").attr("disabled", false);   
    $("#wrongBtn").attr("disabled", false); 
    
    resetTime();
}



var str1;
var str2;

function popupAnswer(questionObj) {
    str1 = questionObj.question;
    str2 = questionObj.answer;
    myWindow.document.write("<p>" + str1.fontsize("5") + "</p>");
    myWindow.document.write("<p>" + str2.fontsize("7") + "</p>");
    myWindow.document.close();
}

function btnGameOver() {
    gameOver();
    
    var m = GameState.getRows();
    var n = GameState.getColumns();

    for (var i = 0; i < m; i++) {
        for (var j = 0; j < n; j++){
                $("#" + i + "" + j).addClass("btn-closed");
                checkBug(i + "" + j);
        }
    }
}


//resets time
function gameOver() {
    alert("Game over!");
}

function btnUndo() {
    GameState.load();
    bluePoints = GameState.getBluePoints();
    greenPoints = GameState.getGreenPoints();
    $("#blueP").html(bluePoints);
    $("#greenP").html(greenPoints);
    $("#btnUndo").attr("disabled", true);
    changeTurn();

    var m = GameState.getRows();
    var n = GameState.getColumns();

    boxes = 0;

    for (var i = 0; i < m; i++) {
        for (var j = 0; j < n; j++) {
            var id = i + "" + j;
            var question = GameState.getQuestion(id);

            if (question.closed) {
                $("#" + id).addClass("btn-closed");
            } else {
                $("#" + id).removeClass("btn-closed");
                $("#" + id).css("backgroundImage", "none");
                boxes++;
            }
        }
    }
}

function resetTime() {
    $("#timer").html(fulltime + "s");
    clearTimeout(timerReset);
    time = fulltime;
    timer();
}

//implementation of timer
//if nothing is clicked, game acts like the answer is wrong
function timer() {
	timerReset = setTimeout(function() {
		var timerDiv = document.getElementById("timer");
		time--;
		timerDiv.innerHTML = time + "s";
        
         if (time === 0) {
            wrongAnswer();
            return;
        }
		
        timer();
	}, 1000);
}
