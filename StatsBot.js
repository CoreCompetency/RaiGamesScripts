/* This is a script that can be run on RaiGames.io to provide stats based on chat prompts.

   The following commands can be called by anyone:
    - !med[ A[ B[ C]]]
      !median[ A[ B[ C]]]:                  Returns the median(s) of the last A[, B[, and C]] games, or the last 100 games if no arguments are provided.
                                            A, B, and C can also be specified in the format Ax#, where # is the number of sets of A to go back.
                                            For example, "!med 500x2" will return the last two intervals of 500 games, which is a median for games 1-500 and another for games 501-1000.
                                            A, B, or C can also be the word "all" to specify all games.
    - !mean[ A[ B[ C]]]
      !avg[ A[ B[ C]]]
      !average[ A[ B[ C]]]:                 Returns the average(s) of the last A[, B[, and C]] games, or the last 100 games if no arguments are provided.
                                            A, B, and C can also be specified in the format Ax#, where # is the number of sets of A to go back.
                                            For example, "!avg 500x2" will return the last two intervals of 500 games, which is an average for games 1-500 and another for games 501-1000.
                                            A, B, or C can also be the word "all" to specify all games.
    - !min[ A[ B[ C]]]
      !minimum[ A[ B[ C]]]:                 Returns the lowest bust of the last A[, B[, and C]] games, or the last 100 games if no arguments are provided.
                                            A, B, and C can also be specified in the format Ax#, where # is the number of sets of A to go back.
                                            For example, "!min 500x2" will return the last two intervals of 500 games, which is the minimum bust for games 1-500 and another for games 501-1000.
                                            A, B, or C can also be the word "all" to specify all games.
    - !max[ A[ B[ C]]]
      !maximum[ A[ B[ C]]]:                 Returns the highest bust of the last A[, B[, and C]] games, or the last 100 games if no arguments are provided.
                                            A, B, and C can also be specified in the format Ax#, where # is the number of sets of A to go back.
                                            For example, "!min 500x2" will return the last two intervals of 500 games, which is the maximum bust for games 1-500 and another for games 501-1000.
                                            A, B, or C can also be the word "all" to specify all games.
    - !mode[ A[ B[ C]]]:                    Returns the mode(s) of the last A[, B[, and C]] games(, separated by |), or the last 100 games if no arguments are provided.
                                            A, B, and C can also be specified in the format Ax#, where # is the number of sets of A to go back.
                                            For example, "!mode 500x2" will return the last two intervals of 500 games, which is the mode(s) for games 1-500 and the mode(s) for games 501-1000.
                                            A, B, or C can also be the word "all" to specify all games.
    - !prb[ D[ E[ F]]]
      !prob[ D[ E[ F]]]
      !probability[ D[ E[ F]]]:             Returns the probability(ies) of the given bust(s), or a bust of 2 if no arguments are provided.
                                            < and > can precede the bust value to indicate above (or equal to) or below the bust value.
                                            D, E, and F can also be specified in the format Dx#, where # is the number of times in a row D appears.
                                            For example, "!prob <1.25x6" will return the probability of six busts under 1.25x in a row.
                                            D, E, or F can also be the word "nyan" or the letter "n" to specify a bust of 1000.
    - !prb joking125[ G[ H[ I]]]
      !prob joking125[ G[ H[ I]]]
      !probability joking125[ G[ H[ I]]]:   Returns the probability that Joking313's 1.25x Script busts with the maxLosses provided, or maxLosses = 5 if no arguments are provided.
                                            The 1.25x Script can be found here:  https://github.com/Joking313/Scripts/blob/master/125xScript(Nano%2CEth).js
    - !prb joking4[ G[ H[ I]]]
      !prob joking4[ G[ H[ I]]]
      !probability joking4[ G[ H[ I]]]:     Returns the probability that Joking313's 4x Script busts with the maxLosses provided, or maxLosses = 5 if no arguments are provided.
                                            The 4x Script can be found here:  https://github.com/Joking313/Scripts/blob/master/4xScript(Nano%2CEth).js
    - !bst[ D[ E[ F]]]
      !bust[ D[ E[ F]]]:                    Returns the last bust including or below the provided value(s), or a bust value of 2 if no arguments are provided.
                                            < and > can precede the bust value to indicate above (or equal to) or below the bust value.
                                            D, E, and F can also be specified in the format Dx#, where # is the number of busts to return.
                                            For example, "!bust <1.25x6" will return the last six busts under 1.25x.  "!bust 1.25" will return the last bust above or equal to 1.25.
                                            D, E, or F can also be the word "nyan" or the letter "n" to specify a bust of 1000.
    - !bst joking125[ G[ H[ I]]]
      !bust joking125[ G[ H[ I]]]:          Returns the last bust of Joking313's 1.25x Script with the maxLosses provided, or maxLosses = 5 if no arguments are provided.
                                            Add "!details" to get the individual busts that make up the series bust.
                                            The 1.25x Script can be found here:  https://github.com/Joking313/Scripts/blob/master/125xScript(Nano%2CEth).js
    - !bst joking4[ G[ H[ I]]]
      !bust joking4[ G[ H[ I]]]:            Returns the last bust of Joking313's 4x Script with the maxLosses provided, or maxLosses = 5 if no arguments are provided.
                                            Add "!details" to get the individual busts that make up the series bust.
                                            The 4x Script can be found here:  https://github.com/Joking313/Scripts/blob/master/4xScript(Nano%2CEth).js
    - !bst [A:B:C:...]x#
      !bust [A:B:C:...]x#:                  Returns the last (#) bust(s) for the provided series.
                                            This allows callers to check for custom bust streaks to quickly test strategies.
                                            Add "!details" to get the individual busts that make up the series bust.
    - !streak[ D[ E[ F]]]:                  Returns the maximum streak seen for the given bust(s), or a bust of 2 if no arguments are provided.
                                            < and > can precede the bust value to indicate above (or equal to) or below the bust value.
                                            Add "!details" to get the individual busts that make up the streak.
    - !streak Dx#[ Ex#[ Fx#]]]:             Returns the last streak of length # seen for the given bust(s).
                                            < and > can precede the bust value to indicate above (or equal to) or below the bust value.
                                            For example, "!streak <1.25x6" will return the last streak of six busts in a row under 1.25x.
                                            D, E, or F can also be the word "nyan" or the letter "n" to specify a bust of 1000.
                                            Add "!details" to get the individual busts that make up the streak.
    - !gap [ D[ E[ F]]]                     Returns the gaps between since the last bust(s) including provided value(s), or a bust value of 2 if no arguments are provided.
                                            D, E, and F can also be specified in the format Dx#, where # is the number of gaps to return.
                                            For example, "!gap 100x6" will return the last six gaps of games under 100x.  "!gap 1.25" will return the current number of games since the last 100x.
                                            D, E, or F can also be the word "nyan" or the letter "n" to specify a bust of 1000.
    - !n
      !nyan:                                Returns the last time there was a nyan, which is a bust >= 1000.00.
    - !n#
      !nyan#
      !n #
      !nyan #
      !nx#
      !nyanx#:                              Returns the last # of nyans, which are a bust >= 1000.00.
                                            This is equivalent to calling "!bust nyanx#";
    - !s N
      !seen N:                              Provides the last time this script has seen the user specified as N.
    - !help:                                Provides a link to this script in github for review of these comments.  Also provides a link to open issues.
    - !helpline:                            Provides information about the National Problem Gambling Helpline.
    - !donate
      !tip:                                 Provides information for monetary thanks for running the script.
                                            If you are running your own copy of the script, you may want to replace the nano address with your own.
    - !script
      !scripts                              Provides links to commonly-used scripts.

    Mentioning the name of the account running this script in chat will trigger a snarky response.
    Mentioning the name of the original RaiGames.io bot (Shiba) will also trigger a snarky response.

    The following commands can be called by the account running this script:
    - !stop:          This will stop the script and provide feedback in the chat.  (This is to alert players that the script is shutting down.)
                      This will also trigger in-memory games to get stored to localStorage for the next run.
    - !clearhistory:  This will clear games from the localStorage.  To be used if something gets messed up.
                      This will also trigger the script to stop so that the next run can fill localStorage again.
*/

/*==================================
 External resources.
===================================*/

loadScript("https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/components/core.js");
loadScript("https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/components/sha256.js");
loadScript("https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/components/hmac.js");
pause(200); /* Let the resources load before continuing. */

/*==================================
 Request management.
===================================*/

var _ignore = [
    "!kill", /* Joking313 scripts. */
    "!cashout", "!stop", "!stopafterwin", "!chase.start", "!chase.stop", /* CustomizableBot. */
    "!sounds.win:on", "!sounds.win:off", "!sounds.lose:on", "!sounds.lose:off", "!sounds.mention:on", "!sounds.mention:off" /* SoundAlerts. */
];
engine.on("msg", function (data) {
    try {
        if (data.message) {
            var channel = data.channelName;
            /* Easier for downstream processing to do all this in one place. */
            var message = data.message.toLowerCase()
                                      .replace(_regex.charFilter, "");

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

            if (data.username == _scriptUsername) {
                if (message == "!stop") {
                    cacheResults();
                    say(channel, "Script shutting down.");
                    engine.stop();
                    return;
                }
                else if (message == "!clearhistory") {
                    clearCachedResults();
                    say(channel, "Script shutting down.");
                    engine.stop();
                    return;
                }
            }
            if (message == "!help") {
                say(channel, "You can find the script I'm running with instructions on how to call it here:  https://github.com/CoreCompetency/RaiGamesScripts/blob/master/StatsBot.js");
                say(channel, "If you'd like to report a bug or submit a feature request, you can do so here:  https://github.com/CoreCompetency/RaiGamesScripts/issues");
            }
            else if (message == "!helpline") {
                say(channel, "National Gambling Helpline: 1-800-522-4700.  Available 24/7/365 and 100% confidential.  Call or text today!");
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
                say(channel, "Remember that no script or strategy is expected to make money over time.  If you feel yourself becoming addicted to gambling, use the !helpline command to get the National Gambling Helpline phone number.");
            }
            else if (data.username != _scriptUsername && message.indexOf(_scriptUsername.toLowerCase()) > -1) {
                snark(channel);
            }
            else if (data.username != _scriptUsername && message.indexOf("shiba") > -1) {
                shibaSnark(channel);
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
            else if (message.startsWith("!bst joking125") || message.startsWith("!bust joking125")) {
                processJoking(channel, message, jokingBust125, options);
            }
            else if (message.startsWith("!bst joking4") || message.startsWith("!bust joking4")) {
                processJoking(channel, message, jokingBust4, options);
            }
            else if (message.startsWith("!bst") || message.startsWith("!bust")) {
                processByBust(channel, message, bust, options);
            }
            else if (message.startsWith("!gap")) {
                processByBust(channel, message, gap, options);
            }
            else if (message.startsWith("!streak")) {
                processByBust(channel, message, streak, options);
            }
            else if (message.startsWith("!") && _ignore.indexOf(message) == -1) {
                say(channel, "I don't know that command.  Use !help to view the commands I know or to submit a feature request.");
            }
        }
    }
    catch (err) {
        console.error(err);
        say("spam", "Oops, I did me a heckin' error!");
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
    else if (lengths.length > 4) {
        say(channel, "Please limit to 4 arguments.");
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
    var losses = message.split(" ").filter(function (ii) { return ii; });
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
        var loss = parseFloat(text);

        if (isNaN(text)) { /* Check for NaN. */
            say(channel, "Wrong format: " + text);
            return;
        }
        else if (loss != Math.floor(loss) || loss < 3 || loss > 9) {
            say(channel, "Please target a loss streak between 3 and 9: " + text);
            return;
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
 Calculations for requests.
===================================*/

function getNyan() {
    if (!_nyan) {
        var cached = JSON.parse(localStorage.getItem("nyan"));
        for (var ii = 0; ii < _games.length; ii++) {
            var current = _games[ii];
            if (current.bust >= 1000.00) {
                _nyan = {
                    id: current.id
                };
                break;
            }
        }
        if (cached && cached.id == _nyan.id) {
            _nyan = cached;
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
    message += " Here you go: https://raigames.io/game/" + nyan.id;
    return message;
}

function nyanToBust(channel, message, options) {
    var index = message.indexOf("nyan") > -1 ? 5 : 2;
    var arg = message.substring(index).trim();
    if (arg.indexOf(" ") > -1) {
        say(channel, "Wrong format: " + arg);
    }
    else {
        if (arg.startsWith("x")) {
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

function bust(below, cashout, streak, options) {
    streak = streak || 1;
    if (streak > 35) {
        streak = 35; /* Won't be able to print this many anyway. */
    }

    var result = "";
    var found = 0;
    for (var ii = 0; ii < _games.length; ii++) {
        var game = _games[ii];
        if ((below && game.bust < cashout) || (!below && game.bust >= cashout)) {
            if (result) {
                result += ", ";
            }
            var games = _game.id - game.id;
            result += games + " game" + (games == 1 ? "" : "s") + " ago (" + game.bust + "x)";

            found++;
            if (found >= streak) {
                break;
            }
        }
    }
    if (!result) {
        result = "never seen";
    }
    return result;
}

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
        result = "seen " + games + " game" + (games == 1 ? "" : "s") + " ago" + (options.details ? " (" + result + ")" : "");
        return result;
    }
    else if (!streak) {
        var games = _game.id - found[found.length - 1].id;
        result = "seen " + found.length + " streak " + games + " game" + (games == 1 ? "" : "s") + " ago" + (options.details ? " (" + result + ")" : "");
        return result;
    }
    else {
        return "never seen";
    }
}

function gap(below, cashout, streak, options) {
    streak = streak || 1;
    if (streak > 100) {
        streak = 100; /* Won't be able to print this many anyway. */
    }

    var result = "";
    var found = 0;
    var current;
    for (var ii = 0; ii < _games.length; ii++) {
        var game = _games[ii];
        if (game.bust >= cashout) {
            if (!current) {
                var games = _game.id - game.id;
                result += games + " game" + (games == 1 ? "" : "s") + " (current)";
                current = game;
            }
            else {
                result += ", ";
                var games = current.id - game.id;
                result += games + " game" + (games == 1 ? "" : "s");
                current = game;
            }

            found++;
            if (found >= streak) {
                break;
            }
        }
    }
    if (!result) {
        result = "never seen";
    }
    return result;
}

function jokingProbability125(losses) {
    var p108 = (100 - prob(1.08)) / 100.0;
    var p125 = (100 - prob(1.25)) / 100.0;
    var p = p108 * Math.pow(p125, losses - 1);
    return "bust~" + round(p * 100.0, 5) + "%";
}

function jokingProbability4(losses) {
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
    return findCustomBust(_streak125.slice(0, losses), 1, options);
}

function jokingBust4(losses, options) {
    return findCustomBust(_streak4.slice(0, losses), 1, options);
}

function customBust(channel, message, options) {
    var index = message.startsWith("!bust") ? 5 : 4;
    message = message.substring(index).trim();

    /* Get the series. */
    var match = _regex.customBust.exec(message);
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
    var cashouts = [];
    var values = series.split(":");
    for (var ii = 0; ii < values.length; ii++) {
        var cashout = values[ii];
        var parsed = parseFloat(cashout);
        if (isNaN(parsed)) {
            if (cashout == "n" || cashout == "nyan") {
                cashouts.push(1000);
            }
            else {
                say(channel, "Wrong format: " + message);
                return;
            }
        }
        else if (parsed < 1) {
            say(channel, "Please target cashouts of at least 1: " + message);
            return;
        }
        else {
            cashouts.push(parsed);
        }
    }

    /* Process request. */
    var response = message + ": " + findCustomBust(cashouts, sets, options);

    /* Print result. */
    say(channel, response);
}

function findCustomBust(cashouts, sets, options) {
    /* The order in which we'll come across the games. */
    cashouts.reverse();

    var response = "";
    var game = 0;
    for (var ii = 0; ii < sets; ii++) {
        var found = [];
        for (; game < _games.length; game++) {
            var entry = _games[game];
            if (entry.bust < cashouts[found.length]) {
                found.push(entry);
                if (found.length >= cashouts.length) {
                    break;
                }
            }
            else {
                /* Back it up and start again. */
                game = game - found.length;
                found = [];
            }
        }

        /* Report back. */
        if (found.length >= cashouts.length) {
            /* Start from the first game. */
            found.reverse();

            /* List all the games. */
            var result = "";
            for (var jj = 0; jj < found.length; jj++) {
                if (result) {
                    result += ", ";
                }
                result += found[jj].bust + "x";
            }

            var games = _game.id - found[found.length - 1].id;
            response += "seen " + games + " game" + (games == 1 ? "" : "s") + " ago" + (options.details ? " (" + result + "), " : ", ");
        }
        else {
            response += "never seen, ";
            break;
        }
    }
    response = response.substring(0, response.length - 2); /* Trim final comma. */
    return response;
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

    customBust: /^ *\[ *(?<series>(?:[0-9]+(?:\.[0-9]{0,2})?|n(?:yan)?)(?:: *?(?:[0-9]+(?:\.[0-9]{0,2})?|n(?:yan)?))*) *\](?: *x *(?<sets>[0-9]+))? *$/
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
        var channel = "english"; /* Alert in the main channel, which is English. */
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
_snarks.push("National Gambling Helpline: 1-800-522-4700.  Available 24/7/365 and 100% confidential.  Call or text today!");
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
    var lines = csv.responseText.split("\n").filter(function (ii) { return ii; });
    for (var ii = 0; ii < lines.length; ii++) {
        var line = lines[ii].split(",");
        var record = {};
        record.id = line[0];
        record.bust = line[1];
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
 Helper functions.
===================================*/

function loadScript(url) {
    var script = document.createElement("script")
    script.type = "text/javascript";

    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function pause(ms) {
    await sleep(ms);
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
    /* Based on winProb here: https://raigames.io/scripts/game-logic/clib.js. */
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

function say(channel, message) {
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

/*==================================
 Functions for IE.
===================================*/

if (!String.prototype.startsWith) {
    String.prototype.startsWith = function (searchString, position) {
        position = position || 0;
        return this.indexOf(searchString, position) === position;
    };
}
