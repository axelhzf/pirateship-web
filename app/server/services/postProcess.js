var fs = require("mz/fs");
var downloadPostProcess = require("download-post-process");
var config = require("config");
var Promise = require("bluebird");
var mkdirp = Promise.promisify(require("mkdirp"));

var debug = require("debug")("pirateship:postProcess");

module.exports = {
  start: start,
  stop: stop
};

var watcher;

function* start() {
  console.log("start");

  if (!config.get("postProcess.enable")) {
    debug("Post process not enabled");
    return;
  }

  var basePath = config.get("postProcess.downloadedFolder");
  var destPath = config.get("postProcess.destinationFolder");

  try {
    yield createIfNotExists(basePath);
    yield createIfNotExists(destPath);

    watcher = downloadPostProcess.watcher(basePath, destPath);
    watcher.start();

    debug("Starting postProcess watcher %s -> %s", basePath, destPath);

  } catch (e) {
    console.error("postProcess service error", e);
  }
}

function* createIfNotExists(folder) {
  var exist = yield fs.exists(folder);
  if (!exist) {
    debug("Creating not existing folder %s", folder);
    yield mkdirp(folder);
  }
}

function stop() {
  if (watcher) {
    watcher.stop();
    watcher = undefined;
  }
}