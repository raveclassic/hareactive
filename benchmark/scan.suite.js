var Suite = require("./default-suite").Suite;
var most = require("most");
var S = require("../dist/stream");
var B = require("../dist/behavior");
var Bo = require("./hareactive-old/dist/behavior");
var So = require("./hareactive-old/dist/stream");

var n = 100000;
var testData = [];
var result = 0;

for (var i = 0; i < n; i++) {
    testData[i] = i;
    result += i;
}

function sum(curr, val) {
    return curr + val;
}

function pushArray(arr, ev) {
    for (var i = 0; i < arr.length; ++i) {
        ev.push(arr[i]);
    }
}

module.exports = Suite("scan-stream")

  .add("Stream old", function(defered) {
    var j = So.sinkStream();
    var s = Bo.at(
      So.scanS(sum, 0, j)
    ).subscribe(function(e) {
      if (e === result) {
        defered.resolve();
      }
    }, s);
    var i = 0;
    var l = testData.length;
    pushArray(testData, j);
  }, { defer: true })

  .add("Stream", function(defered) {
    var j = S.sinkStream();
    var s = B.at(S.scanS(sum, 0, j));
    S.subscribe(function(e) {
      if (e === result) {
        defered.resolve();
      }
    }, s);
    var i = 0;
    var l = testData.length;
    pushArray(testData, j);
  }, { defer: true })

  .add("most", function(defered) {
    most
      .from(testData)
      .scan(sum, 0)
      .observe(function(e) {
        if (e === result) {
          defered.resolve();
        }
      });
  }, { defer: true })

  .run({ "async": true });
