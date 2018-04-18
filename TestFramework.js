/* Do not change. */
var testBalance = { real: "REAL", example: "EXAMPLE" };

/*==================================
This script will turn any gambling script into a test script; just put it at the top
of the script you'd like to test and it will take care of the rest.

Once you've tested the script, you can either remove this script from the top or set
testSettings.enabled to false in the settings below.

There are two modes available for testing:  testBalance.example will test with a
starting balance of 10 nano, and testBalance.real will test with your current balance.

Since there won't be any bonuses awarded to your test bets, be aware that the results
of the test will run a bit conservative.
===================================*/

/*==================================
 Settings.
===================================*/

var testSettings = {
    enabled: true,
    mode: testBalance.example
};

/*====================================================================================
 The actual script.  Do not change unless you know what you're doing.
======================================================================================*/

if (testSettings.enabled) {
    var result = { notPlayed: "NOT_PLAYED", won: "WON", lost: "LOST" };

    var testHelper = {
        add: function(value) {
            testTracking.balance = this.round(testTracking.balance + value);
        },
        subtract: function(value) {
            this.add(-value);
        },
        scale: function(value) {
            return this.round(value / 100.0);
        },
        round: function(value, whole) {
            if (whole) {
                return Math.round(value);
            }
            return Math.round(value * 100.0) / 100.0;
        },
        run: function(event, data) {
            if (testTracking.delay.hasOwnProperty(event)) {
                var events = testTracking.delay[event];
                for (var ii = 0; ii < events.length; ii++) {
                    events[ii](data);
                }
            }
        }
    };

    var testTracking = {
        balance: testSettings.mode == testBalance.real ? testHelper.scale(engine.getBalance()) : 10000,
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
            testHelper.run(event, data);
        });
    };

    engine.on("game_starting", function(data) {
        testTracking.game = data.game_id;
        testTracking.result = result.notPlayed;
    });

    engine.on("game_started", function(data) {
        testTracking.running = true;
    });

    engine.placeBet = function(bet, cashout) {
        testTracking.current = {
            bet: testHelper.scale(bet),
            cashout: testHelper.scale(cashout)
        };
        testHelper.subtract(testTracking.current.bet);
        testTracking.lastGamePlayed = testTracking.game;
    }

    engine.on("game_crash", function(data) {
        testTracking.running = false;
        if (testTracking.current) {
            var bust = testHelper.scale(data.game_crash);
            if (bust < testTracking.current.cashout) {
                testTracking.result = result.lost;
            }
            else {
                testHelper.add(testTracking.current.bet * testTracking.current.cashout);
                testTracking.result = result.won;
            }
            testTracking.current = null;
        }
    });

    testTracking.errors = {
        noGame:     "Cashing out error:  GAME_NOT_IN_PROGRESS",
        notPlaying: "Cashing out error:  NO_BET_PLACED",
        unknown:    "Cashing out error:  UNKNOWN_STATE"
    };
    engine.cashOut = function(callback) { /* The callback function doesn't seem to ever be called, so just ignoring it. */
        if (testTracking.running == false) {
            console.warn(testTracking.errors.noGame);
        }
        else if (testTracking.running == true) {
            if (testTracking.current) {
                testHelper.add(testTracking.current.bet * testHelper.scale(engine.getCurrentPayout()));
                testTracking.current = null;
                testTracking.result = result.won;
            }
            else {
                console.warn(testTracking.errors.notPlaying);
            }
        }
        else {
            console.warn(testTracking.errors.unknown);
        }
    }

    engine.on = function(event, func) {
        if (testTracking.delay.hasOwnProperty(event)) {
            testTracking.delay[event].push(func);
        }
        else {
            engine._bind(event, func);
        }
    };

    /*==================================
     Access functions.
    ===================================*/

    engine.getBalance = function() {
        return testHelper.round(testTracking.balance * 100, true);
    }

    engine.lastGamePlay = function() {
        return testTracking.result;
    }

    engine.lastGamePlayed = function() {
        return testTracking.lastGamePlayed && testTracking.lastGamePlayed == (testTracking.game - 1);
    }

    /*==================================
     User alert.
    ===================================*/

    console.log("Testing with a balance of " + testHelper.scale(engine.getBalance()));
}
