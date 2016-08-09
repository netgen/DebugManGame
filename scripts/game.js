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
var turn = "blue";

var myWindow;

function popup() {
    myWindow = window.open("", "", "width=400,height=200");
    boxes = GameState.getRows() * GameState.getColumns();
}

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
    
    boxes--;
    if (boxes === 0) {
        gameOver();
    }
    
}

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