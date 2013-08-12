(function(exports) {

  'use strict'

  ////////////////////////////////////////////////////////////////////////////
  // Arm - one of the multi-armed bandit's arms, tracking observed rewards. //
  ////////////////////////////////////////////////////////////////////////////

  function Arm() { }

  Arm.prototype.count = 0

  Arm.prototype.sum = 0

  Arm.prototype.reward = function(value) {

    this.count++
    this.sum += value
  }

  Arm.prototype.sample = function() {
    return this.rbeta(1 + this.sum, 1 + this.count - this.sum)
  }

  Arm.prototype.rbeta = function(a, b) {

    // Adapted from https://github.com/CamDavidsonPilon/Probabilistic-Programming-and-Bayesian-Methods-for-Hackers/master/Chapter6_Priorities/d3bandits.js,
    // which references Simulation and MC, Wiley.
    //
    // This apparently generates random numbers from a beta distribution:
    // http://en.wikipedia.org/wiki/Beta_distribution
    // I don't really know why this works
    // -- it's just adapted from d3bandits.js.
    //
    // For comparison, you might want to review the R project's rbeta code:
    // https://svn.r-project.org/R/trunk/src/nmath/rbeta.c

    var sum = a + b
      , ratio = a / b
      , min = Math.min(a, b)
      , lhs, rhs, y, r1, r2, lambda

    lambda = min <= 1 ?
      min :
      Math.sqrt(
        (2 * a * b - a - b) /
        (sum - 2))

    do {

      r1 = this.random()
      r2 = this.random()
      y = Math.pow(1 / r1 - 1, 1 / lambda)
      lhs = 4 * r1 * r2 * r2
      rhs =
        Math.pow(y, a - lambda) *
        Math.pow((1 + ratio) / (1 + ratio * y), sum)
    } while(lhs >= rhs)

    return ratio * y / (1 + ratio * y)
  }

  Arm.prototype.random = Math.random;

  ///////////////////////////////////////////////////////////////////////////
  // Bandit - the n-armed bandit which selects arms from observed rewards. //
  ///////////////////////////////////////////////////////////////////////////

  function Bandit(options) {

    this.arms = []

    for(var a = 0; a < (options || {}).numberOfArms; a++) {
      this.arms.push(new Arm())
    }
  }

  Bandit.prototype.selectArm = function() {

    var max = -Infinity
      , indexOfMax = -1

    for (var armIndex = 0; armIndex < this.arms.length; armIndex++) {

      var sample = this.arms[armIndex].sample()
      if(sample > max) {

        max = sample
        indexOfMax = armIndex
      }
    }

    return indexOfMax
  }

  Bandit.Arm = Arm;

  exports.Bandit = Bandit

}(typeof exports === 'undefined' ? this : exports))
