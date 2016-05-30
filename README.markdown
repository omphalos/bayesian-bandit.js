#bayesian-bandit.js

This is an adaptation of the Bayesian Bandit code from [Probabilistic Programming and Bayesian Methods for Hackers](http://camdavidsonpilon.github.io/Probabilistic-Programming-and-Bayesian-Methods-for-Hackers/), specifically [d3bandits.js](https://raw.github.com/CamDavidsonPilon/Probabilistic-Programming-and-Bayesian-Methods-for-Hackers/master/Chapter6_Priorities/d3bandits.js).

The code has been rewritten to be more idiomatic and also usable as a browser script or npm package.  Additionally, unit tests are included.

#Quick Start

From node.js:

    npm install bayesian-bandit
    node

Then:

    var Bandit = require('bayesian-bandit').Bandit

In the browser:

    <script src="https://raw.github.com/omphalos/bayesian-bandit.js/master/bayesian-bandit.js"></script>

Sample JavaScript:

    var bandit = new Bandit({ numberOfArms: 2 })

    bandit.arms[0].reward(0) // Arm 0 loses once.
    bandit.arms[0].reward(1) // Arm 0 wins once.

    bandit.arms[1].reward(0) // Arm 1 loses once.
    bandit.arms[1].reward(1) // Arm 1 wins once.
    bandit.arms[1].reward(1) // Arm 1 wins twice.

    bandit.selectArm() // Arm 1 is more likely, so this probably returns 1

If you have pre-existing data that you want to load, you can explicitly pass in data via constructor.
The following creates a bandit with 3 arms 

    var bandit = new Bandit({
        arms: [{ count: 10, sum: 2 },
                { count: 20, sum: 10 },
                { count: 15: sum: 1}]
    })

You can also take advantage of the rewardMultiple function on the arms:

    var bandit = new Bandit({ numberOfArms: 3 })
    
    bandit.arms[0].rewardMultiple(10, 2)  // Arm 0 wins 2 of 10 times
    bandit.arms[1].rewardMultiple(20, 10) // Arm 1 wins 10 of 20 times 
    bandit.arms[2].rewardMultiple(15, 1)  // Arm 2 wins 1 of 15 times

#Unit Tests

The unit tests use nodeunit, which should get installed with:

    npm install

Then you can run unit tests with:

    npm test
