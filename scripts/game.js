var time;
var fulltime = 30;
var timerReset;

var boxes;
var clickedButton;

var team1 = new Team(0, 0, 0);
var team2 = new Team(0, 0,0 );
var turn = "team2";

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
    
    $("#" + clickedButton).addClass("btn-closed-" + turn);

    GameState.pushChanges();
    GameState.saveQuestion(clickedButton, turn);
    
    playSound('assets/sounds/correct_answer.mp3');

    var bug = checkBug(clickedButton);
    
     if (turn == "team1"){
        team1.addBug(bug);
        updateStatus(turn, team1);
     } else {
        team2.addBug(bug);
        updateStatus(turn, team2);
    }
    
    showAnswer();
    hideModal();
    
    GameState.savePoints(team1, team2);

    
    $("#closeBtn").attr("disabled", false);
    
    clearTimeout(timerReset);
    reduceBoxes();
    
}

//reduces number of remaining boxes
function reduceBoxes() {
    boxes--;
    if (boxes == 0) {
        gameOver();
    }  
}


//this method is called when answer is wrong
//change the team on the move
function wrongAnswer() {  
    clearTimeout(timerReset);
    playSound('assets/sounds/wrong_answer.mp3');
    
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
    $("#correctBtn").attr("disabled", true);
    $("#wrongBtn").attr("disabled", true);
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
        if(questionObj.difficulty === 1) {
            $("#"+buttonID).css(
                'backgroundImage', 'url(assets/images/fly.png)'
            );

            return "easy";
        } else if(questionObj.difficulty === 2) {
            $("#"+buttonID).css(
                'backgroundImage','url(assets/images/bee.png)'
            );

            return "norm";
        } else if(questionObj.difficulty === 3) {
            $("#"+buttonID).css(
                'backgroundImage','url(assets/images/ladybug.png)'
            );

            return "hard";
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
    $("#correctBtn").attr("disabled", false);   
    $("#wrongBtn").attr("disabled", false); 
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

    if (team1.getPoints() > team2.getPoints()) {
        $("#team1 p").fadeTo(2000, 1.0);
        $("#team2 p").fadeTo(2000, 0.0);
        from = 0;
        to = $("#team1").width();
    } else {
        $("#team1 p").fadeTo(2000, 1.0);
        $("#team2 p").fadeTo(2000, 0.0);
        var whole = $(".main-content").width();
        from = whole - $("#team2").width();
        to = whole; 
    }

    Animator.playConfetti(from, to);
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