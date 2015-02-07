var config = require("config");
var fs = require("mz/fs");
var Promise = require("bluebird");
var split = require("split");
var path = require("path");

exports.list = function* () {
  this.body = yield readLines();
};

function readLines() {
  return new Promise(function (resolve, reject) {
    var logFilename = path.normalize(config.get("logs.path") + "/" + config.get("name") + ".log");
    var lines = [];
    fs.createReadStream(logFilename)
      .pipe(split())
      .on("data", function (line) {
        if (line.trim().length > 0) {
          lines.push(JSON.parse(line));
        }
      }).on("end", function () {
        resolve(lines);
      }).on("error", reject);
  });
}