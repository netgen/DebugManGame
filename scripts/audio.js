var Sounds = function(){
    
    this.correctAnswerSound = new Audio('assets/sounds/correct_answer.mp3'),
    this.wrongAnswerSound = new Audio('assets/sounds/wrong_answer.mp3'),
    this.clockSound = new Audio('assets/sounds/Clock-ticking-sound.mp3');
}

Sounds.prototype = {
    playCorrectAnswer: function() {
        this.correctAnswerSound.play();
    },
    
    playWrongAnswer: function(){
        this.wrongAnswerSound.play();
    },
    
    playClockSound: function(){
        this.clockSound.play();
    },
    
    stopClockSound: function(){
        this.clockSound.pause();
        this.clockSound.currentTime = 0;
    }
    
};
