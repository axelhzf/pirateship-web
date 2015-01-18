var path = require("path");
var fs = require("mz/fs");
var VideoOrganizer = require("video-organizer");
var config = require("config");
var Promise = require("bluebird");
var mkdirp = Promise.promisify(require("mkdirp"));
var log = require("barbakoa").logger.child({component: "video-organizer"});
var subtitlesDownloader = require("subtitles-downloader");
var co = require("co");
var Recent = require("../models/Recent");


module.exports = {
  start: start,
  stop: stop
};

var videoOrganizer;

function* start() {
  if (!config.get("postProcess.enable")) {
    log.info("Postprocess not enabled");
    return;
  }

  var basePath = config.get("postProcess.downloadedFolder");
  var destPath = config.get("postProcess.destinationFolder");

  try {
    yield createIfNotExists(basePath);
    yield createIfNotExists(destPath);

    var options = {
      srcPath: basePath,
      destPath: destPath,
      logger: log
    };
    videoOrganizer = new VideoOrganizer(options);

    videoOrganizer.on("processedFile", function (e) {
      co(function * () {
        log.info("Processed file %s to %s", e.src, e.dest);

        yield Recent.create({file: path.basename(e.dest)});

        var result = yield {
          "spa": subtitlesDownloader.downloadSubtitle(e.dest, "spa"),
          "eng": subtitlesDownloader.downloadSubtitle(e.dest, "eng")
        };
        log.info(result, "Subtitles downloaded");
      }).catch(function (e) {
        log.error(e, "Error downloading subtitles");
      });
    });

    videoOrganizer.start();

  } catch (e) {
    log.error("VideoOrganizer service error", e);
  }
}

function* createIfNotExists(folder) {
  var exist = yield fs.exists(folder);
  if (!exist) {
    log.debug("Creating not existing folder %s", folder);
    yield mkdirp(folder);
  }
}

function stop() {
  if (watcher) {
    videoOrganizer.stop();
    videoOrganizer = undefined;
  }
}