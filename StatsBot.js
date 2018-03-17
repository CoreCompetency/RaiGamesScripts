/* This is a script that can be run on RaiGames.io to provide stats based on chat prompts.

   The following commands can be called by anyone:
    - !med[ A[ B[ C]]]
      !median[ A[ B[ C]]]:                  Returns the median(s) of the last A[, B[, and C]] games, or the last 100 games if no arguments are provided.
                                            A, B, and C can also be specified in the format Ax#, where # is the number of sets of A to go back, max 5 each.
                                            For example, "!med 500x2" will return the last two intervals of 500 games, which is a median for games 1-500 and another for games 501-1000.
                                            A, B, or C can also be the word "all" to specify all games.
    - !mean[ A[ B[ C]]]
      !avg[ A[ B[ C]]]
      !average[ A[ B[ C]]]:                 Returns the average(s) of the last A[, B[, and C]] games, or the last 100 games if no arguments are provided.
                                            A, B, and C can also be specified in the format Ax#, where # is the number of sets of A to go back, max 5 (each).
                                            For example, "!avg 500x2" will return the last two intervals of 500 games, which is an average for games 1-500 and another for games 501-1000.
                                            A, B, or C can also be the word "all" to specify all games.
    - !min[ A[ B[ C]]]
      !minimum[ A[ B[ C]]]:                 Returns the lowest bust of the last A[, B[, and C]] games, or the last 100 games if no arguments are provided.
                                            A, B, and C can also be specified in the format Ax#, where # is the number of sets of A to go back, max 5 each.
                                            For example, "!min 500x2" will return the last two intervals of 500 games, which is the minimum bust for games 1-500 and another for games 501-1000.
                                            A, B, or C can also be the word "all" to specify all games.
    - !max[ A[ B[ C]]]                        
      !maximum[ A[ B[ C]]]:                 Returns the highest bust of the last A[, B[, and C]] games, or the last 100 games if no arguments are provided.
                                            A, B, and C can also be specified in the format Ax#, where # is the number of sets of A to go back, max 5 each.
                                            For example, "!min 500x2" will return the last two intervals of 500 games, which is the maximum bust for games 1-500 and another for games 501-1000.
                                            A, B, or C can also be the word "all" to specify all games.
    - !mode[ A[ B[ C]]]:                    Returns the mode(s) of the last A[, B[, and C]] games(, separated by |), or the last 100 games if no arguments are provided.
                                            A, B, and C can also be specified in the format Ax#, where # is the number of sets of A to go back, max 5 (each).
                                            For example, "!mode 500x2" will return the last two intervals of 500 games, which is the mode(s) for games 1-500 and the mode(s) for games 501-1000.
                                            A, B, or C can also be the word "all" to specify all games.
    - !prob[ D[ E[ F]]]
      !probability[ D[ E[ F]]]:             Returns the probability(ies) of the given bust(s), or a bust of 2 if no arguments are provided.
                                            < and > can precede the bust value to indicate above (or equal to) or below the bust value.
                                            D, E, and F can also be specified in the format Dx#, where # is the number of times in a row D appears, max 20 (each).
                                            For example, "!prob <1.25x6" will return the probability of six busts under 1.25x in a row.
    - !prob joking125[ G[ H[ I]]]
      !probability joking125[ G[ H[ I]]]:   Returns the probability that Joking313's 1.25x Script busts with the maxLosses provided, or maxLosses = 5 if no arguments are provided.
                                            The 1.25x Script can be found here:  https://github.com/Joking313/Scripts/blob/master/125xScript(Nano%2CEth).js
    - !prob joking4[ G[ H[ I]]]
      !probability joking4[ G[ H[ I]]]:     Returns the probability that Joking313's 4x Script busts with the maxLosses provided, or maxLosses = 5 if no arguments are provided.
                                            The 4x Script can be found here:  https://github.com/Joking313/Scripts/blob/master/4xScript(Nano%2CEth).js
    - !bust[ D[ E[ F]]]:                    Returns the last bust including or below the provided value(s), or a bust value of 2 if no arguments are provided.
                                            < and > can precede the bust value to indicate above (or equal to) or below the bust value.
                                            D, E, and F can also be specified in the format Dx#, where # is the number of busts to return, max 20 (each).
                                            For example, "!bust <1.25x6" will return the last six busts under 1.25x.  "!bust 1.25" will return the last bust above or equal to 1.25.
    - !bust joking125[ G[ H[ I]]]:          Returns the last bust of Joking313's 1.25x Script with the maxLosses provided, or maxLosses = 5 if no arguments are provided.
                                            The 1.25x Script can be found here:  https://github.com/Joking313/Scripts/blob/master/125xScript(Nano%2CEth).js
    - !bust joking4[ G[ H[ I]]]:            Returns the last bust of Joking313's 4x Script with the maxLosses provided, or maxLosses = 5 if no arguments are provided.
                                            The 1.25x Script can be found here:  https://github.com/Joking313/Scripts/blob/master/4xScript(Nano%2CEth).js
    - !streak[ D[ E[ F]]]:                  Returns the maximum streak seen for the given bust(s), or a bust of 2 if no arguments are provided.
                                            < and > can precede the bust value to indicate above (or equal to) or below the bust value.
    - !streak Dx#[ Ex#[ Fx#]]]:             Returns the last streak of length # (max 20 each) seen for the given bust(s).
                                            < and > can precede the bust value to indicate above (or equal to) or below the bust value.
                                            For example, "!streak <1.25x6" will return the last streak of six busts in a row under 1.25x.
    - !n
      !nyan:                                Returns the last time there was a nyan, which is a bust >= 1000.00.
    - !getnyan:                             Returns the game identifier of the last nyan and provides a link to view the game in which it occurred.
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
 Request management.
===================================*/

engine.on("msg", function (data) {
    if (data.message) {
        data.message = data.message.toLowerCase(); /* Easier for downstream processing to do this in one place. */
        if (data.username == _scriptUsername) {
            if (data.message == "!stop") {
                cacheResults();
                engine.chat("Script shutting down.");
                engine.stop();
                return;
            }
            else if (data.message == "!clearhistory") {
                clearCachedResults();
                engine.chat("Script shutting down.");
                engine.stop();
                return;
            }
        }
        if (data.message == "!help") {
            engine.chat("You can find the script I'm running with instructions on how to call it here:  https://github.com/CoreCompetency/RaiGamesScripts/blob/master/StatsBot.js");
            engine.chat("If you'd like to report a bug or submit a feature request, you can do so here:  https://github.com/CoreCompetency/RaiGamesScripts/issues");
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
        else if (data.message == "!script" || data.message == "!scripts") {
            engine.chat("Commonly-used, scripted strategies can be found here: https://github.com/Joking313/Scripts");
            engine.chat("If you'd like to create and test your own strategy, you can use this customizable script: https://github.com/CoreCompetency/RaiGamesScripts/blob/master/CustomizableBot.js");
            engine.chat("Remember that no script or strategy is expected to make money over time.  If you feel yourself becoming addicted to gambling, use the !helpline command to get the National Gambling Helpline phone number.");
        }
        else if (data.message.indexOf(_scriptUsername.toLowerCase()) >= 0) {
            snark();
        }
        else if (data.username != _scriptUsername && data.message.indexOf("shiba") >= 0) {
            shibaSnark();
        }
        else if (data.message.startsWith("!prob joking125") || data.message.startsWith("!probability joking125")) {
            processJoking(data.message, jokingProbability125);
        }
        else if (data.message.startsWith("!prob joking4") || data.message.startsWith("!probability joking4")) {
            processJoking(data.message, jokingProbability4);
        }
        else if (data.message.startsWith("!prob") || data.message.startsWith("!probability")) {
            processByBust(data.message, probability);
        }
        else if (!_caughtUp) {
            /* Script isn't ready to respond to the requests below yet. */
            return;
        }
        else if (data.message == "!n" || data.message == "!nyan") {
            var nyan = getNyanMessage();
            engine.chat(nyan);
        }
        else if (data.message == "!getnyan") {
            var nyan = getNyan();
            engine.chat("Last nyan was in game " + nyan.id + ". View the game here: https://raigames.io/game/" + nyan.id);
        }
        else if (data.message.startsWith("!med") || data.message.startsWith("!median")) {
            processByLength(data.message, median);
        }
        else if (data.message.startsWith("!mean") || data.message.startsWith("!avg") || data.message.startsWith("!average")) {
            processByLength(data.message, average);
        }
        else if (data.message.startsWith("!mode")) {
            processByLength(data.message, mode);
        }
        else if (data.message.startsWith("!min") || data.message.startsWith("!minimum")) {
            processByLength(data.message, min);
        }
        else if (data.message.startsWith("!max") || data.message.startsWith("!maximum")) {
            processByLength(data.message, max);
        }
        else if (data.message.startsWith("!bust joking125") || data.message.startsWith("!bust joking125")) {
            processJoking(data.message, jokingBust125);
        }
        else if (data.message.startsWith("!bust joking4") || data.message.startsWith("!bust joking4")) {
            processJoking(data.message, jokingBust4);
        }
        else if (data.message.startsWith("!bust")) {
            processByBust(data.message, bust);
        }
        else if (data.message.startsWith("!streak")) {
            processByBust(data.message, streak);
        }
        else if (data.message.startsWith("!")) {
            engine.chat("I don't know that command.  Use !help to view the commands I know or to submit a feature request.");
        }
    }
});

/*==================================
 Request processing.
===================================*/

function processByLength(message, action) {
    /* Get the lengths that come after the command. */
    var lengths = message.split(" ").filter(function (ii) { return ii; });
    lengths = lengths.slice(1);

    /* Check input. */
    if (lengths.length == 0) {
        /* Default to 100 games. */
        lengths.push("100");
    }
    else if (lengths.length > 3) {
        engine.chat("Please limit to three arguments in one request.");
        return;
    }
    
    /* Clear duplicates. */
    lengths = unique(lengths);

    /* Check for invalid arguments. */
    for (var ii = 0; ii < lengths.length; ii++) {
        var text = lengths[ii];
        var length = parseInt(text);
        if (isNaN(length)) { /* Check for NaN. */
            if (text.indexOf("all") >= 0) {
                length = _games.length.toString();
                lengths[ii] = lengths[ii].replace("all", length);
            }
            else {
                engine.chat("Wrong format: " + text);
                return;
            }
        }
        else if (length < 1) {
            engine.chat("Please target at least 1 game: " + text);
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
                else if (sets < 1 || sets > 5) {
                    engine.chat("Please target between 1 and 5 sets: " + text);
                    return;
                }
            }
        }
    }

    /* Process request. */
    var results = [];
    var response = "";

    for (var ii = 0; ii < lengths.length; ii++) {
        var text = lengths[ii];
        response += text + " ";
        var length = parseInt(text);

        var sets = 1;
        if (text.indexOf("x") > 0) {
            sets = parseInt(text.split("x")[1]);
        }

        var result = "";
        for (var jj = 0; jj < sets; jj++) {
            result += action(length * jj, length);
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

function processByBust(message, action) {
    /* Get the cashouts that come after the command. */
    var cashouts = message.split(" ").filter(function (ii) { return ii; });
    cashouts = cashouts.slice(1);

    /* Check input. */
    if (cashouts.length == 0) {
        /* Default to 2x. */
        cashouts.push("2");
    }
    else if (cashouts.length > 3) {
        engine.chat("Please limit to three arguments in one request.");
        return;
    }
    
    /* Clear duplicates. */
    cashouts = unique(cashouts);

    /* Check for invalid arguments. */
    for (var ii = 0; ii < cashouts.length; ii++) {
        var text = cashouts[ii];

        var cashout;
        if (text.startsWith("<") || text.startsWith(">")) {
            cashout = parseFloat(text.substring(1));
        }
        else {
            cashout = parseFloat(text);
        }

        if (isNaN(cashout)) { /* Check for NaN. */
            if (text.indexOf("nyan") >= 0) {
                cashout = 1000;
                cashouts[ii] = cashouts[ii].replace("nyan", cashout);
            }
            else {
                engine.chat("Wrong format: " + text);
                return;
            }
        }
        else if (cashout < 1) {
            engine.chat("Please target a cashout of at least 1: " + text);
            return;
        }
        else if (text.indexOf("x") > 0) {
            var parts = text.split("x");
            if (parts.length < 2) {
                engine.chat("Wrong format: " + text);
                return;
            }
            else {
                var streak = parseInt(parts[1]);
                if (isNaN(streak)) {
                    engine.chat("Wrong format: " + text);
                    return;
                }
                else if (streak < 1 || streak > 20) {
                    engine.chat("Please target a streak between 1 and 20: " + text);
                    return;
                }
            }
        }
    }

    /* Process request. */
    var results = [];
    var response = "";

    for (var ii = 0; ii < cashouts.length; ii++) {
        var text = cashouts[ii];
        response += text + " ";
        results.push(action(text)); /* Let the action interpret the x#. */
    }

    /* Print result. */
    var response = response.trim() + ":";
    for (var ii = 0; ii < results.length; ii++) {
        response += " " + results[ii] + "; ";
    }
    response = response.substring(0, response.length - 2); /* Trim final semicolon. */
    engine.chat(response);
}

function processJoking(message, action) {
    /* Get the losses that come after the command. */
    var losses = message.split(" ").filter(function (ii) { return ii; });
    losses = losses.slice(2);

    /* Check input. */
    if (losses.length == 0) {
        /* Default to 5. */
        losses.push("5");
    }
    else if (losses.length > 3) {
        engine.chat("Please limit to three arguments in one request.");
        return;
    }
    
    /* Clear duplicates. */
    losses = unique(losses);

    /* Check for invalid arguments. */
    for (var ii = 0; ii < losses.length; ii++) {
        var text = losses[ii];
        var loss = parseFloat(text);
        
        if (isNaN(text)) { /* Check for NaN. */
            engine.chat("Wrong format: " + text);
            return;
        }
        else if (loss != Math.floor(loss) || loss < 3 || loss > 9) {
            engine.chat("Please target a loss streak between 3 and 9: " + text);
            return;
        }
    }

    /* Process request. */
    var results = [];
    var response = "";

    for (var ii = 0; ii < losses.length; ii++) {
        var text = losses[ii];
        response += text + " ";
        results.push(action(text));
    }

    /* Print result. */
    var response = response.trim() + ":";
    for (var ii = 0; ii < results.length; ii++) {
        response += " " + results[ii] + "; ";
    }
    response = response.substring(0, response.length - 2); /* Trim final semicolon. */
    engine.chat(response);
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
    var message = "Yeah, I saw nyan around here. It was about " + (_game.id - nyan.id) + " games ago.."
    
    if (nyan.time) {
        var current = utcDate();
        var minutes = Math.floor((current - nyan.time) / 60000);
        minutes = Math.round(minutes / 5.0) * 5; /* Round to the nearest 5 minutes. */
        if (minutes >= 5) {
            var hours = Math.round(minutes / 30) / 2; /* Include half hours. */
            if (hours < 1) {
                message += " maybe " + minutes + " minutes.";
            }
            else if (hours < 2) {
                message += " maybe an hour";
                if (hours > 1) {
                    message += " and a half"
                }
                message += "."
            }
            else {
                var days = Math.round(hours / 6) / 4; /* Include quarter days. */
                if (days < 1) {
                    message += " maybe " + hours + " hours.";
                }
                else if (days == 1) {
                    message += " maybe a day.";
                }
                else {
                    if (days >= 10) {
                        days = Math.round(hours / 24); /* Only whole days. */
                    }
                    else if (days >= 3) {
                        days = Math.round(hours / 12) / 2; /* Only half days. */
                    }
                    message += " maybe " + days + " days.";
                }
            }
        }
    }
    
    message += " Who wants to know?";
    return message;
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

function probability(cashout) {
    var invert = false;
    if (cashout.startsWith("<") || cashout.startsWith(">")) {
        if (cashout.startsWith("<")) {
            invert = true;
        }
        cashout = cashout.substring(1);
    }
    var p = prob(parseFloat(cashout));

    /* Check for inversion. */
    if (invert) {
        p = 100 - p;
    }

    /* Check for streak. */
    if (cashout.indexOf("x") > 0) {
        var streak = parseInt(cashout.split("x")[1]);
        p = Math.pow(p / 100.0, streak) * 100.0;
    }

    return "~" + round(p, 3) + "%";
}

function bust(cashout) {
    var invert = false;
    if (cashout.startsWith("<") || cashout.startsWith(">")) {
        if (cashout.startsWith("<")) {
            invert = true;
        }
        cashout = cashout.substring(1);
    }

    var value = parseFloat(cashout);
    var find = 1;
    if (cashout.indexOf("x") > 0) {
        find = parseInt(cashout.split("x")[1]);
    }

    var result = "";
    var found = 0;
    for (var ii = 0; ii < _games.length; ii++) {
        var game = _games[ii];
        if ((invert && game.bust < value) || (!invert && game.bust >= value)) {
            if (result) {
                result += ", ";
            }
            result += (_game.id - game.id) + " games ago (" + game.bust + "x)";
            found++;
            if (found >= find) {
                break;
            }
        }
    }
    if (!result) {
        result = "never seen";
    }
    return result;
}

function streak(cashout) {
    var invert = false;
    if (cashout.startsWith("<") || cashout.startsWith(">")) {
        if (cashout.startsWith("<")) {
            invert = true;
        }
        cashout = cashout.substring(1);
    }

    var value = parseFloat(cashout);
    var find;
    if (cashout.indexOf("x") > 0) {
        find = parseInt(cashout.split("x")[1]);
    }

    var found = [];
    var check = [];
    for (var ii = 0; ii < _games.length; ii++) {
        var game = _games[ii];
        if ((invert && game.bust < value) || (!invert && game.bust >= value)) {
            check.push(game);
            if (check.length > found.length) {
                found = check.slice(0); /* Copy the values, not the reference. */
            }
            if (find && found.length >= find) {
                break;
            }
        }
        else {
            /* Clear what we're tracking. */
            check = [];
        }
    }

    /* Start from the first game. */
    found.reverse();

    /* List all the games. */
    var result = "";
    for (var ii = 0; ii < found.length; ii++) {
        if (result) {
            result += ", ";
        }
        result += found[ii].bust + "x";
    }

    /* Report back. */
    if (find && found.length >= find) {
        result = "seen " + (_game.id - found[found.length - 1].id) + " games ago (" + result + ")";
        return result;
    }
    else if (!find) {
        result = "seen " + found.length + " streak " + (_game.id - found[found.length - 1].id) + " games ago (" + result + ")";
        return result;
    }
    else {
        return "never seen";
    }
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

function jokingBust125(losses) {
    return jokingBust(_streak125.slice(0, losses));
}

function jokingBust4(losses) {
    return jokingBust(_streak4.slice(0, losses));
}

function jokingBust(streak) {
    streak.reverse(); /* The order in which we'll come across the games. */
    
    var found = [];
    for (var ii = 0; ii < _games.length; ii++) {
        var game = _games[ii];
        if (game.bust < streak[found.length]) {
            found.push(game);
            if (found.length >= streak.length) {
                break;
            }
        }
        else {
            /* Back it up and start again. */
            ii = ii - found.length;
            found = [];
        }
    }

    /* Report back. */
    if (found.length >= streak.length) {
        /* Start from the first game. */
        found.reverse();

        /* List all the games. */
        var result = "";
        for (var ii = 0; ii < found.length; ii++) {
            if (result) {
                result += ", ";
            }
            result += found[ii].bust + "x";
        }
        
        result = "seen " + (_game.id - found[found.length - 1].id) + " games ago (" + result + ")";
        return result;
    }
    else {
        return "never seen";
    }
}

/*==================================
 Games management.
===================================*/

var _caughtUp = false;
var _game;
var _games = getCachedResults();
var _nyan;

engine.on("game_crash", function (data) {
    if (_game) {
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
            _games = concatArrays(missing, _games);
            if (_games[0].id == _game.id) {
                _caughtUp = true;
                cacheResults();
                engine.chat("Script ready. Ask me anything.");
            }
        }
        else {
            _games.unshift(_game);
            if (!_caughtUp) {
                _caughtUp = true;
                cacheResults();
                engine.chat("Script ready. Ask me anything.");
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
            engine.chat("Ooh, so close!");
        }
        else if (_game.bust == 0.00) {
            engine.chat("Ouch..");
        }
    }
});
engine.on("game_starting", function (data) {
    _game = {};
    _game.id = data.game_id;
});

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
_snarks.push("♫ Don't stop believin' ♫ Hold on to that feelin' ♫");
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
function snark() {
    var index = Math.floor(Math.random() * _snarks.length);
    engine.chat(_snarks[index]);
}

var _shibaSnarks = [];
_shibaSnarks.push("What, I'm not good enough for you?");
_shibaSnarks.push("Shiba who?");
_shibaSnarks.push("We don't talk about Shiba.");
_shibaSnarks.push("shiba ded");
_shibaSnarks.push("A moment of silence for our dear, departed friend, Shiba.");
function shibaSnark() {
    var index = Math.floor(Math.random() * _shibaSnarks.length);
    engine.chat(_shibaSnarks[index]);
}

/*==================================
 General-use variables.
===================================*/

var _scriptUsername = engine.getUsername();

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
        concatArrays(local, cached);
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

loadScript("https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/components/core.js");
loadScript("https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/components/sha256.js");
loadScript("https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/components/hmac.js");

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

function concatArrays(first, second) {
    var result = new Array(first.length + second.length);
    var secondStart = first.length;
    for (var ii = 0; ii < first.length; ii++) {
        result[ii] = first[ii];
    }
    for (var ii = 0; ii < second.length; ii++) {
        result[ii + secondStart] = second[ii];
    }
    return result;
}

function round(value, decimals) {
    return Number(Math.round(value + "e" + decimals) + "e-" + decimals);
}

function unique(args) {
    var seen = {};
    return args.filter(function(item) {
        var key = item.toLowerCase();
        return seen.hasOwnProperty(key) ? false : (seen[key] = true);
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

/*==================================
 Functions for IE.
===================================*/

if (!String.prototype.startsWith) {
    String.prototype.startsWith = function (searchString, position) {
        position = position || 0;
        return this.indexOf(searchString, position) === position;
    };
}
