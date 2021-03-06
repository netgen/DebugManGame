function init() {
    GameData.fulltime = parseInt(GameState.getQuestionTime());

    GameData.popupWindow = window.open("popupWindow.html", "mypopup" ,"width=600,height=400");
    GameData.popupWindow.onload = function() { disableUndo(true) };
     GameData.numOfBugs = parseInt($('#numEasyBugs').val()) + 
                parseInt($('#numNormBugs').val()) +
                parseInt($('#numHardBugs').val());
    GameData.totalBugs = GameData.numOfBugs;

    $("#myModal").on("shown.bs.modal", function() {
        if (!GameData.isGameOver) {
            Animator.playTimer(GameData.fulltime, $("#timer"));
        }
    });

    changeTurn();
}


$(document.body).on('click', '.btn-box', setIdClickedButton);

//this method is called after button on the board is clicked
//writes in popup window answer to the question on that button
//enables clicking on correct/wrong buttons i modal
//resets time

var questonObj;
function setIdClickedButton() {
    GameData.keyboardEvents = true;

    clickedButton = String($(this).data('id'));
    questionObj = GameState.getQuestion(clickedButton);
    
    AUDIOS["tick"].play();
    
    popupAnswer(questionObj);
    
    
    $("#question").text(questionObj.question);
    $("#closeBtn").attr("disabled", true);
    $("#checkAnswer").html("");

    
    resetTime();
}


//returns question
function getQuestion(buttonID) {
    var y = parseInt(buttonID.charAt(0)),
        x = parseInt(buttonID.charAt(1));
    return JSON.parse(localStorage.grid)[y][x];
}



//writes question and answer to popup window
function popupAnswer(questionObj) {
    var div = GameData.popupWindow.document.getElementById('divId');
    div.innerHTML = "<br />" + questionObj.question.fontsize(6) + "<br />";
    div.innerHTML = div.innerHTML + " " + questionObj.answer.fontsize(7);   
}

//resets time
function resetTime() {
    $("#timer").html(GameData.fulltime + "s");
    clearTimeout(GameData.timerReset);
    GameData.time = GameData.fulltime;
    timer();
}

//status update
function updateStatus(teamName, team) {
    $("#" + teamName + "easyBugs").html(team.getBugs("easy"));
    $("#" + teamName + "normBugs").html(team.getBugs("norm"));
    $("#" + teamName + "hardBugs").html(team.getBugs("hard"));
    $("#" + teamName + "Pts").html(team.getPoints());
}


//checks if there is a bug behind the button
//if it is there, it flies to team score
function checkBug(buttonID, animate) {
    var questionObj = GameState.getQuestion(buttonID), bug, type = null;
    if(questionObj.hasBug) {
        var button = $('[data-id="'+buttonID+'"]');

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

//shows answer in modal and resets timer
//disables clicking on buttons if correct answers
function showAnswer() {
    var questionObj = GameState.getQuestion(clickedButton);
    $("#timer").html(questionObj.answer);
    $("#checkAnswer").html("Correct!").css("color", "#06bc06");
    $("#closeBtn").attr("disabled", false);
    time = 0;

    clearTimeout(GameData.timerReset);
}


//hides modal
function hideModal(){
    window.setTimeout(function(){
        $('#myModal').modal('hide');
            }, 2000);
    changeTurn();
}

function pulseText(team) {
    if (GameData.isGameOver) return;

    $("#" + team + "Info").stop()
                            .delay(100)
                            .animate({fontSize: "27px"}, 500)
                            .animate({fontSize: "20px"}, 500)
                            .animate({fontSize: "27px"}, 500)
                            .animate({fontSize: "20px"}, 500);
}


//change the team on move
function changeTurn() {
    $("#" + turn + "Info").html("");

    if (turn === "team1") {
        turn = "team2";
        $("#team1").toggleClass("team1Active");
        $("#team2").toggleClass("team2Active");
        $("#team2 p").fadeTo(2000, 1.0).promise().done(function() {
            pulseText(turn);
        });
        $("#team1 p").fadeTo(2000, 0.2);
    } else {
        turn = "team1";
        $("#team1").toggleClass("team1Active");
        $("#team2").toggleClass("team2Active");
        $("#team1 p").fadeTo(2000, 1.0).promise().done(function() {
            pulseText(turn);
        });
        $("#team2 p").fadeTo(2000, 0.2);
    }

    $("#" + turn + "Info").html("YOUR TURN!");

    GameState.saveTurn(turn);
}



//this method is called on closing modal when answer is correct
//adds points to team and change the team on the move
//change appearance of clicked button
function correctAnswer() {
    Animator.stopTimer();

    GameState.pushChanges();
    disableUndo(false);
    GameState.saveQuestion(clickedButton, turn);
    
    AUDIOS["tick"].pauseAndRewind();
    AUDIOS["correct"].play();
    var bug = checkBug(clickedButton, true);
    
    if (bug) {
        
        GameData.numOfBugs--;
        
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
    
    clearTimeout(GameData.timerReset);
    
    if (GameData.numOfBugs === 0) {
            btnGameOver();
    }
    
    GameData.keyboardEvents = false;
}


//this method is called when the answer is wrong
//change the team on the move
function wrongAnswer() {  
    Animator.stopTimer();
    
    clearTimeout(GameData.timerReset);
    
    AUDIOS["tick"].pauseAndRewind();
    AUDIOS["wrong"].play();
    GameState.pushChanges();
    disableUndo(false);
    GameState.savePoints(team1, team2);
    
    $("#checkAnswer").html("Wrong!").css("color", "red");
    hideModal();
    
    GameData.keyboardEvents = false;
}

var KEY_C = 67;
var KEY_W = 87;

//when 'C' is pressed method correctAnswer() is called
//when 'W' is pressed, method wrongAnswer() is called
$(document).keydown(function(e){
    
    e = e || window.event;

    if (GameData.keyboardEvents && e.keyCode == KEY_C) {
        correctAnswer();
    }
    else if (GameData.keyboardEvents && e.keyCode == KEY_W) {
        wrongAnswer();
    }
});



//game over
//conffeties start to fall
function gameOver() {
    
    setPointerEvents('none');
    
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



//this method is called when button 'Game over' is pressed
function btnGameOver() {
    GameData.isGameOver = true;

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



//this method is called when button 'Undo' is pressed
function btnUndo() {
    GameState.load();
    team1 = GameState.getTeam("team1");
    team2 = GameState.getTeam("team2");
    updateStatus("team1", team1);
    updateStatus("team2", team2);
    disableUndo(true);
    changeTurn();

    var m = GameState.getRows();
    var n = GameState.getColumns();

   GameData.numOfBugs = GameData.totalBugs;
    GameData.isGameOver = false;

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


//implementation of timer
//if nothing is clicked, game acts like the answer is wrong
function timer() {
	GameData.timerReset = setTimeout(function() {
		var timerDiv = document.getElementById("timer");
		GameData.time--;
        timerDiv.innerHTML = GameData.time + "s";
        if (GameData.time == 0) {
            wrongAnswer();
            return;
        }
		
        timer();
	}, 1000);
}


//this method is called when button 'New Game' is pressed
//starts a new game
function newGame() {
    window.location.href='index.html';
    GameData.popupWindow.document.getElementById('divId').innerHTML = "";
    setPointerEvents('all');
}

function setPointerEvents(pointerEvent){
    GameData.popupWindow.document.getElementById('btnChangeTurn').style.pointerEvents = pointerEvent;
    GameData.popupWindow.document.getElementById('btnGmOv').style.pointerEvents = pointerEvent;
}

function disableUndo(disabled) {
    GameData.popupWindow.document.getElementById('btnUndo').style.pointerEvents =
        disabled ? 'none' : 'all';
}