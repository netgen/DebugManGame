function Sound(path){
    this.audio = new Audio(path);
}

Sound.prototype.play = function() {
    this.audio.play()
};

Sound.prototype.pauseAndRewind = function() {
    this.audio.pause()
    this.audio.currentTime = 0;
};


var sound_list = {
    correct: 'correct_answer.mp3',
    wrong: 'wrong_answer.mp3',
    tick: 'Clock-ticking-sound.mp3'
}
    



var AUDIOS = {};

for (var name in sound_list) {
    var path = sound_list[name]
    AUDIOS[name] = new Sound('assets/sounds/'+path);
}

console.log(AUDIOS);