var testCase = require('nodeunit').testCase
  , Bandit = require('./bayesian-bandit.js').Bandit

module.exports = testCase({

  'Arm': testCase({

    'reward should increase the count': function(test) {

      var arm = new Bandit.Arm()

      arm.reward()
      arm.reward()

      test.equal(arm.count, 2)
      test.done()
    },

    'reward should increase the sum': function(test) {

      var arm = new Bandit.Arm()

      arm.reward(0)
      arm.reward(1)
      arm.reward(1)

      test.equal(arm.sum, 2)
      test.done()
    },

    'sample should sample from the rbeta distribution': function(test) {

      var arm = new Bandit.Arm()
      arm.rbeta = function() { return 33 }

      var sample = arm.sample()

      test.equal(sample, 33)
      test.done()
    },

    'sample should pass 1+sum as the 1st rbeta param': function(test) {

      var arm = new Bandit.Arm()
        , passed

      arm.rbeta = function() { passed = arguments }
      arm.sum = 33

      arm.sample()

      test.equal(passed[0], 34) // 1 + 33
      test.done()
    },

    'sample should pass 1+ct-sum as the 2nd rbeta param': function(test) {

      var arm = new Bandit.Arm()
        , passed

      arm.rbeta = function() { passed = arguments }
      arm.count = 15
      arm.sum = 10

      arm.sample()

      test.equal(passed[1], 6) // 1 + 15 - 10
      test.done()
    },

    'rbeta': testCase({

      'a=11, b=16, two random draws': function(test) {

        var sample = rbetaTest({
          a: 11,
          b: 16,
          fakeRandomNumbers: [0.1, 0.2]
        })

        test.equal(sample, 0.56)
        test.done()
      },

      'a=1, b=1, two random draws': function(test) {

        var sample = rbetaTest({
          a: 1,
          b: 1,
          fakeRandomNumbers: [0.1, 0.2]
        })

        test.equal(sample, 0.9)
        test.done()
      },

      'a=10, b=10, two random draws': function(test) {

        var sample = rbetaTest({
          a: 10,
          b: 10,
          fakeRandomNumbers: [0.1, 0.2]
        })

        test.equal(sample, 0.67)
        test.done()
      },

      'a=10, b=10, four random draws': function(test) {

        var sample = rbetaTest({
          a: 10,
          b: 10,
          fakeRandomNumbers: [0.99, 0.99, 0.1, 0.1]
        })

        test.equal(sample, 0.67)
        test.done()
      }
    }),
  }),

  'Bandit': testCase({

    'new Bandit should create the specified number of arms': function(test) {

      var bandit = new Bandit({ numberOfArms: 3 })

      test.equal(bandit.arms.length, 3)
      test.done()
    },

    'when nothing is passed new Bandit should create 0 arms': function(test) {

      var bandit = new Bandit()

      test.equal(bandit.arms.length, 0)
      test.done()
    },

    'selectArm should return the arm with the largest sample': function(test) {

      var bandit = new Bandit({ numberOfArms: 3 })
      bandit.arms[0].sample = function() { return 0.2; }
      bandit.arms[1].sample = function() { return 0.9; }
      bandit.arms[2].sample = function() { return 0.3; }

      var selected = bandit.selectArm()

      test.equal(selected, 1)
      test.done()
    },

    'should explore all arms': function(test) {

      var bandit = new Bandit({ numberOfArms: 2 })
      bandit.arms[0].probability = 0.3
      bandit.arms[0].probability = 0.8

      pullArms({ bandit: bandit, times: 100 })

      test.ok(bandit.arms[0].count > 1)
      test.ok(bandit.arms[1].count > 1)

      test.done()
    },

    'should converge on the optimal arm': function(test) {

      var bandit = new Bandit({ numberOfArms: 2 })
      bandit.arms[0].probability = 0.1
      bandit.arms[1].probability = 0.9

      pullArms({ bandit: bandit, times: 100 })

      test.ok(bandit.arms[0].count < 10)
      test.ok(bandit.arms[1].count > 90)

      test.done()
    }
  })
})

function fakeRandom(numbers) {

  return function getNextFakeRandomNumber() {

    if(!numbers.length) {
      console.log('unexpected call to getNextFakeRandomNumber')
      throw 'unexpected call to getNextFakeRandomNumber'
    }

    return numbers.shift()
  }
}

function rbetaTest(options) {

  var arm = new Bandit.Arm()

  arm.random = fakeRandom(options.fakeRandomNumbers)
  var sample = arm.rbeta(options.a, options.b)
    , rounded = Math.round(sample * 100) / 100

  return rounded
}

function pullArms(options) {

  var bandit = options.bandit
    , times = options.times

  for(var i = 0; i < times; i++) {

    var selected = bandit.selectArm()
      , arm = bandit.arms[selected]

    arm.reward(Math.random() < arm.probability ? 1 : 0)
  }
}