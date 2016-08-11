var zKoef = 2;
var wKoef = 4;
var qKoef = 6;

var time;
var fulltime = 30;
var timerReset;


var boxes;
var clickedButton;

var team1Points = 0;
var team2Points = 0;
var turn = "team2";

var numOfBugs;

$(document).keydown(function(e){
    
    e = e || window.event;

    if (e.keyCode == '67') {
        correctAnswer();
    }
    else if (e.keyCode == '87') {
        wrongAnswer();
    }
});


var myWindow;

//creates a popup window with answers

function popup() {
    myWindow = window.open("", "", "width=400,height=200");
    boxes = GameState.getRows() * GameState.getColumns();
    changeTurn();
    numOfBugs = parseInt($('#zBugs').val()) + parseInt($('#qBugs').val()) +parseInt($('#wBugs').val());
}

//this method is called on closing modal when answer is correct
//adds points to team and change the team on the move
//change appearance of clicked button
function correctAnswer() {

    GameState.pushChanges();
    GameState.saveQuestion(clickedButton, turn);
    
    playSound('assets/sounds/correct_answer.mp3');

    var points = checkBug(clickedButton);
    
    if (points == 0) {
        $("#" + clickedButton).addClass("btn-closed");
    } 
    else {
         $("#" + clickedButton).addClass("btn-closed-" + turn);
  
         if (turn == "team1"){
            team1Points += points;
            $("#team1Pts").html(team1Points);
         } else {
            team2Points += points;
            $("#team2Pts").html(team2Points);
        }
      }
    
     showAnswer();
     hideModal();
    
    GameState.savePoints(team1Points, team2Points);

    
    $("#closeBtn").attr("disabled", false);
    
    clearTimeout(timerReset);
    
}


//this method is called when answer is wrong
//change the team on the move
function wrongAnswer() {  
    
    clearTimeout(timerReset);
    playSound('assets/sounds/wrong_answer.mp3');
    
    GameState.pushChanges();
    
    //changeTurn(turn);
    
    GameState.savePoints(team1Points, team2Points);
    
     $("#checkAnswer").html("Wrong!").css("color", "red");
     hideModal();
     
}

function hideModal(){
     window.setTimeout(function(){
        $('#myModal').modal('hide');
            }, 3000);
    changeTurn(turn);
}


//shows answer in modal and resets timer
//disables clicking on buttons if correct answers
function showAnswer() {
    var questionObj = GameState.getQuestion(clickedButton);
    $("#timer").html(questionObj.answer);
    $("#checkAnswer").html("Correct!").css("color", "#06bc06");
    $("#closeBtn").attr("disabled", false);
    time = 0;
    clearTimeout(timerReset);
}


//change the team on move
function changeTurn() {
    if (turn == "team1") {
        turn = "team2";
        $("#team1").toggleClass("team1Active");
        $("#team2").toggleClass("team2Active");
        $("#team2 p").fadeTo(5000, 1.0);
        $("#team1 p").fadeTo(5000, 0.2);
    } else {
        turn = "team1";
        $("#team1").toggleClass("team1Active");
        $("#team2").toggleClass("team2Active");
        $("#team1 p").fadeTo(5000, 1.0);
        $("#team2 p").fadeTo(5000, 0.2);
    }

    answered = false;
    GameState.saveTurn(turn);
}

function checkBug(buttonID) {
    var questionObj = GameState.getQuestion(buttonID);
    if(questionObj.hasBug) {
        
            numOfBugs--;
            if (numOfBugs == 0) {
                btnGameOver();
            }
        if(questionObj.difficulty === 1) {
            $("#"+buttonID).css(
                'backgroundImage', 'url(assets/images/fly.png)'
            );

            return zKoef;
        
        }else if(questionObj.difficulty === 2) {
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
        return 0;
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
    $("#closeBtn").attr("disabled", true);
    $("#checkAnswer").html("");
    
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
                //$("#" + i + "" + j).addClass("btn-closed");
                $("#" + i + "" + j).attr("disabled", true);
                checkBug(i + "" + j);
            
        }
    }
}


//resets time
function gameOver() {
    var from, to;

    if (team1Points > team2Points) {
        $("#team1").addClass("team1Active");
        $("#team1 p").fadeTo(1000, 1.0);
        $("#team2 p").fadeTo(2000, 0.0);
        from = 0;
        to = $("#team1").width();
    } else {
         $("#team2").addClass("team2Active");
         $("#team2 p").fadeTo(1000, 1.0);
        $("#team1 p").fadeTo(2000, 0.0);
        var whole = $(".main-content").width();
        from = whole - $("#team2").width();
        to = whole; 
    }

    Animator.playConfetti(from, to);
}

function btnUndo() {
    GameState.load();
    team1Points = GameState.getTeam1Points();
    team2Points = GameState.getTeam2Points();
    $("#team1Pts").html(team1Points);
    $("#team2Pts").html(team2Points);
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
                $("#" + id).addClass("btn-closed-" + question.opener);
            } else {
                $("#" + id).removeClass("btn-closed-team1");
                $("#" + id).removeClass("btn-closed-team2");
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
        playSound('assets/sounds/ticker.mp3');
        if (time == 0) {
            wrongAnswer();
            return;
        }
		
        timer();
	}, 1000);
}