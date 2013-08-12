#bayesian-bandit.js

This is an adaptation of the Bayesian Bandit code from [Probabilistic Programming and Bayesian Methods for Hackers](http://camdavidsonpilon.github.io/Probabilistic-Programming-and-Bayesian-Methods-for-Hackers/), specifically [d3bandits.js](https://raw.github.com/CamDavidsonPilon/Probabilistic-Programming-and-Bayesian-Methods-for-Hackers/master/Chapter6_Priorities/d3bandits.js).

The code has been modified to be reusable in the browser or as an npm package.

* Quick Start

From node.js:

    npm install bayesian-bandit
    node

Then:

    var Bandit = require('bayesian-bandit').Bandit

In the browser:

    <script src="//github.com/omphalos/bayesian-bandit/bayesian-bandit.js"></script>

Sample JavaScript:

    var bandit = new Bandit({ numberOfArms: 2 })

    bandit.arms[0].reward(0) // Arm 0 loses once.
    bandit.arms[0].reward(1) // Arm 0 wins once.

    bandit.arms[1].reward(0) // Arm 1 loses once.
    bandit.arms[1].reward(1) // Arm 1 wins once.
    bandit.arms[1].reward(1) // Arm 1 wins twice.

    bandit.selectArm() // Arm 1 is more likely, so this probably returns 1

* Unit Tests

The unit tests use nodeunit, so you can set that up by typing:

    npm install

Then you can run unit tests with:

    node tests.js
