/*
   This is a script that can be run on RaiGames.io to provide stats based on chat prompts.

   The following commands can be called by anyone:
    - !med:            Returns the median of the last 100 games.
    - !med A[ B[ C]]:  Returns the median(s) of the last A[, B[, and C]] games, max 1000 each.
                       A, B, and C can also be specified in the format AxS, where S is the number of sets of A to go back, max 5 each.
                       For example, "!med 500x2" will return the last two intervals of 500 games, which is a median for games 1-500 and another for games 501-1000.
    - !avg:            Returns the average of the last 100 games.
    - !avg A[ B[ C]]:  Returns the average(s) of the last A[, B[, and C]] games, max 1000 (each).
                       A, B, and C can also be specified in the format AxS, where S is the number of sets of A to go back, max 5 (each).
                       For example, "!avg 500x2" will return the last two intervals of 500 games, which is an average for games 1-500 and another for games 501-1000.
    - !n
      !nyan:           Returns the last time there was a nyan, which is a bust >= 1000.00.
    - !getnyan:        Returns the game identifier of the last nyan and provides a link to view the game in which it occurred.
    - !help:           Provides a link to this script in github for review of these comments.
    - !helpline:       Provides information about the National Problem Gambling Helpline.
    - !donate
      !tip:            Provides information for monetary thanks for running the script.  (If you are running your own copy of the script, you may want to replace the address with your own.)
    
    Mentioning the name of the account running this script in chat will trigger a snarky response.
    
    The following commands can be called by the account running this script:
    - !stop:           This will stop the script and provide feedback in the chat.  (This is to alert players that the script is shutting down.)
    - !seednyan N:     If the script has not seen a nyan yet, you can manually seed the nyan game identifier (N) using this command.
*/

engine.on('msg', function(data) {
    if (data.message) {
        if (data.username == scriptUsername) {
            if (data.message == "!stop") {
                engine.chat("Script shutting down.");
                engine.stop();
            }
            else if (data.message.startsWith("!seednyan")) {
                nyan = parseInt(data.message.substring(10));
            }
        }
        if (data.message == "!help") {
            engine.chat("You can find the script I'm running with instructions on how to call it here:  https://github.com/CoreCompetency/RaiGamesScripts/blob/master/StatsBot.js");
        }
        else if (data.message == "!helpline") {
            engine.chat("National Gambling Helpline: 1-800-522-4700.  Available 24/7/365 and 100% confidential.  Call or text today!");
        }
        else if (data.message == "!donate") {
            engine.chat("Donations can be sent to xrb_3hxmcttfudkmb9b5wj7tix88img9yxe555x45ejuppz8xf56yttgama3nydz or transferred to this account. Thanks!");
        }
        else if (data.message == "!tip") {
            engine.chat("Tips can be transferred to this account or sent to xrb_3hxmcttfudkmb9b5wj7tix88img9yxe555x45ejuppz8xf56yttgama3nydz. Thanks!");
        }
        else if (data.message == "!n" || data.message == "!nyan") {
            if (nyan) {
                engine.chat("Yeah, I saw nyan around here. It was around " + (game - nyan) + " games ago." + ". Who's askin'?");
            }
            else {
                engine.chat("Nobody here but us chickens.");
            }
        }
        else if (data.message == "!getnyan") {
           engine.chat("Last nyan was in game " + nyan + ". View the game here: https://raigames.io/game/" + nyan);
        }
        else if (hash && (data.message.startsWith("!med") || data.message.startsWith("!avg")))
        {
            var message = data.message;
            var maxLength = 0;
            
            /* Check input. */
            var lengths = message.substring(4).split(" ").filter(function(i) { return i });
            if (lengths.length == 0) {
                lengths.push("100");
            }
            else if (lengths.length > 3) {
                engine.chat("Please limit to three arguments in one request.");
                return;
            }
            
            /* Check for invalid arguments. */
            for (var ii = 0; ii < lengths.length; ii++) {
                var text = lengths[ii];
                var length = parseInt(text);
                if (isNaN(length)) { /* Check for NaN. */
                    engine.chat("Wrong format: " + text);
                    return;
                }
                else if (length < 1 || length > 1000) {
                    engine.chat("Please target a number of games between 1 and 1000: " + text);
                    return;
                }
                else if (text.indexOf("x") > 0) {
                    var parts = text.split("x");
                    if (parts.length < 2) {
                        engine.chat("Wrong format: " + text);
                        return;
                    }
                    else {
                        var sets = parseInt(parts[1]);
                        if (isNaN(sets)) {
                            engine.chat("Wrong format: " + text);
                            return;
                        }
                        else if (sets < 0 || sets > 5) {
                            engine.chat("Please target no more than 5 sets: " + text);
                            return;
                        }
                        else if ((length * sets) > maxLength) {
                            maxLength = length * sets;
                        }
                    }
                }
                else {
                    if (length > maxLength) {
                        maxLength = length;
                    }
                }
            }
            
            /* Get data. */
            var games = [];
            
            var lastHash = "";
            for (var ii = 0; ii < maxLength; ii++) {
                var gameHash = (lastHash != "" ? genGameHash(lastHash) : hash);
                var gameCrash = crashPointFromHash(lastHash != "" ? genGameHash(lastHash) : hash);
                games.push(gameCrash);
                lastHash = gameHash;
            }
            
            /* Process request. */
            var results = [];
            var response = "";
            
            for (var ii = 0; ii < lengths.length; ii++) {
                var text = lengths[ii];
                response += text + " ";
                var length = parseInt(text);

                var sets = 1;
                if (lengths[ii].indexOf("x") > 1) {
                    sets = parseInt(lengths[ii].split("x")[1]);
                }
                
                var result = "";
                for (var jj = 0; jj < sets; jj++) {
                    if (message.startsWith("!med")) {
                        result += med(games, length*jj, length);
                    }
                    else if (message.startsWith("!avg")) {
                        result += avg(games, length*jj, length);
                    }
                    result += ", ";
                }
                result = result.substring(0, result.length - 2); /* Trim final comma. */
                results.push(result);
            }
            
            /* Print result. */
            var response = response.trim() + ":";
            for (var ii = 0; ii < results.length; ii++) {
                response += " " + results[ii] + "; ";
            }
            response = response.substring(0, response.length - 2); /* Trim final semicolon. */
            engine.chat(response);
        }
        else if (data.message.toLowerCase().indexOf(scriptUsername.toLowerCase()) >= 0) {
            snark();
        }
    }
});

function med(games, start, length) {
    var local = games.slice(start, start + length);
    local.sort(function(a, b) { return a - b });

    var point = Math.floor(length / 2);
    if (length % 2) { /* Exact median. */
        return games[point] + "x";
    }
    else {
        var avg = (parseFloat(local[point - 1]) + parseFloat(local[point])) / 2.0;
        return avg.toFixed(2) + "x";
    }
}

function avg(games, start, length) {
    var sum = 0;
    for (var ii = start; ii < start + length; ii++) {
        sum += parseFloat(games[ii]);
    }
    return (sum / length).toFixed(2) + "x";
}

function genGameHash(serverSeed) {
    return CryptoJS.SHA256(serverSeed).toString();
};

function crashPointFromHash(serverSeed) {
    var hash = hmac(serverSeed, '000000000000000007a9a31ff7f07463d91af6b5454241d5faf282e5e0fe1b3a');

    /* In 1 of 101 games the game crashes instantly. */
    if (divisible(hash, 101)) {
        return 0;
    }

    /* Use the most significant 52-bit from the hash to calculate the crash point. */
    var h = parseInt(hash.slice(0,52/4),16);
    var e = Math.pow(2,52);
    return (Math.floor((100 * e - h) / (e - h))/100).toFixed(2);
};

function hmac(key, v) {
    var hmacHasher = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, key);
    return hmacHasher.finalize(v).toString();
}

function divisible(hash, mod) {
    var val = 0;
    var o = hash.length % 4;
    for (var i = o > 0 ? o - 4 : 0; i < hash.length; i += 4) {
        val = ((val << 16) + parseInt(hash.substring(i, i+4), 16)) % mod;
    }
}

function loadScript(url){
    var script = document.createElement("script")
    script.type = "text/javascript";

    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
}

loadScript("https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/components/core.js");
loadScript("https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/components/sha256.js");
loadScript("https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/components/hmac.js");

var hash;
var nyan;
var game;
engine.on('game_crash', function(data) {
    if (!hash) {
        engine.chat("Script ready.  Ask me anything.");
    }
    hash = data.hash;
    if (data.game_crash >= 100000) {
        nyan = game;
    }
});
engine.on('game_starting', function(data) {
    game = data.game_id;
});

if (!String.prototype.startsWith) {
    String.prototype.startsWith = function(searchString, position) {
        position = position || 0;
        return this.indexOf(searchString, position) === position;
    };
}

var scriptUsername = engine.getUsername();


var snarks = [];
snarks.push("National Gambling Helpline: 1-800-522-4700.  Available 24/7/365 and 100% confidential.  Call or text today!");
snarks.push("Don't sass me.");
snarks.push("You've got to ask yourself one question: do I feel lucky? Well do ya, punk?");
snarks.push("There's no shame in my robot game.");
snarks.push("Hey, I'm workin' here!");
snarks.push("everbody to the limit, everybody to the limit, everbody come on fhqwhgads");
snarks.push("♫ Don't stop believin' ♫ Hold on to that feelin' ♫");
snarks.push("bitconneeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeccccct");
snarks.push("Gotta catch 'em all!");
snarks.push("Shiny");
snarks.push("For the Horde!");
snarks.push("It's over, Anakin!  I have the high ground.");
snarks.push("I wanna be the very best, like no one ever was!");
snarks.push("A dream is a wish your heart makes.");
snarks.push("GNU Terry Pratchett");
snarks.push("In the name of the moon, I will punish you!");
snarks.push("Silence, Earthling! My name is Darth Vader. I am an extra-terrestrial from the planet Vulcan!");
snarks.push("Where we're going, we don't need roads.");
snarks.push("The flower that blooms in adversity is the most rare and beautiful of them all.");
snarks.push("In the beginning the Universe was created. This has made a lot of people very angry and been widely regarded as a bad move.");
snarks.push("I don't know half of you half as well as I should like; and I like less than half of you half as well as you deserve.");
snarks.push("Life is a co-op game.");
snarks.push("F*ck! Even in the future nothing works.");
snarks.push("Go home. Feed your dog. Meet your kids.");
function snark() {
    var index = Math.floor(Math.random() * snarks.length);
    engine.chat(snarks[index]);
}