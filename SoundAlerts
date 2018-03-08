/*==================================
This script can be dropped directly into the auto tab on RaiGames.io to enable sounds
during manual betting or dropped into another script to enable sounds during automated betting.
This does mean that AutoBet can't be supported unless you have a separate window open.
===================================*/

var sounds = {
    win: true,
    lose: true,
    mention: true
}
var soundsUsername = engine.getUsername();

logEnabledSounds();

engine.on("game_crash", function(data) {
    var result = engine.lastGamePlay();
    if (sounds.lose && result == "LOST") {
        playLose();
    }
    else if (sounds.win && result == "WON") {
        playWin();
    }
});

engine.on("msg", function(data) {
    if (data.message) {
        if (data.username == engine.getUsername()) {
            if (data.message == "!sounds.win:on") {
                sounds.win = true;
                console.log("Sounds turned on for wins.");
            }
            else if (data.message == "!sounds.lose:on") {
                sounds.lose = true;
                console.log("Sounds turned on for losses.");
            }
            else if (data.message == "!sounds.mention:on") {
                sounds.mention = true;
                console.log("Sounds turned on for chat mentions.");
            }
            else if (data.message == "!sounds.win:off") {
                sounds.win = false;
                console.log("Sounds turned off for wins.");
            }
            else if (data.message == "!sounds.lose:off") {
                sounds.lose = false;
                console.log("Sounds turned off for losses.");
            }
            else if (data.message == "!sounds.mention:off") {
                sounds.mention = false;
                console.log("Sounds turned off for chat mentions.");
            }
        }
        else if (sounds.mention && data.message.toLowerCase().indexOf(soundsUsername.toLowerCase()) >= 0) {
            playMention();
        }
    }
});

function playWin() {
    playSound("triangle", 1.5);
}

function playLose() {
    playSound("sine", 0.08);
}

function playMention() {
    playSound('sine', 1.1);
}

/* Held outside the playSound method to keep them in scope after starting sounds. */
var soundsObjects = {
    context: null,
    oscillator: null,
    gain: null
};

function playSound(type, x) {
    if (soundsObjects.context) {
        /* Don't overlap sounds. */
        return;
    }
    
    /* With the way that RaiGames runs these scripts, we can't use one context over a long period of time, because
       we risk creating multiple when the script is stopped and started again.  That would cause issues in Chrome. */
    soundsObjects.context = new (window.AudioContext || window.webkitAudioContext)();
    soundsObjects.oscillator = soundsObjects.context.createOscillator();
    soundsObjects.gain = soundsObjects.context.createGain();
    soundsObjects.oscillator.connect(soundsObjects.gain);
    soundsObjects.oscillator.type = type;
    soundsObjects.gain.connect(soundsObjects.context.destination);
    soundsObjects.oscillator.start(0);
    soundsObjects.gain.gain.exponentialRampToValueAtTime(0.00001, soundsObjects.context.currentTime + x);
    setTimeout(closeSound, Math.max(1250*x, 250)); /* Give the sound time to clear before closing out and allowing the next sound. */
}

function closeSound() {
    soundsObjects.context.close();
    soundsObjects.context = null;
}

function logEnabledSounds() {
    var enabledSounds = "";
    if (sounds.win) {
        enabledSounds += "win";
    }
    if (sounds.lose) {
        if (enabledSounds) {
            enabledSounds += ", ";
        }
        enabledSounds += "lose";
    }
    if (sounds.mention) {
        if (enabledSounds) {
            enabledSounds += ", ";
        }
        enabledSounds += "mention";
    }
    if (enabledSounds) {
        console.log("Sounds enabled for: " + enabledSounds);
    }
}
