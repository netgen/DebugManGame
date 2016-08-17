var time;
var fulltime = 10;
var timerReset;

var clickedButton;

var team1 = new Team(0, 0, 0);
var team2 = new Team(0, 0, 0);
var turn = "team2";

var numOfBugs;
var totalBugs;

var KEY_C = 67;
var KEY_W = 87;

var isGameOver = false;

$(document).keydown(function(e){
    
    e = e || window.event;

    if (e.keyCode == KEY_C) {
        correctAnswer();
    }
    else if (e.keyCode == KEY_W) {
        wrongAnswer();
    }
});


var myWindow;
var popup;

//creates a popup window with answers

function init() {
    myWindow = window.open("popupWindow.html", "mypopup" ,"width=600,height=400");
    console.log(myWindow);
    changeTurn();
    numOfBugs = parseInt($('#zBugs').val()) + 
                parseInt($('#qBugs').val()) +
                parseInt($('#wBugs').val());
    totalBugs = numOfBugs;

    $("#myModal").on("shown.bs.modal", function() {
        if (!isGameOver) {
            Animator.playTimer(fulltime, $("#timer"));
        }
    });
}

function updateStatus(teamName, team) {
    $("#" + teamName + "easyBugs").html(team.getBugs("easy"));
    $("#" + teamName + "normBugs").html(team.getBugs("norm"));
    $("#" + teamName + "hardBugs").html(team.getBugs("hard"));
    $("#" + teamName + "Pts").html(team.getPoints());
}

//this method is called on closing modal when answer is correct
//adds points to team and change the team on the move
//change appearance of clicked button
function correctAnswer() {
    Animator.stopTimer();

    GameState.pushChanges();
    GameState.saveQuestion(clickedButton, turn);
    
    AUDIOS["tick"].pauseAndRewind();
    AUDIOS["correct"].play();
    var bug = checkBug(clickedButton, true);
    
    if (bug) {
        if (turn === "team1"){
            team1.addBug(bug);
            updateStatus(turn, team1);
        } else {
            team2.addBug(bug);
            updateStatus(turn, team2);
        }
        $('[data-id="'+clickedButton+'"]').addClass("btn-closed-" + turn);
    }
    else {
        $('[data-id="'+clickedButton+'"]').addClass("btn-closed");
    }

    showAnswer();
    hideModal();
    
    GameState.savePoints(team1, team2);

    $("#closeBtn").attr("disabled", false);
    
    clearTimeout(timerReset);
    
    if (numOfBugs === 0) {
            btnGameOver();
    }
}


//this method is called when answer is wrong
//change the team on the move
function wrongAnswer() {  
    Animator.stopTimer();
    clearTimeout(timerReset);
    
    AUDIOS["tick"].pauseAndRewind();
    AUDIOS["wrong"].play();
    GameState.pushChanges();   
    GameState.savePoints(team1, team2);
    
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

function checkBug(buttonID, animate) {
    var questionObj = GameState.getQuestion(buttonID), bug, type = null;
    if(questionObj.hasBug) {
        var button = $('[data-id="'+buttonID+'"]');
        
        numOfBugs--;

        if(questionObj.difficulty === 1) {
            bug = 'fly';
            type = "easy";
        } else if(questionObj.difficulty === 2) {
            bug = 'bee';
            type = "norm";
        } else if(questionObj.difficulty === 3) {
            bug = 'ladybug';
            type = "hard";
        }

        var buttonPos = button.offset();
        var iconPos = $("#" + turn + bug + "Icon").offset();

        if (animate) {
            Animator.playBug(
                {
                    x: buttonPos.left,
                    y: buttonPos.top
                },

                {
                    x: iconPos.left,
                    y: iconPos.top
                },

                bug
            );
        }

        button.removeClass("btn-no-bug");
        button.addClass('btn-' + bug);
    }

    return type;            
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

function setIdClickedButton() {

    clickedButton = String($(this).data('id'));
    var questionObj = GameState.getQuestion(clickedButton);
    
    AUDIOS["tick"].play();
    
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

    var div = myWindow.document.getElementById('divId');
    div.innerHTML = "<br />" + str1.fontsize("6") + "<br />";
    div.innerHTML = div.innerHTML + " " + str2.fontsize("7");
    

    
}


function btnGameOver() {
    isGameOver = true;

    GameState.pushChanges();

    gameOver();
    
    var m = GameState.getRows();
    var n = GameState.getColumns();

    for (var i = 0; i < m; i++) {
        for (var j = 0; j < n; j++){
                checkBug(i + "" + j, false);
                $('[data-id="'+ i + "" + j +'"]').addClass("btn-closed");
            
        }
    }
}

function gameOver() {
    var from, to,
        team1_points = team1.getPoints(),
        team2_points = team2.getPoints();

    if (team1_points > team2_points) {
        $("#team1").addClass("team1Active");
        $("#team1 p").fadeTo(1000, 1.0);
        $("#team2 p").fadeTo(2000, 0.0);
        from = 0;
        to = $("#team1").width();

        Animator.playConfetti(from, to);
    } else if (team1_points < team2_points) {
        $("#team2").addClass("team2Active");
        $("#team2 p").fadeTo(1000, 1.0);
        $("#team1 p").fadeTo(2000, 0.0);
        var whole = $(".main-content").width();
        from = whole - $("#team2").width();
        to = whole;

        Animator.playConfetti(from, to);
    } else {
        $("#tieModal").modal("show");
    }
}

function btnUndo() {
    GameState.load();
    team1 = GameState.getTeam("team1");
    team2 = GameState.getTeam("team2");
    updateStatus("team1", team1);
    updateStatus("team2", team2);
    $("#btnUndo").attr("disabled", true);
    changeTurn();

    var m = GameState.getRows();
    var n = GameState.getColumns();

    numOfBugs = totalBugs;
    isGameOver = false;

    for (var i = 0; i < m; i++) {
        for (var j = 0; j < n; j++) {
            var id = i + "" + j;
            var question = GameState.getQuestion(id);
            var button = $('[data-id="' + id + '"]');

            if (question.closed) {
                button.addClass("btn-closed");
                numOfBugs--;
            } else {
                if (!question.hasBug) {
                    button.removeClass("btn-closed");
                } else {
                    button.removeClass("btn-closed-team1");
                    button.removeClass("btn-closed-team2");
                    button.removeClass("btn-fly");
                    button.removeClass("btn-bee");
                    button.removeClass("btn-ladybug");
                    button.addClass("btn-no-bug");
                }
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
        if (time == 0) {
            wrongAnswer();
            return;
        }
		
        timer();
	}, 1000);
}

function newGame() {
    window.location.href='index.html';
}

$(document.body).on('click', '.btn-box', setIdClickedButton);