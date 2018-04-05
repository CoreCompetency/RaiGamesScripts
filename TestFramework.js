/* Do not change. */
var balance = { real: "REAL", example: "EXAMPLE" };

/*==================================
This script will turn any gambling script into a test script; just put it at the top
of the script you'd like to test and it will take care of the rest.

Once you've tested the script, you can either remove this script from the top or set
test.enabled to false in the settings below.

There are two modes available for testing:  balance.example will test with a starting
balance of 10 nano, and balance.real will test with your current balance.

Since there won't be any bonuses awarded to your test bets, be aware that the results
of the test will run a bit conservative.
===================================*/

/*==================================
 Settings.
===================================*/

var test = {
    enabled: true,
    mode: balance.example
};

/*====================================================================================
 The actual script.  Do not change unless you know what you're doing.
======================================================================================*/

if (test.enabled) {
    var result = { notPlayed: "NOT_PLAYED", won: "WON", lost: "LOST" };

    var testFramework = {
        balance: test.mode == balance.real ? scale(engine.getBalance()) : 10000,
        result: result.notPlayed,
        delay: {
            "game_crash": []
        }
    };

    /*==================================
     Tracking.
    ===================================*/

    engine._bind = engine.on;
    engine.on = function(event, func) {
        engine._bind(event, function(data) {
            /* Make sure to run any delayed functions after the test framework runs its function. */
            func(data);
            run(event, data);
        });
    };

    engine.on("game_starting", function(data) {
        testFramework.game = data.game_id;
        testFramework.result = result.notPlayed;
    });

    engine.on("game_started", function(data) {
        testFramework.running = true;
    });

    engine.placeBet = function(bet, cashout) {
        testFramework.current = {
            bet: scale(bet),
            cashout: scale(cashout)
        };
        subtract(testFramework.current.bet);
        testFramework.lastGamePlayed = testFramework.game;
    }

    engine.on("game_crash", function(data) {
        testFramework.running = false;
        if (testFramework.current) {
            var bust = scale(data.game_crash);
            if (bust < testFramework.current.cashout) {
                testFramework.result = result.lost;
            }
            else {
                add(testFramework.current.bet * testFramework.current.cashout);
                testFramework.result = result.won;
            }
            testFramework.current = null;
        }
    });

    var error = {
        notPlaying: "Cashing out error:  NO_BET_PLACED",
        noGame:     "Cashing out error:  GAME_NOT_IN_PROGRESS",
        unknown:    "Cashing out error:  UNKNOWN_STATE"
    };
    engine.cashOut = function(callback) { /* The callback function doesn't seem to ever be called, so just ignoring it. */
        if (testFramework.running == false) {
            console.warn(error.noGame);
        }
        else if (testFramework.running == true) {
            if (testFramework.current) {
                add(testFramework.current.bet * scale(engine.getCurrentPayout()));
                testFramework.current = null;
                testFramework.result = result.won;
            }
            else {
                console.warn(error.notPlaying);
            }
        }
        else {
            console.warn(error.unknown);
        }
    }

    engine.on = function(event, func) {
        if (testFramework.delay.hasOwnProperty(event)) {
            testFramework.delay[event].push(func);
        }
        else {
            engine._bind(event, func);
        }
    };

    /*==================================
     Access functions.
    ===================================*/

    engine.getBalance = function() {
        return round(testFramework.balance * 100, true);
    }

    engine.lastGamePlay = function() {
        return testFramework.result;
    }

    engine.lastGamePlayed = function() {
        return testFramework.lastGamePlayed && testFramework.lastGamePlayed == (testFramework.game - 1);
    }

    /*==================================
     Helper functions.
    ===================================*/

    function add(value) {
        testFramework.balance = round(testFramework.balance + value);
    }

    function subtract(value) {
        add(-value);
    }

    function scale(value) {
        return round(value / 100.0);
    }

    function round(value, whole) {
        if (whole) {
            return Math.round(value);
        }
        return Math.round(value * 100.0) / 100.0;
    }

    function run(event, data) {
        if (testFramework.delay.hasOwnProperty(event)) {
            var events = testFramework.delay[event];
            for (var ii = 0; ii < events.length; ii++) {
                events[ii](data);
            }
        }
    }
}
