/*==================================
    This is a customizable script that can be run for gambling on RaiGames.io.
    Be aware that RaiGames.io is a casino and the expected value of any gambling there is negative:  you are expected to lose money.
    None of the example strategies in this script are expected to win money.  They are intended solely to demonstrate the functionality of this script.
    Use the Test Framework to test this script before enabling live betting:  https://github.com/CoreCompetency/RaiGamesScripts/blob/master/TestFramework.js

    ================================
     COMMANDS
    ================================

    The following commands can be used in chat as long as you are logged in as the user running the script:

        -stop                      This will immediately stop all betting.
        -reserve                   This will return the current reserve funds amount.
        -reserve:#                 This will immediately update the reserve funds amount.

    ================================
     VARIABLES
    ================================

    The variables in this section should be modified to meet your gambling needs.  They are described below:
    - reserve:                    This is the mXRB amount of your balance to ignore at all times.
                                      This amount will never be bet, nor will it appear in calculations.  The script will not see this reserve at all.
    - sting:                      The bets to make and the situations in which to make them.
                                      These are in priority order; the first one encountered will be the one that activates.
        bet:                      The amount in mXRB to bet when the entry activates.
        cashout:                  The cashout to use when the entry activates.
        check:                    The number of games to check.
        min:                      The number of checked games that must be green for this entry to activate.
        green:                    The minimum bust value to be considered green.

    ================================
     IMPORTANT SCRIPT INFORMATION
    ================================

    This custom script was created by CoreCompetency.  Custom scripts can be ordered here:  http://www.workfornano.com/jobs/programming-tech/raigames-script/
    For public scripts, check here:  https://github.com/CoreCompetency/RaiGamesScripts
    A script for sound alerts can be found at the above link and pasted into this script to enable sound alerts on wins, losses, and chat mentions.
    This script is released to the public domain under The Unlicense:  https://choosealicense.com/licenses/unlicense/
===================================*/

/*==================================
 Settings
===================================*/

var reserve = 0;
var sting = [
    { bet: 800, cashout: 1.25, check: 3500, min: 1900, green: 1.98 },
    { bet: 500, cashout:  1.5, check:  500, min:  400, green: 1.98 }
];

/*=====================================================================================================================
 The actual script.  Do not change unless you know what you're doing.
=====================================================================================================================*/

loadScript("https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/components/core.js");
loadScript("https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/components/sha256.js");
loadScript("https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/components/hmac.js");

if (!checkVariables()) {
    /* Stop at the next opportunity. */
    ["game_starting", "game_started", "game_crash", "player_cashout", "msg"].forEach(function(event) {
        engine.on(event, engine.stop);
    });
}
else {
    console.log("Script running. Current balance: " + getBalance());

    var tracking = {
        startingBalance: getBalance(),
        history: []
    };
    
    engine.on("msg", function(data) {
        if (data.message) {
            var message = data.message.toLowerCase();
            if (data.username == engine.getUsername()) {
                if (message == "-stop") {
                    stop("-stop applied");
                    engine.chat("Script stopped.");
                }
                else if (message == "-reserve") {
                    engine.chat("[Reserved Funds] " + (reserve || "none"));
                }
                else if (message == "-reserve:null") {
                    reserve = null;
                    engine.chat("[Reserved Funds] none");
                }
                else if (message.startsWith("-reserve:")) {
                    var update = parseFloat(message.substring(9));
                    if (update < 0 || round(update, false) != update) {
                        engine.chat("Reserve must be at least 0 and have no more than two digits past the decimal. Use null to disable.");
                    }
                    else {
                        reserve = update;
                        engine.chat("[Reserved Funds] " + reserve);
                    }
                }
            }
        }
    });
    
    /* Find the maximum number of games we need to track. */
    tracking.max = sting[0].check;
    for (var ii = 1; ii < sting.length; ii++) {
        var entry = sting[ii];
        if (entry.check > tracking.max) {
            tracking.max = entry.check;
        }
    }
    
    /* Give external resources a chance to load. */
    pause().then(() => {
        seedHistory();
        seedHistory(); /* Catch the games we missed while doing this the first time. */
    
        engine.on("game_starting", function(info) {
            var current = getBet();
            if (current) {
                if (getBalance() < current.bet) {
                    stop("out of money");
                    return;
                }

                console.log(">Betting " + current.bet + " at " + current.cashout + "x; balance: " + getBalance());
                engine.placeBet(round(current.bet * 100, true), round(current.cashout * 100, true));
                tracking.playing = true;
            }
        });

        engine.on("game_crash", function(data) {
            seedHistory(); /* Track current game. */
            if (tracking.playing) {
                log(engine.lastGamePlay(), data.game_crash / 100.0);
                tracking.playing = false;
            }
        });
    });
}

/*==================================
 Helper functions.
===================================*/

function loadScript(url) {
    var script = document.createElement("script")
    script.type = "text/javascript";

    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
}

function pause() {
    return new Promise(resolve => setTimeout(resolve, 300));
}

function getBalance() {
    var balance = engine.getBalance() / 100.0;
    return round(Math.max(balance - (reserve || 0), 0), false); /* Ignore the reserve, but can't have a negative balance. */
}

function round(value, whole) {
    if (whole) {
        return Math.round(value);
    }
    return Math.round(value * 100.0) / 100.0;
}

function log(result, bust) {
    var info = result + " [" + bust + "x]";
    console.log(info);
}

function stop(message) {
    var info = "Stopping script";
    if (message) {
        info += ": " + message;
    }
    console.log(info);
    console.log("BALANCE: " + tracking.startingBalance + " (start) => " + getBalance() + " (end)");
    engine.stop();
}

function seedHistory() {
    var hist = engine.getEngine().tableHistory;
    var entries = [];

    if (tracking.history.length == 0) {
        var start = hist[0];
        entries.push({
            id: start.game_id,
            bust: start.game_crash / 100.0
        });
        var lastHash = start.hash;

        for (var ii = 0; ii < tracking.max - 1; ii++) {
            var gameHash = genGameHash(lastHash);
            var gameCrash = crashPointFromHash(gameHash);

            entries.push({
                id: entries[entries.length - 1].id - 1,
                bust: gameCrash
            });

            lastHash = gameHash;
        }
    }
    else {
        var latest = tracking.history[tracking.history.length - 1].id;
        var index = 0;
        var game = hist[index];
        while (game.game_id > latest) {
            entries.push({
                id: game.game_id,
                bust: game.game_crash / 100.0
            });
            game = hist[++index];
        }
    }

    tracking.history = tracking.history.concat(entries.reverse());
    if (tracking.history.length > tracking.max) {
        /* Only track as many as we need. */
        tracking.history = tracking.history.slice(tracking.history.length - tracking.max);
    };
}

function getBet() {
    for (var ii = 0; ii < sting.length; ii++) {
        var entry = sting[ii];
        var count = 0;
        for (var jj = tracking.history.length - 1; jj >= tracking.history.length - entry.check; jj--) {
            if (tracking.history[jj].bust >= entry.green) {
                count++;
                if (count >= entry.min) {
                    return { bet: entry.bet, cashout: entry.cashout };
                }
            }
        }
    }
    return null;
}

/*==================================
 Data creation.
===================================*/

function genGameHash(serverSeed) {
    return CryptoJS.SHA256(serverSeed).toString();
};

function crashPointFromHash(serverSeed) {
    var hash = hmac(serverSeed, "000000000000000007a9a31ff7f07463d91af6b5454241d5faf282e5e0fe1b3a");

    /* In 1 of 101 games the game crashes instantly. */
    if (divisible(hash, 101)) {
        return 0;
    }

    /* Use the most significant 52-bit from the hash to calculate the crash point. */
    var h = parseInt(hash.slice(0, 52 / 4), 16);
    var e = Math.pow(2, 52);
    return (Math.floor((100 * e - h) / (e - h)) / 100).toFixed(2);
};

function hmac(key, v) {
    var hmacHasher = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, key);
    return hmacHasher.finalize(v).toString();
}

function divisible(hash, mod) {
    var val = 0;
    var o = hash.length % 4;
    for (var i = o > 0 ? o - 4 : 0; i < hash.length; i += 4) {
        val = ((val << 16) + parseInt(hash.substring(i, i + 4), 16)) % mod;
    }
    return val === 0;
}

/*==================================
 Startup check.
===================================*/

function checkVariables() {
    var errors = false;

    /* General. */

    if (reserve != null && (reserve < 0 || round(reserve) != reserve)) {
        console.error("reserve must be at least 0 and have no more than two digits past the decimal. Use null to disable.");
        errors = true;
    }

    /* Scorpion mode. */

    if (sting.length < 1) {
        console.error("Must have at least one entry to sting.");
        errors = true;
    }
    else {
        for (var ii = 0; ii < sting.length; ii++) {
            var entry = sting[ii];
            if (entry.bet < 1 || round(entry.bet, true) != entry.bet) {
                console.error("sting[" + ii + "].bet must be positive and whole.");
                errors = true;
            }
            else if (entry.bet > getBalance()) {
                console.error("sting[" + ii + "].bet is higher than your current balance.");
                errors = true;
            }
            if (entry.cashout < 1 || round(entry.cashout, false) != entry.cashout) {
                console.error("sting[" + ii + "].bet must be at least 1 and have no more than two digits past the decimal.");
                errors = true;
            }
            if (entry.check < 1 || round(entry.check, true) != entry.check) {
                console.error("sting[" + ii + "].check must be positive and whole.");
                errors = true;
            }
            if (entry.min < 1 || round(entry.min, true) != entry.min || entry.min > entry.check) {
                console.error("sting[" + ii + "].min must be positive, whole, and no higher than sting[" + ii + "].check.");
                errors = true;
            }
            if (entry.green < 1 || round(entry.green, false) != entry.green) {
                console.error("sting[" + ii + "].green must be at least 1 and have no more than two digits past the decimal.");
                errors = true;
            }
        }
    }

    if (errors) {
        console.error("Please fix script and try again.");
    }
    return !errors;
}

/*==================================
 Functions for IE.
===================================*/

if (!String.prototype.startsWith) {
    String.prototype.startsWith = function (searchString, position) {
        position = position || 0;
        return this.indexOf(searchString, position) === position;
    };
}