(function(exports) {

  'use strict'

  ////////////////////////////////////////////////////////////////////////////
  // Arm - one of the multi-armed bandit's arms, tracking observed rewards. //
  ////////////////////////////////////////////////////////////////////////////

  /**
   * @param {object} [args]
   * @param {int} [args.count] - number of attempts on this arm
   * @param {number} [args.sum] - total value accumulated on this arm
   * @constructor
     */
  function Arm(args) {
    this.count = args && args.count || 0
    this.sum = args && args.sum || 0
  }

  /**
   * @param {number} value
   *
   * Increments number of attempts on the arm by one and the total accumulated
   * value by value
   */
  Arm.prototype.reward = function(value) {

    this.count++
    this.sum += value
  }

  /**
   * @param {int} numTries
   * @param {number} totalValue
   *
   * Increments the number of attempts on the arm and the total value
   * accumulated during those attempts.
   */
  Arm.prototype.rewardMultiple = function(numTries, totalValue) {
    this.count += numTries
    this.sum += totalValue
  }

  /**
   * @returns {number} between 0 and 1
   */
  Arm.prototype.sample = function() {
    return this.rbeta(1 + this.sum, 1 + this.count - this.sum)
  }

  /**
   * @param {int} a
   * @param {int} b
   * @returns {number} - number between 0 and 1
   *
   * Adapted from https://github.com/CamDavidsonPilon/Probabilistic-Programming-and-Bayesian-Methods-for-Hackers/master/Chapter6_Priorities/d3bandits.js,
   * which references Simulation and MC, Wiley.
   *
   * This apparently generates random numbers from a beta distribution:
   * http://en.wikipedia.org/wiki/Beta_distribution
   * I don't really know why this works -- it's just adapted from d3bandits.js
   *
   * For comparison, you might want to review the R project's rbeta code:
   * https://svn.r-project.org/R/trunk/src/nmath/rbeta.c
   *
   */
  Arm.prototype.rbeta = function(a, b) {

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

  /**
   * @param {object} [options]
   * @param {Array.<{count: int, sum: number}>} [options.arms]
   *      - Initialize the bandit with arms specified by the data provided
   *
   * @param {int} [options.numberOfArms]
   *      - Initialize the bandit with a number of empty arms
   *
   * Note, only one of options.arms and options.numberOfArms should
   * be provided.  If both are provided, options.arms takes precedence and
   * numberOfArms will be ignored.
   *
   * @constructor
     */
  function Bandit(options) {

    this.arms = []

    // If options.arms is explicitly passed, initialize the arms array with it
    if (options && options.arms) {
      for (var i = 0; i < options.arms.length; i++) {
        this.arms.push(new Arm(options.arms[i]))
      }
    } else { // Otherwise initialize empty arms based on options.numberOfArms
      for (var a = 0; a < (options || {}).numberOfArms; a++) {
        this.arms.push(new Arm())
      }
    }
  }

  /**
   * @returns {int} - index of the arm chosen by the bandit algorithm
   */
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
