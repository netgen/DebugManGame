var x = 7;
var y = 7;
var z = 7;
var w = 7;
var q = 7;

var boxes = x*y;
var clickedButton;
var bugs = [];

(function (){
    for (var i=0; i<x; i++){
        document.write("<div>");
        for (var j=0; j<y; j++) {
                document.write("<input type='button' id='"+i+""+j+"'class='btn-box' onclick='setIdClickedButton(id)' data-toggle='modal' data-target='#myModal' />");      
        }
        document.write("</div>");
    }
    
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
    correct = true;
    document.getElementById(clickedButton).style.backgroundColor= "#c4ffc9";
    document.getElementById(clickedButton).style.pointerEvents = 'none';
    
    checkBug(clickedButton);
    //document.getElementById(clickedButton).style.backgroundImage = "url('ladybug.png')";
    
    boxes--;
    if (boxes == 0) {
        gameOver();
    }
}

function checkBug(clickedButton){
    var yClick = clickedButton % 10;
    var xClick = (clickedButton - yClick) / 10;
    
    if(bugs[xClick][yClick] == "Z"){
        document.getElementById(clickedButton).style.backgroundImage = "url('bomb.png')";
    }
}

function setIdClickedButton(buttonId){
    clickedButton = buttonId;
}


function gameOver(){
    alert("Game over!");
}

