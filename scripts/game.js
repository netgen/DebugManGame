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
    boxes = localStorage.noRows * localStorage.noColumns;
    changeTurn();
}


//change appearance of clicked button

function correctAnswer() {
    $("#"+clickedButton).css ({
        backgroundColor: "#f4f8d2",
        pointerEvents: "none"
    });
    
    showAnswer();
   
    reduceBoxes();
}


//reduces number of remaining boxes

function reduceBoxes(){
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


//change the team on the move

function changeTurn(){    
    if (turn == "blue") {
        turn = "green";
        $("#greenTeamId p").fadeTo(3000,1.0);
        $("#blueTeamId p").fadeTo(5000,0.0);
    } else {
        turn = "blue";
        $("#blueTeamId p").fadeTo(3000,1.0);
        $("#greenTeamId p").fadeTo(5000,0.0);
    }
}


//this method is called when answer is wrong
//change the team on the move
function wrongAnswer() {  
    clearTimeout(timerReset);
    playSound('assets/sounds/wrong_answer.mp3');
    changeTurn(turn);
}


//checks if there is a bug on the button
//returns their coefficient or 1

function checkBug(buttonID) {
    
    var questionObj = getQuestion(buttonID);
    
    if(questionObj.hasBug){
        
        if(questionObj.difficulty == 1){
            $("#"+buttonID).css(
                'backgroundImage','url(assets/images/fly.png)');
            return zKoef;
        } else if (questionObj.difficulty == 2) {
            $("#"+buttonID).css(
                'backgroundImage','url(assets/images/bee.png)'
            );
            return wKoef;
        } else if (questionObj.difficulty == 3) {
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
    var questionObj = getQuestion(buttonID);
    
    popupAnswer(questionObj);
    
     $("#question").text(questionObj.question);
     $("#correctBtn").attr("disabled", false);   
     $("#wrongBtn").attr("disabled", false); 
    
    resetTime();
}



var str1;
var str2;


//writes answer to the popup window
function popupAnswer (questionObj){
    str1 = questionObj.question;
    str2 = questionObj.answer;
    myWindow.document.write("<p>"+ str1.fontsize("5") + "</p>");
    myWindow.document.write("<p>"+str2.fontsize("7")+ "</p>");
    myWindow.document.close();
}

var p;
var l;

function btnGameOver() {

//this method is called when button 'Game over' is clicked
//opens all fields on game board and disables clicking on them

    gameOver();
    
    for (var i=0; i<localStorage.noRows; i++){
        for (var j=0; j<localStorage.noColumns; j++){
                $("#"+i+""+j).css ({
                    backgroundColor: "#f4f8d2",
                    pointerEvents: "none"
                });
                checkBug(i + "" + j);
        }
    }
    
}

//game over
function gameOver(){
    alert("Game over!");
}

//resets time

function resetTime(){
    $("#timer").html(fulltime+"s");
    clearTimeout(timerReset);
    time = fulltime;
    timer();
}


//implementation of timer
//if nothing is clicked, game acts like the answer is wrong

function timer() {
	timerReset = setTimeout(function () {
		var timerDiv = document.getElementById("timer");
		time--;
		timerDiv.innerHTML = time + "s";
        playSound('assets/sounds/ticker.mp3');
        if (time == 0) {
            wrongAnswer();
            $('#myModal').modal('hide');
            return;
        }
		timer();
	}, 1000);
}
