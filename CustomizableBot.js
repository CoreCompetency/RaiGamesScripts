/* This is a customizable script that can be run for gambling on RaiGames.io.
   Be aware that RaiGames.io is a casino and the expected value of any gambling there is negative:  you are expected to lose money.
   None of the example strategies in this script are expected to win money.  They are intended solely to demonstrate the functionality of this script.
   
   The following commands can be used in chat as long as you are logged in as the user running the script:
   - !cashout:       This will immediately cash out.
   - !stop:          This will immediately stop the script.
   - !stopafterwin:  This will stop the script after the next win.
   - !chase.start:   This will pause the previous betting strategy and start chasing a nyan.  
   - !chase.stop:    This will stop the nyan chase and resume the previous betting strategy where it left off.
   
   The variables in this section should be modified to meet your gambling needs.  They are described below:
   - testMode:                   If this is enabled (true), the script will only output to console and will not bet.
                                     Use this to test your strategy before enabling live betting.
                                     The test will not take into account bonuses, so results will be a bit conservative.
   - base:                       
       bet:                      The default bet.
       cashout:                  The default cashout.
   - autoAdjustBaseBet:          
       enabled:                  If this is true, the default bet will be updated dynamically to match a percentage of your balance every time your bet is reset.
       percentageOfBalance:      The percentage of your balance to use as your default bet if dynamically betting.
                                     This should be between 0.0 and 1.0.  The minimum bet will always be 1.
   - max:                        
       losses:                   The maximum number of losses in a row before stopping the script.  If this is null, the script will run until it can't bet anymore.
       wins:                     The maximum number of wins in a row before stopping the script.  If this is null, the script will run until it can't bet anymore.
       totalLoss:                Net mXRB value that can be lost before the script stops.  If this is null, the script will run until it can't bet anymore.
       totalWin:                 Net mXRB value that can be won before the script stops.  If this is null, the script will run until it can't bet anymore.
   - onLose:                     
       reset:                    If this is true, the bet and cashout will reset to the default bet and cashout after a loss.
       multiplyBet:              On a loss, the current bet will be multiplied by this value.
       multiplyCashout:          On a loss, the current cashout will be multiplied by this value.
       increaseBet:              On a loss, the current bet will be increased by this static amount.
                                     This value can be positive or negative.  The minimum bet will always be 1.
       increaseCashout:          On a loss, the current cashout will be increased by this static amount.
                                     This value can be positive or negative.  The minimum bet will always be 1.
       skip:                     
         games:                  This number of games will be skipped after a loss.  Set this to 0 to never skip games on a loss.
         onlyIfBustAbove:        Games will only be skipped if the loss that triggers the skip is above this value.  If this is null, the script will always skip the specified number of games.
                                     This setting can be used in conjunction with onlyIfBustBelow; games will be skipped if either condition is met.
         onlyIfBustBelow:        Games will only be skipped if the loss that triggers the skip is below this value.  If this is null, the script will always skip the specified number of games.
                                     This setting can be used in conjunction with onlyIfBustAbove; games will be skipped if either condition is met.
   - onWin:                      
       reset:                    If this is true, the bet and cashout will reset to the default bet and cashout after a win.
       multiplyBet:              On a win, the current bet will be multiplied by this value.
       multiplyCashout:          On a win, the current cashout will be multiplied by this value.
       increaseBet:              On a win, the current bet will be increased by this static amount.
                                     This value can be positive or negative.  The minimum bet will always be 1.
       increaseCashout:          On a win, the current cashout will be increased by this static amount.
                                     This value can be positive or negative.  The minimum bet will always be 1.
       skip:                     
         games:                  This number of games will be skipped after a win.  Set this to 0 to never skip games on a win.
         onlyIfBustAbove:        Games will only be skipped if the win that triggers the skip is above this value. If this is null, the script will always skip the specified number of games.
                                     This setting can be used in conjunction with onlyIfBustBelow; games will be skipped if either condition is met.
         onlyIfBustBelow:        Games will only be skipped if the win that triggers the skip is below this value. If this is null, the script will always skip the specified number of games.
                                     This setting can be used in conjunction with onlyIfBustAbove; games will be skipped if either condition is met.
   - custom:
       enabled:                  If this is true, the script will ignore the regular betting rules above and execute the strategy defined.
                                     On a win, the strategy will restart.  On a lose, the strategy will move onto the next entry.
                                     If a string of losses causes the script to run out of strategy entries, the script will stop.
                                     Use a null entry to identify a skipped game.
       strategy:                 Each entry in this array represents one bet in the custom strategy and should have a bet value and a cashout value.
                                     Null entries represent skipped games.  The first entry can't be null.
   - nyanChase:                  
       enabled:                  If this is true, the script will ignore the regular and custom betting rules above and only focus on chasing a nyan.
                                     During a chase, the script will bet your baseBet 1000 times.
                                     If no nyan is hit, the script will increase your bet and decrease the number of bets before doing so again.
                                     The script will bet a maximum of maxBets times.
                                         Example with baseBet = 1 and maxbet = 1900:
                                             The script will bet 1 for 1000 games, then 2 for 500 games, then 3 for 333 games,
                                             then 4 for 67 games, for a total of 1900 bets equalling 3267 mXRB.
                                     A win during a chase, even if triggered by a !cashout call or a manual cashout, is treated as a success.
       baseBet:                  The starting amount to bet while chasing a nyan.
       maxBets:                  The maximum number of times to bet before stopping.  If this is null, the script will chase until it can't bet anymore.
                                     If stopOnSuccess is false, the bet and bet count will reset for every chase.
       stopOnSuccess:            If this is true, the script will stop chasing nyan after a success.
       resumeBettingAfterStop:   If this is true, the script will resume the previous betting strategy after the chase is stopped.
                                     If the chase is started using !chase.start, the previous betting strategy will resume on completion regardless of this value.
   
   This custom script was created by CoreCompetency.  Custom scripts can be ordered here:  http://www.workfornano.com/jobs/programming-tech/raigames-script/
   For public scripts, check here:  https://github.com/CoreCompetency/RaiGamesScripts
   A script for sound alerts can be found at the above link and pasted into this script to enable sound alerts on wins, losses, and chat mentions.
   This script is released to the public domain under The Unlicense:  https://choosealicense.com/licenses/unlicense/
*/

/* Run in test mode. */

var testMode = true;

/* Regular betting strategy. */

var base = {
    bet: 1,
    cashout: 1.13
}

var autoAdjustBaseBet = {
    enabled: false,
    percentageOfBalance: 0.001
}

var max = {
    losses: 5,
    wins: null,
    totalLoss: 50,
    totalWin: 100
};

var onLose = {
    reset: false,
    multiplyBet: 1.0,
    multiplyCashout: 1.0,
    increaseBet: 0.0,
    increaseCashout: 0.00,
    skip: {
        games: 0,
        onlyIfBustAbove: 100000.00,
        onlyIfBustBelow: 1.00
    }
};

var onWin = {
    reset: true,
    multiplyBet: 1.0,
    multiplyCashout: 1.0,
    increaseBet: 0.0,
    increaseCashout: 0.0,
    skip: {
        games: 0,
        onlyIfBustAbove: 100000.00,
        onlyIfBustBelow: 1.00
    }
};

/* Custom betting strategy.  (Overrides regular betting strategy.) */

var custom = {
    enabled: false,
    strategy: []
};
custom.strategy.push({ bet: 1, cashout: 1.08 });
custom.strategy.push({ bet: 4, cashout: 1.25 });
custom.strategy.push({ bet: 20, cashout: 1.25 });
custom.strategy.push(null); /* Skip a game. */
custom.strategy.push({ bet: 100, cashout: 1.25 });

/* Nyan chase!  (Overrides regular and custom betting strategies.) */

var nyanChase = {
    enabled: false,
    baseBet: 1,
    maxBets: 1000,
    stopOnSuccess: true,
    resumeBettingAfterStop: false
}

/*=====================================================================================================================
 The actual script.  Do not change unless you know what you're doing.
=====================================================================================================================*/

nyanChase.baseBet = Math.round(nyanChase.baseBet); /* Don't want this rounding differently as we increase it. */

if (checkVariables()) {
    var testFramework = {
        balance: 1000,
        playing: false
    }

    console.log("Script running. Current balance: " + (engine.getBalance() / 100.0));
    if (testMode) {
        console.log("Testing with a balance of " + getBalance());
    }

    var tracking = {
        startingBalance: getBalance(),
        bet: {
            real: null,
            rounded: null
        },
        cashout: {
            real: null,
            rounded: null
        },
        losses: 0,
        wins: 0,
        skipped: 0,
        skipping: 0,
        strategy: null
    };
    reset();
    
    var customPosition = null;
    resetCustom();
    
    var nyan = {
        bet: null,
        multiplier: null,
        games: null,
        totalGames: null,
        value: 1000,
        forceResumeBetting: false,
        getBet() {
            return {
                totalBet: this.bet * this.multiplier,
                maxGamesAtBet: Math.floor(this.value / this.multiplier)
            };
        }
    };
    resetNyan();
    
    var stopAfterWin = false;
    var strategies = {
        regular: "REGULAR",
        custom: "CUSTOM",
        nyan: "NYAN"
    };
    
    engine.on("game_starting", function(info) {
        if (nyanChase.enabled) {
            tracking.strategy = strategies.nyan;
            startNyan(info);
        }
        else if (custom.enabled) {
            tracking.strategy = strategies.custom;
            startCustom(info);
        }
        else {
            tracking.strategy = strategies.regular;
            start(info);
        }
    });
    
    engine.on("game_crash", function(data) {
        /* Bust logic should always match bet logic. */
        if (tracking.strategy == strategies.nyan) {
            bustNyan(data);
        }
        else if (tracking.strategy == strategies.custom) {
            bustCustom(data);
        }
        else {
            bust(data);
        }
    });
    
    function start(info) {
        if (tracking.skipping > 0) {
            if (tracking.skipped >= tracking.skipping) {
                tracking.skipping = 0; /* Reset. */
                if (testMode) {
                    testFramework.playing = false;
                }
            }
            else {
                console.log("Skipping game " + (tracking.skipped + 1) + "/" + tracking.skipping);
                return;
            }
        }
        
        if (getBalance() < tracking.bet.rounded) {
            stop("out of money");
            return;
        }
        
        if (!testMode) {
            engine.placeBet(tracking.bet.rounded * 100, Math.round(tracking.cashout.rounded * 100));
        }
        else {
            addTestBalance(-tracking.bet.rounded);
            testFramework.playing = true;
            console.log(">Betting " + tracking.bet.rounded + " at " + tracking.cashout.rounded + "x; new balance: " + getBalance());
        }
    }
    
    function bust(data) {
        var bust = data.game_crash / 100.0;
        if (tracking.skipping) {
            tracking.skipped++;
            console.log("Skipped game with bust at " + bust + "x");
            return;
        }
        
        var result = engine.lastGamePlay();
        if (testMode) {
            if (!testFramework.playing) {
                return;
            }
            result = (bust >= tracking.cashout.rounded) ? "WON" : "LOST";
            if (result == "WON") {
                addTestBalance(tracking.bet.rounded * tracking.cashout.rounded);
            }
        }
        
        if (result == "LOST") {
            if (onLose.reset) {
                reset();
            }
            else {
                applySettings(onLose);
            }
            log(result, bust);
            
            tracking.losses += 1;
            tracking.wins = 0;
            
            if (max.losses && tracking.losses >= max.losses) {
                stop("reached max losses");
                return;
            }
            if (max.totalLoss && (tracking.startingBalance - getBalance()) >= max.totalLoss) {
                stop("reached max loss");
                return;
            }
            
            applySkip(onLose.skip, bust);
        }
        else if (result == "WON") {
            if (onWin.reset) {
                reset();
            }
            else {
                applySettings(onWin);
            }
            log(result, bust);
            
            if (stopAfterWin) {
                stop("!stopAfterWin applied");
                return;
            }
            
            tracking.wins += 1;
            tracking.losses = 0;
            
            if (max.wins && tracking.wins >= max.wins) {
                stop("reached max wins");
                return;
            }
            if (max.totalWin && (getBalance() - tracking.startingBalance) >= max.totalWin) {
                stop("reached max win");
                return;
            }
            
            applySkip(onWin.skip, bust);
        }
    }
    
    function startCustom(info) {
        if ((customPosition + 1) > custom.strategy.length) {
            stop("custom strategy busted");
            return;
        }
        
        var entry = custom.strategy[customPosition];
        if (entry == null) {
            console.log("Skipping game.");
            if (testMode) {
                testFramework.playing = false;
            }
            return;
        }
        if (getBalance() < entry.bet) {
            stop("out of money");
            return;
        }
        
        if (!testMode) {
            engine.placeBet(entry.bet * 100, entry.cashout * 100);
        }
        else {
            addTestBalance(-entry.bet);
            testFramework.playing = true;
            console.log(">Betting " + entry.bet + " at " + entry.cashout + "x; new balance: " + getBalance());
        }
    }
    
    function bustCustom(data) {
        var bust = data.game_crash / 100.0;
        var result = engine.lastGamePlay();
        if (testMode) {
            if (!testFramework.playing) {
                if (customPosition > 0) {
                    logCustom(result, bust);
                    customPosition++;
                }
                return;
            }
            var entry = custom.strategy[customPosition];
            result = (bust >= entry.cashout) ? "WON" : "LOST";
            if (result == "WON") {
                addTestBalance(entry.bet * entry.cashout);
            }
        }
        
        if (result == "NOT_PLAYED" && customPosition > 0) {
            logCustom(result, bust);
            customPosition++;
        }
        
        if (result == "LOST") {
            logCustom(result, bust);
            customPosition++;
        }
        else if (result == "WON") {
            logCustom(result, bust);
            if (stopAfterWin) {
                stop("!stopAfterWin applied");
                return;
            }
            resetCustom();
        }
    }
    
    function startNyan(info) {
        var bet = nyan.getBet().totalBet;
        if (getBalance() < bet) {
            stop("out of money");
            return;
        }
        
        if (!testMode) {
            engine.placeBet(bet * 100, nyan.value * 100);
        }
        else {
            addTestBalance(-bet);
            testFramework.playing = true;
            console.log(">Looking for nyan; betting " + bet + "; new balance: " + getBalance());
        }
    }
    
    function bustNyan(data) {
        var bet = nyan.getBet();
        var bust = data.game_crash / 100.0;
        var result = engine.lastGamePlay();
        if (testMode) {
            if (!testFramework.playing) {
                return;
            }
            result = (bust >= nyan.value) ? "WON" : "LOST";
            if (result == "WON") {
                addTestBalance(bet.totalBet * nyan.value);
            }
        }
        
        nyan.games += 1;
        nyan.totalGames += 1;
            
        if (result == "LOST") {  
            logNyan(result, bust);
            
            if (nyanChase.maxBets && nyan.totalGames >= nyanChase.maxBets) {
                if (nyanChase.resumeBettingAfterStop) {
                    nyanChase.enabled = false;
                    resetNyan();
                    console.log("Reached max bets chasing nyan; resuming previous betting strategy.");
                }
                else {
                    stop("reached max bets");
                    return;
                }
            }
            
            if (nyan.games >= bet.maxGamesAtBet) {
                nyan.multiplier++;
                nyan.games = 0;
            }
        }
        else if (result == "WON") {
            logNyan(result, bust);
            console.log("Caught nyan!  It only took " + nyan.totalGames + " game" + (nyan.totalGames > 1 ? "s." : "."));
            
            if (stopAfterWin) {
                stop("!stopAfterWin applied");
                return;
            }
            
            if (nyanChase.stopOnSuccess) {
                if (nyanChase.resumeBettingAfterStop || nyan.forceResumeBetting) {
                    nyanChase.enabled = false;
                    nyanChase.forceResumeBetting = false;
                    resetNyan();
                    console.log("Resuming previous betting strategy.");
                    nyan.forceResumeBetting = false; /* If we're done chasing, reset this setting. */
                }
                else {
                    stop("caught nyan");
                    return;
                }
            }
            else {
                resetNyan();
            }
        }
    }

    engine.on("msg", function(data) {
        if (data.message) {
            if (data.username == engine.getUsername()) {
                if (data.message == "!cashout") {
                    if (testMode) {
                        console.log("Forced-cashout functionality unavailable in test mode.");
                    }
                    else {
                        engine.cashOut();
                    }
                    engine.chat("Script remotely cashed out.");
                }
                else if (data.message == "!stop") {
                    engine.chat("Script remotely stopped.");
                    engine.stop();
                }
                else if (data.message == "!stopafterwin") {
                    stopAfterWin = true;
                    engine.chat("Script remotely set to stop after the next win.");
                }
                else if (data.message == "!chase.start") {
                    if (nyanChase.enabled) {
                        engine.chat("Already chasing nyan!");
                    }
                    else {
                        resetNyan();
                        nyan.forceResumeBetting = true; /* If we're starting the chase via chat, always resume the previous betting strategy once we stop chasing. */
                        nyanChase.enabled = true;
                        engine.chat("Betting strategy paused. Nyan chase started!");
                    }
                }
                else if (data.message == "!chase.stop") {
                    if (!nyanChase.enabled) {
                        engine.chat("Not chasing nyan.");
                    }
                    else {
                        nyanChase.enabled = false;
                        engine.chat("Nyan chase stopped. Resuming previous betting strategy.");
                    }
                }
            }
        }
    });
}
else {
    engine.on("game_starting", function (data) {
        engine.stop();
    });
}

/*==================================
 Helper functions.
===================================*/

function getBalance() {
    return testMode ? testFramework.balance : (engine.getBalance() / 100.0);
}

function addTestBalance(value) {
    testFramework.balance = Math.round((testFramework.balance + value) * 100.0) / 100.0;
}

function reset() {
    if (autoAdjustBaseBet.enabled) {
        var newBaseBet = Math.floor(getBalance() * autoAdjustBaseBet.percentageOfBalance);
        if (newBaseBet < 1) {
            newBaseBet = 1;
        }
        if (newBaseBet != base.bet) {
            base.bet = newBaseBet;
            console.log("Automatically adjusted base bet to " + base.bet);
        }
    }
    
    tracking.bet.real = base.bet;
    tracking.cashout.real = base.cashout;
    round();
}

function resetCustom() {
    customPosition = 0;
}

function resetNyan() {
    nyan.bet = nyanChase.baseBet;
    nyan.multiplier = 1;
    nyan.games = 0;
    nyan.totalGames = 0;
}

function applySettings(settings) {
    tracking.bet.real *= settings.multiplyBet;
    tracking.bet.real += settings.increaseBet;
    if (tracking.bet.real < 1) {
        tracking.bet.real = 1;
    }
    
    tracking.cashout.real *= settings.multiplyCashout;
    tracking.cashout.real += settings.increaseCashout;
    if (tracking.cashout.real < 1) {
        tracking.cashout.real = 1.0;
    }
    
    round();
}

function applySkip(settings, bust) {
    if (settings.games > 0) {
        if ((settings.onlyIfBustAbove && bust > settings.onlyIfBustAbove) || (settings.onlyIfBustBelow && bust < settings.onlyIfBustBelow)) {
            tracking.skipping = settings.games;
        }
        else if (!(settings.onlyIfBustAbove || settings.onlyIfBustBelow)) {
            tracking.skipping = settings.games;
        }
    }
}

function round() {
    tracking.bet.rounded = Math.round(tracking.bet.real); /* Can only bet in whole numbers. */
    tracking.cashout.rounded = Math.round(tracking.cashout.real * 100.0) / 100.0;
}

function log(message, bust) {
    var info = "new bet = " + tracking.bet.rounded + ", new cashout = " + tracking.cashout.rounded + "x";
    console.log(message + " [" + bust + "x]: " + info);
}

function logCustom(message, bust) {
    var entry = custom.strategy[customPosition];
    var info;
    if (message == "WON") {
        entry = custom.strategy[0];
        info = "new bet = " + entry.bet + ", new cashout = " + entry.cashout + "x";
    }
    else {
        info = "no further bets";
        if ((customPosition + 1) < custom.strategy.length) {
            entry = custom.strategy[customPosition + 1];
            info = (entry == null) ? "skipping next game" : "new bet = " + entry.bet + ", new cashout = " + entry.cashout + "x";
        }
    }
    console.log(message + " [" + bust + "x]: " + info);
}

function logNyan(message, bust) {
    var info = "chasing nyan (game " + nyan.totalGames + " of " + (nyanChase.maxBets || "INF") + ")";
    console.log(message + " [" + bust + "x]: " + info);
}

function stop(message) {
    console.log("Stopping script: " + message);
    console.log("BALANCE: " + tracking.startingBalance + " (start) => " + getBalance() + " (end)");
    engine.stop();
}

/*==================================
 Startup check.
===================================*/

function checkVariables() {
    var errors = false;
    
    if (base.bet < 1) {
        console.error("base.bet must be at least 1.");
        errors = true;
    }
    if (base.cashout < 1) {
        console.error("base.cashout must be at least 1.");
        errors = true;
    }
    if (autoAdjustBaseBet.enabled && (autoAdjustBaseBet.percentageOfBalance < 0 || autoAdjustBaseBet.percentageOfBalance > 1)) {
        console.error("autoAdjustBaseBet.percentageOfBalance must be between 0 and 1 if autoAdjustBaseBet.enabled is true.");
        errors = true;
    }
    if (max.losses != null && max.losses < 1) {
        console.error("max.losses must be at least 1 if specified. Use null to disable.");
        errors = true;
    }
    if (max.wins != null && max.wins < 1) {
        console.error("max.wins must be at least 1 if specified. Use null to disable.");
        errors = true;
    }
    if (max.totalLoss != null && max.totalLoss < 1) {
        console.error("max.totalLoss must be at least 1 if specified. Use null to disable.");
        errors = true;
    }
    if (max.totalWin != null && max.totalWin < 1) {
        console.error("max.totalWin must be at least 1 if specified. Use null to disable.");
        errors = true;
    }
    if (onLose.multiplyBet <= 0) {
        console.error("onLose.multiplyBet must be positive. Use 1 to disable.");
        errors = true;
    }
    if (onLose.multiplyCashout <= 0) {
        console.error("onLose.multiplyCashout must be positive. Use 1 to disable.");
        errors = true;
    }
    if (onLose.skip.games < 0) {
        console.error("onLose.skip.games must be at least 0. Use 0 to disable.");
        errors = true;
    }
    if (onLose.skip.onlyIfBustAbove != null && onLose.skip.onlyIfBustAbove < 0) {
        console.error("onLose.skip.onlyIfBustAbove must be at least 0. Use null to disable.");
        errors = true;
    }
    if (onLose.skip.onlyIfBustBelow != null && onLose.skip.onlyIfBustBelow < 1) {
        console.error("onLose.skip.onlyIfBustBelow must be at least 1. Use null to disable.");
        errors = true;
    }
    if (onWin.multiplyBet <= 0) {
        console.error("onWin.multiplyBet must be positive. Use 1 to disable.");
        errors = true;
    }
    if (onWin.multiplyCashout <= 0) {
        console.error("onWin.multiplyCashout must be positive. Use 1 to disable.");
        errors = true;
    }
    if (onWin.skip.games < 0) {
        console.error("onWin.skip.games must be at least 0. Use 0 to disable.");
        errors = true;
    }
    if (onWin.skip.onlyIfBustAbove != null && onWin.skip.onlyIfBustAbove < 0) {
        console.error("onWin.skip.onlyIfBustAbove must be at least 0. Use null to disable.");
        errors = true;
    }
    if (onWin.skip.onlyIfBustBelow != null && onWin.skip.onlyIfBustBelow < 1) {
        console.error("onWin.skip.onlyIfBustBelow must be at least 1. Use null to disable.");
        errors = true;
    }
    if (custom.enabled && custom.strategy.length == 0) {
        console.error("custom.strategy must have at least one entry. Set custom.enabled to false to disable.");
        errors = true;
    }
    if (custom.enabled && custom.strategy.length > 0) {
        if (custom.strategy[0] == null) {
            console.error("custom.strategy[0] cannot be null.");
            errors = true;
        }
        for (var ii = 0; ii < custom.strategy.length; ii++) {
            var entry = custom.strategy[ii];
            if (entry != null) {
                if (entry.bet < 1) {
                    console.error("custom.strategy[" + ii + "].bet must be at least 1.");
                    errors = true;
                }
                if (entry.cashout < 1) {
                    console.error("custom.strategy[" + ii + "].cashout must be at least 1.");
                    errors = true;
                }
            }
        }
    }
    if (nyanChase.baseBet < 1) {
        console.error("nyanChase.baseBet must be at least 1.");
        errors = true;
    }
    if (nyanChase.maxBets != null && nyanChase.maxBets < 1) {
        console.error("nyanChase.maxBets must be at least 1. Use null to disable.");
        error = true;
    }
    
    if (errors) {
        console.error("Please fix script and try again.");
    }
    
    return !errors;
}
