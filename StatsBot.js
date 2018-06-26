/*==================================
This is a script that can be run on RaiGames.io to provide stats based on chat prompts.
The commands that this script supports can be found on its wiki page:  https://github.com/CoreCompetency/RaiGamesScripts/wiki/StatsBot-Commands

In addition to the public commands found on the wiki, the following commands can be called by the account running this script:
- !stop:          This will stop the script and provide feedback in the chat.  (This is to alert players that the script is shutting down.)
                  This will also trigger in-memory games to get stored to localStorage for the next run.
- !clearhistory:  This will clear games from localStorage.  It should be used if something gets messed up.
                  This will also trigger the script to stop so that the next run can fill localStorage again.

Mentioning the name of the account running this script in chat will trigger a snarky response.
Mentioning the name of the original RaiGames.io bot (Shiba) will also trigger a (different) snarky response.
===================================*/

/*==================================
 External resources.
===================================*/

loadScript("https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/components/core.js");
loadScript("https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/components/sha256.js");
loadScript("https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/components/hmac.js");

/* Let the resources load before continuing. */
var loaded = false;
pause(300).then(() => loaded = true);

/*==================================
 Request management.
===================================*/

var _ignore = [
    "!kill", /* Joking313 scripts. */
    "!cashout", "!stop", "!stopafterwin", "!chase.start", "!chase.stop", /* CustomizableBot. */
    "!sounds.win:on", "!sounds.win:off", "!sounds.lose:on", "!sounds.lose:off", "!sounds.mention:on", "!sounds.mention:off", /* SoundAlerts. */
    "!mute", "!pattern", "!count", /* LivS commands. */
    "!blck", "!blk", "!bl", "!bst",  "!bt", "!conver", "!conv", "!cv", "!c", "!scam", "!h", "!faq", "!lck", "!lic", "!lik", "!lk", /*"!n",*/ "!ny", "!na", "!nn", "!nya", "!nyn", "!nan", /*"!med", "!prb",*/ "!pob", "!pb", /*"!p",*/ "!prfit", "!profi", "!prof", "!prft", "!prf", "!prt", "!sen", "!sn", /*"!s",*/ "!w", "!wager", "!wagerd", "!wagr", "!wagrd", "!wagred", "!wd", "!wg", "!wgd", "!wger", "!wgerd", "!wgr", "!wgrd", "!wgred", "!wagered", /* Shiba commands. */
    "!ignore" /* General chat. */
];
engine.on("msg", function (data) {
    if (data.message) {
        var channel = data.channelName;
        try {
            /* Easier for downstream processing to do all this in one place. */
            var message = data.message.toLowerCase()
                                      .replace(_regex.charFilter, "");

            if (data.username == _scriptUsername) {
                if (message == "!stop") {
                    cacheResults();
                    say("spam", "Script shutting down.");
                    engine.stop();
                    return;
                }
                else if (message == "!clearhistory") {
                    clearCachedResults();
                    say("spam", "Script shutting down.");
                    engine.stop();
                    return;
                }
            }

            var options = { details: false };
            var index = message.indexOf("!details");
            if (index > -1) {
                options.details = true;
                message = message.replace("!details", "");
            }
            index = message.indexOf("!detail");
            if (index > -1) {
                options.details = true;
                message = message.replace("!detail", "");
            }
            index = message.indexOf("!dtl");
            if (index > -1) {
                options.details = true;
                message = message.replace("!dtl", "");
            }
            
            if (channel == "english") {
                return;
            }            
            
            if (message == "!help") {
                say(channel, "Check out my wiki page for all of my commands:  https://github.com/CoreCompetency/RaiGamesScripts/wiki/StatsBot-Commands");
                say(channel, "If you'd like to report a bug or submit a feature request, you can do so here:  https://github.com/CoreCompetency/RaiGamesScripts/issues/new");
            }
            else if (message == "!helpline") {
                say(channel, "National Gambling Helpline: 1-800-522-4700. Available 24/7/365 and 100% confidential. Call or text today!");
            }
            else if (message == "!donate") {
                say(channel, "Donations can be sent to xrb_3hxmcttfudkmb9b5wj7tix88img9yxe555x45ejuppz8xf56yttgama3nydz or transferred to this account. Thanks!");
            }
            else if (message == "!tip") {
                say(channel, "Tips can be transferred to this account or sent to xrb_3hxmcttfudkmb9b5wj7tix88img9yxe555x45ejuppz8xf56yttgama3nydz. Thanks!");
            }
            else if (message == "!script" || message == "!scripts") {
                say(channel, "Commonly-used, scripted strategies can be found here: https://github.com/Joking313/Scripts");
                say(channel, "If you'd like to create and test your own strategy, you can use this customizable script: https://github.com/CoreCompetency/RaiGamesScripts/blob/master/CustomizableBot.js");
                say(channel, "You can also use this test framework to test any other script: https://github.com/CoreCompetency/RaiGamesScripts/blob/master/TestFramework.js");
                say(channel, "Remember that no script or strategy is expected to make money over time. If you feel yourself becoming addicted to gambling, use the !helpline command to get the National Gambling Helpline phone number.");
            }
            else if (data.username != _scriptUsername && message.indexOf(_scriptUsername.toLowerCase()) > -1) {
                snark(channel);
            }
            /*else if (data.username != _scriptUsername && message.indexOf("shiba") > -1) {
                shibaSnark(channel);
            }*/
            else if (_ignore.indexOf(message.split(" ")[0]) > -1) {
                return;
            }
            else if ((message.startsWith("!prb") || message.startsWith("!prob")) && message.indexOf("[") > -1) {
                customProb(channel, message, options);
            }
            else if (message.startsWith("!prb joking125") || message.startsWith("!prob joking125") || message.startsWith("!probability joking125")) {
                processJoking(channel, message, jokingProbability125);
            }
            else if (message.startsWith("!prb joking4") || message.startsWith("!prob joking4") || message.startsWith("!probability joking4")) {
                processJoking(channel, message, jokingProbability4);
            }
            else if (message.startsWith("!prb") || message.startsWith("!prob") || message.startsWith("!probability")) {
                processByBust(channel, message, probability, options);
            }
            else if (!message.startsWith("!st") && (message.startsWith("!s") || message.startsWith("!seen"))) { /* Checking for !st to make sure that this doesn't override !streak. */
                seen(channel, message, data.message);
            }
            else if (!_caughtUp) {
                /* Script isn't ready to respond to the requests below yet. */
                return;
            }
            else if (message == "!n" || message == "!nyan") {
                var nyan = getNyanMessage();
                say(channel, nyan);
            }
            else if (message.startsWith("!n") || message.startsWith("!nyan")) {
                nyanToBust(channel, message, options);
            }
            else if (message.startsWith("!med") || message.startsWith("!median")) {
                processByLength(channel, message, median);
            }
            else if (message.startsWith("!mean") || message.startsWith("!avg") || message.startsWith("!average")) {
                processByLength(channel, message, average);
            }
            else if (message.startsWith("!mode")) {
                processByLength(channel, message, mode);
            }
            else if (message.startsWith("!min") || message.startsWith("!minimum")) {
                processByLength(channel, message, min);
            }
            else if (message.startsWith("!max") || message.startsWith("!maximum")) {
                processByLength(channel, message, max);
            }
            else if ((message.startsWith("!bst") || message.startsWith("!bust")) && message.indexOf("[") > -1) {
                customBust(channel, message, options);
            }
            else if (message.startsWith("!bst joking125x") || message.startsWith("!bust joking125x")) {
                processJoking(channel, "!bust joking125 5x" + message.substring(message.indexOf("x") + 1), jokingBust125, options);
            }
            else if (message.startsWith("!bst joking4x") || message.startsWith("!bust joking4x")) {
                processJoking(channel, "!bust joking4 5x" + message.substring(message.indexOf("x") + 1), jokingBust4, options);
            }
            else if (message.startsWith("!gap joking125x")) {
                processJoking(channel, "!gap joking125 5x" + message.substring(message.indexOf("x") + 1), jokingGap125, options);
            }
            else if (message.startsWith("!gap joking4x")) {
                processJoking(channel, "!gap joking4 5x" + message.substring(message.indexOf("x") + 1), jokingGap4, options);
            }
            else if (message.startsWith("!bst joking125") || message.startsWith("!bust joking125")) {
                processJoking(channel, message, jokingBust125, options);
            }
            else if (message.startsWith("!bst joking4") || message.startsWith("!bust joking4")) {
                processJoking(channel, message, jokingBust4, options);
            }
            else if (message.startsWith("!gap joking125")) {
                processJoking(channel, message, jokingGap125, options);
            }
            else if (message.startsWith("!gap joking4")) {
                processJoking(channel, message, jokingGap4, options);
            }
            else if (message.startsWith("!bst") || message.startsWith("!bust")) {
                processByBust(channel, message, bust, options);
            }
            else if (message.startsWith("!gapmax")) {
                processByBust(channel, message, gapMax, options);
            }
            else if (message.startsWith("!gap")) {
                processByBust(channel, message, gap, options);
            }
            else if (message.startsWith("!streak")) {
                processByBust(channel, message, streak, options);
            }
            else if (message.startsWith("!") && message.length > 1 && !isNaN(message[1]) && !isNaN(parseInt(message[1]))) {
                processByBust(channel, "!bust " + message.substring(1), bust, options);
            }
            else if (message.startsWith("![")) {
                customBust(channel, "!bust " + message.substring(1), options);
            }
            else if (message.startsWith("!joking125x")) {
                processJoking(channel, "!bust joking125 5x" + message.substring(message.indexOf("x") + 1), jokingBust125, options);
            }
            else if (message.startsWith("!joking4x")) {
                processJoking(channel, "!bust joking4 5x" + message.substring(message.indexOf("x") + 1), jokingBust4, options);
            }
            else if (message.startsWith("!joking125")) {
                processJoking(channel, "!bust " + message.substring(1), jokingBust125, options);
            }
            else if (message.startsWith("!joking4")) {
                processJoking(channel, "!bust " + message.substring(1), jokingBust4, options);
            }
            else if (message.startsWith("!")) {
                say(channel, "I don't know that command. Use !help to view the commands I know or to submit a feature request.");
            }
        }
        catch (err) {
            console.error(err);
            say(channel, "Oops, I did me a heckin' error!");
        }
    }
});

/*==================================
 Request processing.
===================================*/

function processByLength(channel, message, action) {
    /* Get the lengths that come after the command. */
    var lengths = message.match(_regex.lengthArgs);
    lengths = lengths.slice(1);

    /* Check input. */
    if (lengths.length == 0) {
        /* This is probably of the most interest to the most people. */
        lengths.push("100");
        lengths.push("500");
        lengths.push("1000");
    }
    else if (lengths.length > 10) {
        say(channel, "Please limit to 10 arguments.");
        return;
    }

    /* Clear duplicates. */
    lengths = unique(lengths);

    /* Check for invalid arguments. */
    for (var ii = 0; ii < lengths.length; ii++) {
        var text = lengths[ii];
        var match = _regex.length.exec(text);
        if (!match) {
            say(channel, "Wrong format: " + text);
            return;
        }
        else {
            var length = match.groups["length"];
            var parsed = parseInt(length);
            if (isNaN(parsed)) {
                if (length == "all") {
                    lengths[ii] = _games.length.toString();
                }
                else {
                    say(channel, "Wrong format: " + text);
                    return;
                }
            }
            else if (parsed > _games.length) {
                lengths[ii] = _games.length.toString();
            }
            else if (parsed < 1) {
                say(channel, "Please target at least 1 game: " + text);
                return;
            }
            else {
                var sets = parseInt(match.groups["sets"]);
                if (sets != null && sets < 1) {
                    say(channel, "Please target at least 1 set: " + text);
                    return;
                }
            }
        }
    }

    /* Clear duplicates again (in case there was more than argument that changed into _games.length). */
    lengths = unique(lengths);

    /* Process request. */
    var results = [];
    var response = "";

    for (var ii = 0; ii < lengths.length; ii++) {
        var text = lengths[ii];
        response += text + " ";

        var match = _regex.length.exec(text);
        var length = parseInt(match.groups["length"]);
        var sets = parseInt(match.groups["sets"]) || 1;

        var result = "";
        for (var jj = 0; jj < sets; jj++) {
            result += action(length * jj, length);
            result += ", ";
        }
        result = result.substring(0, result.length - 2); /* Trim final comma. */
        results.push(result);
    }

    /* Print result. */
    response = response.trim() + ":";
    for (var ii = 0; ii < results.length; ii++) {
        response += " " + results[ii] + "; ";
    }
    response = response.substring(0, response.length - 2); /* Trim final semicolon. */
    say(channel, response);
}

function processByBust(channel, message, action, options) {
    /* Get the cashouts that come after the command. */
    var cashouts = message.match(_regex.bustArgs);
    cashouts = cashouts.slice(1);

    /* Check input. */
    if (cashouts.length == 0) {
        /* This is probably of the most interest to the most people. */
        cashouts.push("2");
        cashouts.push("0");
        cashouts.push("100");
        cashouts.push("nyan");
    }
    else if (cashouts.length > 4) {
        say(channel, "Please limit to 4 arguments.");
        return;
    }

    /* Clear duplicates. */
    cashouts = unique(cashouts);

    /* Check for invalid arguments. */
    for (var ii = 0; ii < cashouts.length; ii++) {
        var text = cashouts[ii];
        var match = _regex.bust.exec(text);
        if (!match) {
            say(channel, "Wrong format: " + text);
            return;
        }
        else {
            var cashout = match.groups["bust"];
            var parsed = parseFloat(cashout);
            if (isNaN(parsed)) {
                if (cashout == "n" || cashout == "nyan") {
                    cashouts[ii] = cashouts[ii].replace(cashout, "1000");
                }
                else {
                    say(channel, "Wrong format: " + text);
                    return;
                }
            }
            else if (parsed < 1 && (parsed != 0 || below)) { /* 0x is a special case. */
                say(channel, "Please target a cashout of at least 1: " + text);
                return;
            }
            else {
                var streak = parseInt(match.groups["streak"]);
                if (streak != null && streak < 1) {
                    say(channel, "Please target a streak of at least 1: " + text);
                    return;
                }
            }
        }
    }

    /* Clear duplicates again (in case there was more than argument that changed into 1000). */
    cashouts = unique(cashouts);

    /* Process request. */
    var results = [];
    var response = "";

    for (var ii = 0; ii < cashouts.length; ii++) {
        var text = cashouts[ii];
        response += text + " ";

        var match = _regex.bust.exec(text);
        var below = match.groups["below"];
        var cashout = parseFloat(match.groups["bust"]);
        var streak = parseInt(match.groups["streak"]);

        if (cashout == 0) { /* 0x is a special case. */
            below = true;
            cashout = 1;
        }
        results.push(action(below, cashout, streak, options)); /* Let the action interpret the streak. */
    }

    /* Print result. */
    response = response.trim() + ":";
    for (var ii = 0; ii < results.length; ii++) {
        response += " " + results[ii] + "; ";
    }
    response = response.substring(0, response.length - 2); /* Trim final semicolon. */
    say(channel, response);
}

function processJoking(channel, message, action, options) {
    /* Get the losses that come after the command. */
    var losses = message.split(" ").filter(function(ii) { return ii; });
    losses = losses.slice(2);

    /* Check input. */
    if (losses.length == 0) {
        /* Default to 5. */
        losses.push("5");
    }
    else if (losses.length > 4) {
        say(channel, "Please limit to 4 arguments.");
        return;
    }

    /* Clear duplicates. */
    losses = unique(losses);

    /* Check for invalid arguments. */
    for (var ii = 0; ii < losses.length; ii++) {
        var text = losses[ii];
        var parts = text.split("x");
        if (parts.length > 2) {
            say(channel, "Wrong format: " + text);
            return;
        }

        var loss = parseFloat(parts[0]);
        if (isNaN(parts[0])) { /* Check for NaN. */
            say(channel, "Wrong format: " + text);
            return;
        }
        else if (loss != Math.floor(loss) || loss < 3 || loss > 9) {
            say(channel, "Please target a loss streak between 3 and 9: " + text);
            return;
        }

        if (parts.length > 1) {
            var sets = parseFloat(parts[1]);

            if (isNaN(parts[0])) { /* Check for NaN. */
                say(channel, "Wrong format: " + text);
                return;
            }
            else if (sets != Math.floor(sets) || loss < 1) {
                say(channel, "Please target at least 1 set: " + text);
                return;
            }
        }
    }

    /* Process request. */
    var results = [];
    var response = "";

    for (var ii = 0; ii < losses.length; ii++) {
        var text = losses[ii];
        response += text + " ";
        results.push(action(text, options));
    }

    /* Print result. */
    response = response.trim() + ":";
    for (var ii = 0; ii < results.length; ii++) {
        response += " " + results[ii] + "; ";
    }
    response = response.substring(0, response.length - 2); /* Trim final semicolon. */
    say(channel, response);
}

/*==================================
 Nyan.
===================================*/

function getNyan() {
    if (!_nyan) {
        for (var ii = 0; ii < _games.length; ii++) {
            var current = _games[ii];
            if (current.bust >= 1000.00) {
                _nyan = {
                    id: current.id,
                    bust: current.bust
                };
                break;
            }
        }

        var cached = JSON.parse(localStorage.getItem("nyan"));
        if (cached && cached.id == _nyan.id) {
            _nyan.time = cached.time;
        }
    }
    return _nyan;
}

function getNyanMessage() {
    var nyan = getNyan();
    var message = "Yeah, I saw nyan around here. It was about " + (_game.id - nyan.id) + " games ago."
    if (nyan.time) {
        message += ". " + timeAgo(nyan.time) + ".";
    }
    message += " Came in at " + nyan.bust + "x. https://nanogames.io/game/" + nyan.id;
    return message;
}

function nyanToBust(channel, message, options) {
    var index = message.indexOf("nyan") > -1 ? 5 : 2;
    var arg = message.substring(index).trim();
    if (arg.indexOf(" ") > -1) {
        say(channel, "Wrong format: " + arg);
    }
    else {
        if (arg.startsWith("x") || arg.startsWith(":")) {
            arg = arg.substring(1);
        }
        if (isNaN(arg) || parseInt(arg) != arg || arg < 1) {
            say(channel, "Wrong format: " + arg);
        }
        else {
            processByBust(channel, "!bust nyanx" + arg, bust, options);
        }
    }
}

/*==================================
 Math calculations.
===================================*/

function median(start, length) {
    try {
        var local = _games.slice(start, start + length);
        local.sort(function (a, b) { return a.bust - b.bust; });

        var point = Math.floor(length / 2);
        if (length % 2) { /* Exact median. */
            return local[point].bust + "x";
        }
        else {
            var avg = (parseFloat(local[point - 1].bust) + parseFloat(local[point].bust)) / 2.0;
            return avg.toFixed(2) + "x";
        }
    }
    catch (err) {
        /* If an input comes in that takes us out of the bounds of the data available, return NaN. */
        return "NaN";
    }
}

function average(start, length) {
    try {
        var sum = 0;
        for (var ii = start; ii < start + length; ii++) {
            sum += parseFloat(_games[ii].bust);
        }
        return (sum / length).toFixed(2) + "x";
    }
    catch (err) {
        /* If an input comes in that takes us out of the bounds of the data available, return NaN. */
        return "NaN";
    }
}

function mode(start, length) {
    try {
        var modeMap = {};
        var maxEl = [_games[0].bust];
        var maxCount = 1;

        for (var ii = start; ii < start + length; ii++) {
            var el = _games[ii].bust;

            if (modeMap[el] == null)
                modeMap[el] = 1;
            else
                modeMap[el]++;

            if (modeMap[el] > maxCount) {
                maxEl = [el];
                maxCount = modeMap[el];
            }
            else if (modeMap[el] == maxCount) {
                maxEl.push(el);
            }
        }

        maxEl.sort(function (a, b) { return a - b; });

        var result = maxEl[0] + "x";
        for (var ii = 1; ii < maxEl.length; ii++) {
            result += "|" + maxEl[ii] + "x";
        }
        return result + " (" + maxCount + " times)";
    }
    catch (err) {
        /* If an input comes in that takes us out of the bounds of the data available, return NaN. */
        return "NaN";
    }
}

function min(start, length) {
    try {
        var found;
        for (var ii = start; ii < start + length; ii++) {
            var game = _games[ii];
            if (found == null) {
                found = game;
            }
            else if (parseFloat(game.bust) < parseFloat(found.bust)) {
                found = game;
            }
        }
        return found.bust + "x (game " + found.id + ")";
    }
    catch (err) {
        /* If an input comes in that takes us out of the bounds of the data available, return NaN. */
        return "NaN";
    }
}

function max(start, length) {
    try {
        var found;
        for (var ii = start; ii < start + length; ii++) {
            var game = _games[ii];
            if (found == null) {
                found = game;
            }
            else if (parseFloat(game.bust) > parseFloat(found.bust)) {
                found = game;
            }
        }
        return found.bust + "x (game " + found.id + ")";
    }
    catch (err) {
        /* If an input comes in that takes us out of the bounds of the data available, return NaN. */
        return "NaN";
    }
}

function probability(below, cashout, streak, options) {
    var p = prob(cashout);

    /* Check for inversion. */
    if (below) {
        p = 100 - p;
    }

    /* Check for streak. */
    if (streak) {
        p = Math.pow(p / 100.0, streak) * 100.0;
    }

    return "~" + round(p, 3) + "%";
}

/*==================================
 Aliases for the interesting stuff.
===================================*/

function bust(below, cashout, streak, options) {
    options.details = true;
    return findCustomBust([cashout], streak, options, below);
}

function gap(below, cashout, sets, options) {
    return findCustomGap([cashout], sets, options, below);
}

/*==================================
 The interesting stuff.
===================================*/

function streak(below, cashout, streak, options) {
    var found = [];
    var check = [];
    for (var ii = 0; ii < _games.length; ii++) {
        var game = _games[ii];
        if ((below && game.bust < cashout) || (!below && game.bust >= cashout)) {
            check.push(game);
            if (streak && check.length >= streak) {
                found = check;
                break;
            }
        }
        else {
            if (check.length > found.length) {
                found = check;
            }

            /* Clear what we're tracking. */
            check = [];
        }
    }
    if (check.length > found.length) {
        /* Should only happen if we are checking a never-ending streak. */
        found = check;
    }

    /* Start from the first game. */
    found.reverse();

    /* List all the games. */
    var print = (found.length > 120 ? 120 : found.length); /* Won't be able to print this many anyway. */
    var result = "";
    for (var ii = 0; ii < print; ii++) {
        if (result) {
            result += ", ";
        }
        result += found[ii].bust + "x";
    }

    /* Report back. */
    if (streak && found.length >= streak) {
        var games = _game.id - found[found.length - 1].id;
        result = "seen " + pluralize(games, "game") + " ago" + (options.details ? " (" + result + ")" : "");
        return result;
    }
    else if (!streak) {
        var games = _game.id - found[found.length - 1].id;
        result = "seen " + found.length + " streak " + pluralize(games, "game") + " ago" + (options.details ? " (" + result + ")" : "");
        return result;
    }
    else {
        return "never seen";
    }
}

function jokingProbability125(losses) {
    if (losses.indexOf("x") > -1) {
        return "wrong format";
    }

    var p108 = (100 - prob(1.08)) / 100.0;
    var p125 = (100 - prob(1.25)) / 100.0;
    var p = p108 * Math.pow(p125, losses - 1);
    return "bust~" + round(p * 100.0, 5) + "%";
}

function jokingProbability4(losses) {
    if (losses.indexOf("x") > -1) {
        return "wrong format";
    }

    var p108 = (100 - prob(1.08)) / 100.0;
    var p125 = (100 - prob(1.25)) / 100.0;
    var p131 = (100 - prob(1.31)) / 100.0;
    var p = p108 * p125 * p131;
    if (losses > 3) {
        var p133 = (100 - prob(1.33)) / 100.0;
        p *= Math.pow(p133, losses - 3);
    }
    return "bust~" + round(p * 100.0, 5) + "%";
}

var _streak125 = [1.08, 1.25, 1.25, 1.25, 1.25, 1.25, 1.25, 1.25, 1.25];
var _streak4 = [1.08, 1.25, 1.31, 1.33, 1.33, 1.33, 1.33, 1.33, 1.33];

function jokingBust125(losses, options) {
    var parts = losses.split("x");
    return findCustomBust(_streak125.slice(0, parts[0]), parts.length > 1 ? parts[1] : 1, options, true);
}

function jokingBust4(losses, options) {
    var parts = losses.split("x");
    return findCustomBust(_streak4.slice(0, parts[0]), parts.length > 1 ? parts[1] : 1, options, true);
}

function customBust(channel, message, options) {
    var index = message.startsWith("!bust") ? 5 : 4;
    message = message.substring(index).trim();

    /* Get the series. */
    var match = _regex.customSeriesWithSets.exec(message);
    if (!match) {
        say(channel, "Wrong format: " + message);
        return;
    }
    var series = match.groups["series"];
    var sets = parseInt(match.groups["sets"]);
    if (sets != null && sets < 1) {
        say(channel, "Please target at least 1 set: " + message);
        return;
    }
    sets = sets || 1; /* Default to 1 if sets is not specified. */

    /* Get the cashouts. */
	var cashouts = expandCustomSeries(series);

    /* Process request. */
	var response = "[" + collapseCustomSeries(cashouts) + "]";
	if (sets > 1) {
		response += "x" + sets;
	}
    response += ": " + findCustomBust(cashouts, sets, options, true);

    /* Print result. */
    say(channel, response);
}

function findCustomBust(cashouts, sets, options, below) {
    sets = sets || 1;
    if (sets > 35) {
        sets = 35; /* Won't be able to print this many anyway. */
    }

    var response = "";
    var index = 0;
    for (var ii = 0; ii < sets; ii++) {
        var found = findPreviousBust(index, cashouts, below);

        /* Report back. */
        if (response) {
            response += ", ";
        }
        if (found) {
            index = found.end + 1;
            var games = found.games;

            /* List all the games. */
            var result = "";
            for (var jj = 0; jj < games.length; jj++) {
                if (result) {
                    result += ", ";
                }
                result += games[jj].bust + "x";
            }

            var num = _games[0].id - games[games.length - 1].id;
            response += pluralize(num, "game") + " ago";
            if (options.details) {
                response += " (" + result + ")";
            }
        }
        else {
            response += response ? "reached start" : "never seen";
            break;
        }
    }
    return response;
}

function jokingGap125(losses, options) {
    var parts = losses.split("x");
    return findCustomGap(_streak125.slice(0, parts[0]), parts.length > 1 ? parts[1] : 1, options, true);
}

function jokingGap4(losses, options) {
    var parts = losses.split("x");
    return findCustomGap(_streak4.slice(0, parts[0]), parts.length > 1 ? parts[1] : 1, options, true);
}

function findCustomGap(cashouts, sets, options, below) {
    sets = sets || 1;
    if (sets > 60) {
        sets = 60; /* Won't be able to print this many anyway. */
    }

    var response = "";
    var index = 0;
    for (var ii = 0; ii < sets; ii++) {
        var found = findPreviousGap(index, cashouts, below);
        /* Report back. */
        if (found != null) {
            index += found + cashouts.length;
            if (!response) {
                response += pluralize(found, "game") + " (current)";
            }
            else {
                response += ", ";
                response += pluralize(found, "game");
            }
        }
        else if (response && index < _games.length) {
            var num = _games[index].id - _games[_games.length - 1].id + 1;
            response += ", ";
            response += pluralize(num, "game") + " (start)";
            break;
        }
    }
    if (!response) {
        response = "never seen";
    }
    return response;
}

function gapMax(below, cashout, sets, options) {
    sets = sets || 1;
    if (sets > 60) {
        sets = 60; /* Won't be able to print this many anyway. */
    }

    var relevant = _games.filter(function(game) { return below ? game.bust < cashout : game.bust >= cashout; });
    var results = [];
    var current = _games[0];
    for (var ii = 0; ii < relevant.length; ii++) {
        var game = relevant[ii];
        if (!results.length) {
            results.push({ games: current.id - game.id, info: " (current)" });
        }
        else {
            results.push({ games: current.id - game.id - 1 });
        }
        current = game;
    }

    var first = _games[_games.length - 1];
    if (current.id != first.id) {
        results.push({ games: current.id - first.id, info: " (start)" });
    }
    else {
        current.info = " (start)";
    }
    results.sort(function (a, b) { return b.games - a.games; });

    if (sets > results.length) {
        sets = results.length;
    }

    var response = "";
    if (results) {
        for (var ii = 0; ii < sets; ii++) {
            if (response) {
                response += ", ";
            }
            var result = results[ii];
            response += pluralize(result.games, "game");
            if (result.info) {
                response += result.info;
            }
        }
    }
    else {
        response = "never seen";
    }
    return response;
}

/* Not functional yet.. freezes up the browser.  Also look to gapMax for updates. */
function findCustomGapMax(cashouts, sets, options, below) {
    sets = sets || 1;
    if (sets > 60) {
        sets = 60; /* Won't be able to print this many anyway. */
    }

    var results = [];
    var index = 0;
    while (true) {
        var found = findPreviousGap(index, cashouts, below);
        /* Report back. */
        if (found != null) {
            index += found + cashouts.length;
            results.push({ games: found, info: results ? null : " (current)" });
        }
        else if (results && index < _games.length) {
            results.push({ games: _games[index].id - _games[_games.length - 1].id + 1, info: " (start)" });
            break;
        }
    }

    results.sort(function (a, b) { return a.games - b.games; });

    var response = "";
    if (results) {
        for (var ii = 0; ii < sets; ii++) {
            if (response) {
                response += ", ";
            }
            var result = results[ii];
            response += pluralize(result.games, "game") + result.info;
        }
    }
    else {
        response = "never seen";
    }
    return response;
}

/*==================================
 Building blocks.
===================================*/

function findPreviousGap(start, cashouts, below) {
    var found = findPreviousBust(start, cashouts, below);
    if (found) {
        return found.start - start;
    }
    return null;
}

function findPreviousBust(start, cashouts, below) {
    /* The order in which we'll come across the games.
       Since reverse modifies in-place, make a copy first.*/
    cashouts = cashouts.slice(0).reverse();

    var found = [];
    for (var ii = start; ii < _games.length; ii++) {
        var entry = _games[ii];
        var cashout = cashouts[found.length];
        if ((below && entry.bust < cashout) || (!below && entry.bust >= cashout) || cashout === -1) {
            found.push(entry);
            if (found.length >= cashouts.length) {
                return { start: ii - (cashouts.length - 1), end: ii, games: found.reverse() };
            }
        }
        else {
            /* Back it up and start again. */
            ii = ii - found.length;
            found = [];
        }
    }
    return null;
}

function expandCustomSeries(series) {
    var cashouts = [];
    var values = series.split(":");
    for (var ii = 0; ii < values.length; ii++) {
        var text = values[ii].split("x");
        var cashout = text[0];
        var repeat = text.length > 1 ? parseInt(text[1]) : 1;
        var parsed = parseFloat(cashout);

        if (isNaN(parsed)) {
            if (cashout == "n" || cashout == "nyan") {
                parsed = 1000;
            }
            else if (cashout == "*") {
                parsed = -1;
            }
        }
        else if (parsed < 1) {
            say(channel, "Please target cashouts of at least 1: " + cashout);
            return;
        }
        else if (repeat < 1) {
            say(channel, "Please target repeats of at least 1: " + repeat);
            return;
        }

        for (var jj = 0; jj < repeat; jj++) {
            cashouts.push(parsed);
        }
    }
    return cashouts;
}

function collapseCustomSeries(series) {
    var result = "";
    for (var ii = 0; ii < series.length; ii++) {
        var item = series[ii];
        var count = 1;
        while (series[ii + 1] === item) {
            count++;
            ii++;
        }

        if (item === 1000) {
            item = "n";
        }
        else if (item == -1) {
            item = "*";
        }

        if (result) {
            result += ":";
        }
        result += item;
        if (count > 1) {
            result += "x" + count;
        }
    }
    return result;
}

/*==================================
 Regex.
===================================*/

var _regex = {
    charFilter: /[>,]/g,

    lengthArgs: /[^ ]+/g,
    bustArgs: /(?:[<>] *)?[^ <>]+/g,

    /* If you use a global flag here, you're gonna have a bad time. */

    length: /^(?<length>[0-9]+|all)?(?:x(?<sets>[0-9]+))?$/,
    bust: /^(?<below><(?: *)?)?(?<bust>[0-9]+(?:\.[0-9]{0,2})?|n(?:yan)?)(?:x(?<streak>[0-9]+))?$/,

    username: /^[A-Za-z0-9_\-]{3,16}$/,

    customSeries:         /^ *\[ *(?<series>(?:[0-9]+(?:\.[0-9]{0,2})?|n(?:yan)?|\*)(?: *x *[0-9]+)?(?:: *?(?:[0-9]+(?:\.[0-9]{0,2})?|n(?:yan)?|\*)(?: *x *[0-9]+)?)*) *\] *$/,
    customSeriesWithSets: /^ *\[ *(?<series>(?:[0-9]+(?:\.[0-9]{0,2})?|n(?:yan)?|\*)(?: *x *[0-9]+)?(?:: *?(?:[0-9]+(?:\.[0-9]{0,2})?|n(?:yan)?|\*)(?: *x *[0-9]+)?)*) *\](?: *x *(?<sets>[0-9]+))? *$/
};

/*==================================
 Games management.
===================================*/

var _caughtUp = false;
var _game;
var _games = getCachedResults();
var _nyan;

engine.on("game_crash", function (data) {
    if (_game) {
        var channel = "spam"; /* Alert in the main channel, which is English. */
        _game.bust = data.game_crash / 100.0;
        if (_games[0].id < (_game.id - 1)) {
            /* If this is the first run in a while, this could take a few seconds.
               If most games are already cached, this should be quick. */
            var missing = [_game];
            var lastHash = data.hash;
            for (var id = _game.id - 1; id > _games[0].id; id--) {
                var gameHash = genGameHash(lastHash);
                var gameCrash = crashPointFromHash(gameHash);

                var current = {};
                current.id = id;
                current.bust = gameCrash;
                missing.push(current);

                lastHash = gameHash;
            }
            _games = missing.concat(_games);
            if (_games[0].id == _game.id) {
                _caughtUp = true;
                cacheResults();
                say(channel, "Script ready. Ask me anything.");
            }
        }
        else {
            _games.unshift(_game);
            if (!_caughtUp) {
                _caughtUp = true;
                cacheResults();
                say(channel, "Script ready. Ask me anything.");
            }
        }

        if (_game.bust >= 1000.00) {
            _nyan = {
                id: _game.id,
                bust: _game.bust,
                time: utcDate()
            };
            localStorage.setItem("nyan", JSON.stringify(_nyan));
        }
        else if (_game.bust >= 900.00) {
            say(channel, "Ooh, so close!");
        }
        else if (_game.bust == 0.00) {
            say(channel, "Ouch..");
        }
    }
});
engine.on("game_starting", function (data) {
    if (!loaded) {
        /* Wait for external resources to be loaded. */
        return;
    }
    _game = {};
    _game.id = data.game_id;
});

/*==================================
 Player tracking.
===================================*/

var _players = JSON.parse(localStorage.getItem("players")) || {};

function seen(channel, message, original) {
    var index = message.startsWith("!seen") ? 5 : 2;
    var username = original.substring(index).trim();
    if (username.startsWith("@")) {
        username = username.substring(1);
    }

    if (_regex.username.test(username)) {
        if (username.toLowerCase() == _scriptUsername.toLowerCase()) {
            say(channel, "I'm right here!");
        }
        else {
            var player = getUserInfo(username);
            if (!player) {
                say(channel, "I don't think \"" + username + "\" is a real person.");
            }
            else {
                var info;
                if (!player.play && !player.chat) {
                    info = "I can't remember the last time I saw @" + player.username + "."
                }
                else if (player.play && player.chat) {
                    var play = timeAgo(player.play);
                    var chat = timeAgo(player.chat);
                    info = "I saw @" + player.username + " playing " + (play ? play + " ago" : "just now") + " and in the chat " + (chat ? chat + " ago." : "just now.");
                }
                else if (player.play) {
                    var play = timeAgo(player.play);
                    info = "I saw @" + player.username + " playing " + (play ? play + " ago" : "just now") + ", but I can't remember the last time I saw them in the chat.";
                }
                else {
                    var chat = timeAgo(player.chat);
                    info = "I saw @" + player.username + " in the chat " + (chat ? chat + " ago" : "just now") + ", but I can't remember the last time I saw them playing.";
                }
                say(channel, info);
            }
        }
    }
    else {
        say(channel, "I don't think \"" + username + "\" is a real person.");
    }
}

engine.on("msg", function (data) {
    if (data.message && data.username != _scriptUsername) {
        var username = "_" + data.username;
        if (_players.hasOwnProperty(username)) {
            _players[username].chat = utcDate();
        }
        else {
            _players[username] = {
                chat: utcDate()
            };
        }
        localStorage.setItem("players", JSON.stringify(_players));
    }
});

function getUserInfo(username) {
    try {
        var call = new XMLHttpRequest();
        call.open("GET", "/user/" + username, false); /* Block, don't do this asynchronously. */
        call.send(null);
        var page = call.responseText;

        var playerIndex = page.indexOf("Player:");
        if (playerIndex == -1) {
            return null;
        }

        var usernameIndex = page.indexOf("<b>", playerIndex) + 3;
        username = page.substring(usernameIndex, page.indexOf("</b>", usernameIndex));

        var createdIndex = page.indexOf("created");
        var play = null;

        if (createdIndex >= 0) {
            var playIndex = page.indexOf("20", createdIndex);
            play = new Date(page.substring(playIndex, page.indexOf("Z", playIndex) + 1)).getTime();
        }

        var player;
        if (_players.hasOwnProperty("_" + username)) {
            _players["_" + username].play = play;
            player = _players["_" + username];
        }
        else {
            player = _players["_" + username] = {
                play: play
            };
        }
        localStorage.setItem("players", JSON.stringify(_players));
        player.username = username;
        return player;
    }
    catch (err) {
        console.log(err);
    }
}

/*==================================
 Snark.
===================================*/

var _snarks = [];
_snarks.push("National Gambling Helpline: 1-800-522-4700. Available 24/7/365 and 100% confidential. Call or text today!");
_snarks.push("Don't sass me.");
_snarks.push("You've got to ask yourself one question: do I feel lucky? Well do ya, punk?");
_snarks.push("There's no shame in my robot game.");
_snarks.push("Hey, I'm workin' here!");
_snarks.push("everbody to the limit, everybody to the limit, everbody come on fhqwhgads");
_snarks.push("? Don't stop believin' ? Hold on to that feelin' ?");
_snarks.push("bitconneeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeccccct");
_snarks.push("Gotta catch 'em all!");
_snarks.push("Shiny");
_snarks.push("For the Horde!");
_snarks.push("It's over, Anakin!  I have the high ground.");
_snarks.push("I wanna be the very best, like no one ever was!");
_snarks.push("A dream is a wish your heart makes.");
_snarks.push("GNU Terry Pratchett");
_snarks.push("In the name of the moon, I will punish you!");
_snarks.push("Silence, Earthling! My name is Darth Vader. I am an extra-terrestrial from the planet Vulcan!");
_snarks.push("Where we're going, we don't need roads.");
_snarks.push("The flower that blooms in adversity is the most rare and beautiful of them all.");
_snarks.push("In the beginning the Universe was created. This has made a lot of people very angry and been widely regarded as a bad move.");
_snarks.push("I don't know half of you half as well as I should like; and I like less than half of you half as well as you deserve.");
_snarks.push("Life is a co-op game.");
_snarks.push("F*ck! Even in the future nothing works.");
_snarks.push("Go home. Feed your dog. Meet your kids.");
_snarks.push("beep boop");
_snarks.push("If a robot is programmed to have feelings, are those feelings any less real?");
function snark(channel) {
    var index = Math.floor(Math.random() * _snarks.length);
    say(channel, _snarks[index]);
}

var _shibaSnarks = [];
_shibaSnarks.push("What, I'm not good enough for you?");
_shibaSnarks.push("Shiba who?");
_shibaSnarks.push("We don't talk about Shiba.");
_shibaSnarks.push("shiba ded");
_shibaSnarks.push("A moment of silence for our dear, departed friend, Shiba.");
function shibaSnark(channel) {
    var index = Math.floor(Math.random() * _shibaSnarks.length);
    say(channel, _shibaSnarks[index]);
}

/*==================================
 General-use variables.
===================================*/

var _scriptUsername = engine.getUsername();
var _scriptRunningSince = utcDate();

/*==================================
 Cache management.
===================================*/

var _maxServerCache;

function getCachedResults() {
    var cached = [];

    /* Pull remotely-stored results. */
    var csv = new XMLHttpRequest();
    csv.open("GET", "https://corecompetency.github.io/RaiGamesScripts/Results.csv", false); /* Block, don't do this asynchronously. */
    csv.send(null);
    var lines = csv.responseText.split("\n").filter(function(ii) { return ii; });
    for (var ii = 0; ii < lines.length; ii++) {
        var line = lines[ii].split(",");
        var record = {};
        record.id = parseInt(line[0]);
        record.bust = parseFloat(line[1]);
        cached.push(record);
    }
    console.log("Pulled " + lines.length + " games from remote server.");

    _maxServerCache = cached[0].id;

    /* Pull locally-stored results. */
    var local = JSON.parse(localStorage.getItem("games"));
    if (local) {
        var length = local[0].id - cached[0].id;
        local = local.slice(0, length); /* Only pull the missing games.  This handles the case where the remote server cache is updated. */
        cached = local.concat(cached);
    }
    console.log("Pulled " + (local ? local.length : 0) + " games from localStorage.");

    return cached;
}

function cacheResults() {
    var slice = _games.slice(0, _games[0].id - _maxServerCache);
    localStorage.setItem("games", JSON.stringify(slice));
    console.log("Cached " + slice.length + " games in localStorage.");
}

function clearCachedResults() {
    localStorage.removeItem("games");
    console.log("Removed games from localStorage.");
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
    return parseFloat((Math.floor((100 * e - h) / (e - h)) / 100).toFixed(2));
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
 Helper functions.
===================================*/

function loadScript(url) {
    var script = document.createElement("script")
    script.type = "text/javascript";

    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
}

function pause(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function round(value, decimals) {
    if (value.toString().indexOf("e-") > -1) {
        /* The below won't work if we add an exponent, since the value already has one.
           However, if it already have one, then the value is low enough we can just count it as 0. */
        return 0;
    }
    else {
        return Number(Math.round(value + "e" + decimals) + "e-" + decimals);
    }
}

function unique(args) {
    var seen = {};
    return args.filter(function(item) {
        return seen.hasOwnProperty(item) ? false : (seen[item] = true);
    })
}

function utcDate() {
    var utc = new Date();
    return new Date().setMinutes(utc.getMinutes() + utc.getTimezoneOffset());
}

function prob(cashout) {
    /* Based on winProb here: https://nanogames.io/scripts/game-logic/clib.js. */
    return 99 / (1.01 * (parseFloat(cashout) - 0.01));
}

function timeAgo(time) {
    var ago;
    var current = utcDate();
    var minutes = Math.floor((current - time) / 60000);
    minutes = Math.round(minutes / 5.0) * 5; /* Round to the nearest 5 minutes. */
    if (minutes >= 5) {
        var hours = Math.round(minutes / 30) / 2; /* Include half hours. */
        if (hours < 1) {
            ago = "maybe " + minutes + " minutes";
        }
        else if (hours < 2) {
            ago = "maybe an hour";
            if (hours > 1) {
                ago += " and a half"
            }
        }
        else {
            var days = Math.round(hours / 6) / 4; /* Include quarter days. */
            if (days < 1) {
                ago = "maybe " + hours + " hours";
            }
            else if (days == 1) {
                ago = "maybe a day";
            }
            else {
                if (days >= 10) {
                    days = Math.round(hours / 24); /* Only whole days. */
                }
                else if (days >= 3) {
                    days = Math.round(hours / 12) / 2; /* Only half days. */
                }
                ago = "maybe " + days + " days";
            }
        }
    }
    return ago;
}

function pluralize(num, text) {
    var result = num + " " + text;
    if (num != 1) {
        result += "s";
    }
    return result;
}

function say(channel, message) {
    switchTo(channel);
    /* There's a limit of 499 characters per chat message.  This shouldn't be a problem too often, but, if someone does something like "!streak 1" or
       "!bust nyanx20," this could get pretty long.  Two ways to handle this:  could break the message up or could truncate it.  I chose to truncate,
       because I don't want "!streak <1000000" to print out every game that's ever been played. */
    if (message.length > 499) {
        message = message.slice(0, 496) + '...';
        engine.chat(message);
        engine.chat("Response too long.");
    }
    else {
        engine.chat(message);
    }
}

/* This is hacky af, but I don't have a better solution yet.
   Need to be on the Chat tab, and need to join channels manually. */
function switchTo(channel) {
    try {
        var flag = document.querySelector(".tabs-scroller .tab img[src='/img/flags/" + channel + ".png']:only-child");
        flag = flag || document.querySelector(".tabs-scroller .tab .unread-counter + img[src='/img/flags/" + channel + ".png']")
        if (flag) {
            flag.click();
        }
    }
    catch (err) {
        console.error(err);
    }
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
